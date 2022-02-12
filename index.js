const Flickr = require('flickr-sdk');
const sanitize = require("sanitize-filename");
const fs = require("fs");

const config = require('./config');

const flickrAPIKey = config.flickrAPIKey;
const flickr = new Flickr(flickrAPIKey);

(async () => {
  let res = await flickr.photosets.getList({ user_id: config.flickrNSID });
  console.log(`${res.body.photosets.photoset.length} photosets found`);
  for (let album of res.body.photosets.photoset) {
    const updatedDate = new Date(parseInt(album.date_update) * 1000);
    console.debug(`Checking "${album.title._content}" last updated ${updatedDate}`);

    let processThisAlbum = false;
    const sanitizedFileName = `./files/${sanitize(album.title._content)}`;
    console.debug('Checking if album exists on disk already', sanitizedFileName);
    if (!fs.existsSync(sanitizedFileName)) {
      console.debug(`Directory doesn't exist, creating it`);
      processThisAlbum = true;
      fs.mkdirSync(sanitizedFileName);
    }
    else {

    }

    if (processThisAlbum) {
      res = await flickr.photosets.getPhotos({ user_id: config.flickrNSID, photoset_id: album.id });
      console.log(`${res.body.photoset.photo.length} photos found`);
      try {
        const infoFileName = `${sanitizedFileName}/info.json`;
        fs.writeFileSync(infoFileName, JSON.stringify({ processed: new Date().toISOString() }));
      } catch (err) {
        console.error(err);
      }
    }

  }
})();