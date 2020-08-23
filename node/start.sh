#!/bin/sh

mount -t cifs $(cat $FILES_URI) /mnt/files -o vers=3.0,username=$(cat $FILES_USERNAME),password=$(cat $FILES_PASSWORD),dir_mode=0755,file_mode=0755,serverino
cd /var/www
node index
