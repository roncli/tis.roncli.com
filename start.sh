#!/bin/sh

# Import .env file.
if [ -f .env ];
then
    export $(grep -v '^#' .env | xargs)
fi

# Validation.
if [ -z "$APPINSIGHTS_CONNECTIONSTRING" ];
then
    echo "Warning: Application Insights is not setup.  Application will log to console."
fi

if [ "$USE_AZURE_FILE_STORAGE" = "1" ];
then
    #Remove local files directory, create the mount, and link it.
    rm -r ./files
    mkdir -p /mnt/files
    ln -s /mnt/files ./files
fi

cd /var/www

# Run app.
exec node index
