#!/bin/sh

# Validation.
if [ ! $APPINSIGHTS_INSTRUMENTATIONKEY ];
then
    echo "Warning: Application Insights is not setup.  Application will log to console."
fi

# Mount Azure Storage file share.
mount -t cifs $(cat $FILES_URI) /mnt/files -o vers=3.0,username=$(cat $FILES_USERNAME),password=$(cat $FILES_PASSWORD),dir_mode=0755,file_mode=0755,serverino
cd /var/www

# Run app.
APPINSIGHTS_INSTRUMENTATIONKEY=$(cat $APPINSIGHTS_INSTRUMENTATIONKEY) node index
