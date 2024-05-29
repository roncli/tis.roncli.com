# Get Node LTS Alpine.
FROM node:20.14.0-alpine

# Get packages.
RUN apk update && apk add cifs-utils && apk add keyutils

# Create /var/www directory.
RUN mkdir -p /var/www

# Copy files into /var/www directory.
WORKDIR /var/www
COPY ./package.json .

# Run NPM install.
RUN npm install --production --silent

# Copy remaining files.
COPY . .

# Import arg.
ARG USE_AZURE_FILE_STORAGE

# Remove test files directory if we're going to use Azure file storage.
RUN if [ $USE_AZURE_FILE_STORAGE -eq 1 ]; then rm -r ./files; mkdir -p /mnt/files; ln -s /mnt/files ./files; fi

# Allow start script to run.
RUN chmod +x /var/www/*.sh

# Expose port 3030.
EXPOSE 3030
