#!/bin/sh

# Validation.
if [ ! $APPINSIGHTS_INSTRUMENTATIONKEY ];
then
    echo "Error: You must include an Application Insights instrumentation key.  Please set the APPINSIGHTS_INSTRUMENTATIONKEY environment variable to the instrumentation key you are trying to connect to." >&2
    exit 1
fi

# Mount Azure Storage file share.
mount -t cifs $(cat $FILES_URI) /mnt/files -o vers=3.0,username=$(cat $FILES_USERNAME),password=$(cat $FILES_PASSWORD),dir_mode=0755,file_mode=0755,serverino
cd /var/www

# Run app.
APPINSIGHTS_INSTRUMENTATIONKEY=$(cat $APPINSIGHTS_INSTRUMENTATIONKEY) node index
