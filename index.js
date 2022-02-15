const Flickr = require('flickr-sdk');
const sanitize = require("sanitize-filename");
const fs = require("fs");
const request = require("superagent");
const sanitise = require("./sanitise").sanitise;

const config = require('./config');

const flickrAPIKey = config.flickrAPIKey;
const flickr = new Flickr(flickrAPIKey);

(async () => {
  if (!fs.existsSync('./files')) {
    fs.mkdirSync('./files');
  }

  let res = await flickr.photosets.getList({ user_id: config.flickrNSID });
  console.log(`${res.body.photosets.photoset.length} photosets found`);
  for (let album of res.body.photosets.photoset) {
    const updatedDate = new Date(parseInt(album.date_update) * 1000);
    console.debug(`Checking "${album.title._content}" last updated ${updatedDate}`);

    let processThisAlbum = false;
    const sanitizedFileName = `./files/${sanitize(album.title._content)}`;
    const infoFileName = `${sanitizedFileName}/info.json`;
    console.debug('Checking if album exists on disk already', sanitizedFileName);
    if (!fs.existsSync(sanitizedFileName)) {
      // never seen this album before, create the directory for it
      console.debug(`Directory doesn't exist, creating it`);
      processThisAlbum = true;
      fs.mkdirSync(sanitizedFileName);
    }
    else {
      // check the processed time in the info.json against the last update time on the album
      if (!fs.existsSync(infoFileName)) {
        processThisAlbum = true;
      }
      else {
        const info = JSON.parse(fs.readFileSync(infoFileName, 'utf8'));
        console.debug('last processed', info.processed);
        const lastProcessedDate = new Date(info.processed);
        if (updatedDate.getTime() > lastProcessedDate.getTime()) {
          // the album has been updated since we last processed it
          console.log('album has been updated since we last processed it');
          processThisAlbum = true;
        }
        else {
          console.log('album has not been updated since last processed');
        }
      }
    }

    if (processThisAlbum) {
      res = await flickr.photosets.getPhotos({ user_id: config.flickrNSID, photoset_id: album.id });
      console.log(`${res.body.photoset.photo.length} photos found`);
      let counter = 1;
      for (let photo of res.body.photoset.photo) {
        let originalUrl;
        try {
          const photoInfoRes = await flickr.photos.getInfo({ photo_id: photo.id });
          const photoFormat = photoInfoRes.body.photo.originalformat;
          const photoTitle = photoInfoRes.body.photo.title._content;
          const media = photoInfoRes.body.photo.media;
          const photoRes = await flickr.photos.getSizes({ photo_id: photo.id });

          const allSizes = photoRes.body.sizes.size;

          if (media === 'photo') {
            originalUrl = allSizes.find(size => size.label === 'Original').source;
          }
          else if (media === "video") {
            const labelsBestToWorst = ['1080p', '720p', '360p'];
            for (let label of labelsBestToWorst) {
              const size = allSizes.find((size) => size.label === label);
              if (size) {
                originalUrl = size.source;
                break;
              }
            }
          } else {
            throw new Error(`Unknown media type ${media}`);
          }

          if (originalUrl) {
            const sanitizedPhotoTitle = sanitise(sanitize(photoTitle));
            console.debug(`writing photo ${counter++} of ${res.body.photoset.photo.length}`, sanitizedPhotoTitle);
            const outputFilename = `${sanitizedFileName}/${sanitizedPhotoTitle}-${photo.id}.${photoFormat}`;
            const file = fs.createWriteStream(outputFilename);
            request
              .get(originalUrl)
              .retry(2)
              .timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
                deadline: 60000, // but allow 1 minute for the file to finish loading.
              })
              .pipe(file);
          }
          else {
            console.warn('No URL found for photo, not writing', JSON.stringify(allSizes));
          }
        } catch (err) {
          console.error('Failed to back up the file', originalUrl, err);
        }

      }
      console.debug('writing info.json');
      fs.writeFileSync(infoFileName, JSON.stringify({ processed: new Date().toISOString() }));
    }

  }

  console.log('done');
})();