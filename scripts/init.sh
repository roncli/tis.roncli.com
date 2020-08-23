#!/bin/bash

# Update these variables for your instance.
domains=(tis.roncli.com)
email="roncli@roncli.com"
certbotWellknownDir="/var/www/.well-known"
certbotConfDir="./data/certbot"

# Set to 1 if you're testing your setup to avoid hitting request limits
staging=0

if [ -d "$certbotConfDir" ];
then
    read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ];
    then
        exit
    fi
fi

# Download recommended TLS parameters if we don't have them.
if [ ! -e "$certbotConfDir/options-ssl-nginx.conf" ] || [ ! -e "$certbotConfDir/ssl-dhparams.pem" ];
then
    mkdir -p "$certbotConfDir"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$certbotConfDir/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$certbotConfDir/ssl-dhparams.pem"
fi

# Create the dummy certificate for the domains.
live_path="/etc/letsencrypt/live/$domains"
mkdir -p "$certbotConfDir/conf/live/$domains"
docker-compose run --rm --entrypoint "openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout '$live_path/privkey.pem' -out '$live_path/fullchain.pem' -subj '/CN=localhost'" certbot

# Start nginx.
docker-compose up --force-recreate -d nginx

# Delete dummy certificate for the domains.
archive_path="/etc/letsencrypt/archive/$domains"
renewalconf_path="/etc/letsencrypt/renewal/$domains.conf"
docker-compose run --rm --entrypoint "rm -Rf $live_path && rm -Rf $archive_path && rm -Rf $renewalconf_path" certbot

# Setup arguments for letsencrypt.
domainArgs=""
for domain in "${domains[@]}";
do
    domainArgs="$domainArgs -d $domain"
done

case "$email" in
    "")
        emailArg="--register-unsafely-without-email"
        ;;
    *)
        emailArg="--email $email"
        ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ];
then
    stagingArg="--staging"
fi

# Request a letsencrypt certificate for the domains.
docker-compose run --rm --entrypoint "certbot certonly --webroot -w $certbotWellknownDir $stagingArg $emailArg $domainArgs --rsa-key-size 4096 --agree-tos --force-renewal" certbot

# Reload nginx.
docker-compose exec nginx nginx -s reload
