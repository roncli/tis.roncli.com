# Get Node LTS Alpine.
FROM node:22.14.0-alpine

# Create /var/www directory.
RUN mkdir -p /var/www

# Copy files into /var/www directory.
WORKDIR /var/www
COPY ./package.json .

# Get packages & run NPM install.
RUN apk update && apk add cifs-utils && apk add keyutils && apk add git
RUN npm install --production --silent
RUN apk del git

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
