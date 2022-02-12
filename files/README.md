# Backup storage directory

This is where the actual backup is stored. Files will be stored with one directory per album
plus a directory for orphans that are not in an album called `_orphans`.

Each time the backup is run, it won't try to process a directory if the mtime of that directory is later than the last update time of the corresponding album.
