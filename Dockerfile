FROM rust:1.85 AS hushlog-builder
RUN cargo install --git https://github.com/adenijiridwan43/Hushlog.git \
      --rev 9ab99fb --locked --root /out hushlog

FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev && \
    docker-php-ext-install pdo pdo_mysql

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader && \
    rm composer-setup.php

COPY . .

COPY --from=hushlog-builder /out/bin/hushlog /usr/local/bin/hushlog

RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["hushlog", "--format", "json", "--tee", "/tmp/twig-triket-full.log", "--", "apache2-foreground"]
