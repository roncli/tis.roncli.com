# Get Node LTS Alpine.
FROM node:lts-alpine

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

# Remove test files directory.
RUN rm -r ./files

# Create mount point for files directory.
RUN mkdir -p /mnt/files

# Symbolic link to files directory into the application.
RUN ln -s /mnt/files ./files

# Allow start script to run.
RUN chmod +x /var/www/*.sh

# Expose port 3030.
EXPOSE 3030
