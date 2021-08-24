#!/bin/sh

# Validation.
if [ ! $APPINSIGHTS_INSTRUMENTATIONKEY ];
then
    echo "Warning: Application Insights is not setup.  Application will log to console."
fi

if [ $USE_AZURE_FILE_STORAGE -eq 1 ];
then
    # Mount Azure Storage file share.
    mount -t cifs $(cat $FILES_URI) /mnt/files -o vers=3.0,username=$(cat $FILES_USERNAME),password=$(cat $FILES_PASSWORD),dir_mode=0755,file_mode=0755,serverino
fi

cd /var/www

# Run app.
APPINSIGHTS_INSTRUMENTATIONKEY=$(cat $APPINSIGHTS_INSTRUMENTATIONKEY) node index
