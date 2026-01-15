# Get Node LTS Alpine.
FROM node:22.22.0-alpine

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

# Allow start script to run.
RUN chmod +x /var/www/*.sh

# Expose port 8080.
EXPOSE 8080

# Start the application.
ENTRYPOINT ["/var/www/start.sh"]
