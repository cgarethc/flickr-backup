# flickr-backup

For a full run-down see my [Medium Story](https://cgarethc.medium.com/saas-prepper-backing-up-my-flickr-collection-with-a-raspberry-pi-402de3a6178d)

This tool is designed to backup all the albums in a Flickr account to the local filesystem.
I use it on a Raspberry Pi with an external USB hard drive, run once a day with a cron job.

I use a FAT32 formatted drive for maximum interoperability between OSes. This does mean that
many common characters are not permitted in filenames. Because the names of photos are used
in the filenames to make them self-describing, the tool will sanitise the names.

* Rename `config.example.js` to `config.js` and edit to add your Flickr API key and NSID
* Run `npm run build` to create a single file `build/server.js`
* Run the file with `node server.js`
* A new directory will be created called "files" with one directory per album and one file per photo/video in each - if a photo or video is in more than one album, then a copy will be backed up in each

`server.js` can be executed on a Raspberry Pi model 3 or above running Raspberry Pi OS with Node.js installed
