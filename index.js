const Flickr = require('flickr-sdk');

const config = require('./config');

const flickrAPIKey = config.flickrAPIKey;
const flickr = new Flickr(flickrAPIKey);

(async () => {
  const res = await flickr.photosets.getList({ user_id: config.flickrNSID });
  console.log(`${res.body.photosets.photoset.length} photosets found`);
  for(let album of res.body.photosets.photoset) {
    const updatedDate = new Date(parseInt(album.date_update) * 1000);
    console.log(`${album.title._content} ${updatedDate.toLocaleDateString()}`);
  }
})();