# flickr-backup

For a full run-down see my [Medium Story](https://cgarethc.medium.com/saas-prepper-backing-up-my-flickr-collection-with-a-raspberry-pi-402de3a6178d)

This tool is designed to backup all the albums in a Flickr account to the local filesystem.
I use it on a Raspberry Pi with an external USB hard drive, run once a day with a cron job.

* Rename `config.example.js` to `config.js` and edit to add your Flickr API key and NSID
* Run `npm run build` to create a single file `build/server.js`
* Run the file with `node server.js`

`server.js` can be executed on a Raspberry Pi model 3 or above running Raspberry Pi OS with Node.js installed
