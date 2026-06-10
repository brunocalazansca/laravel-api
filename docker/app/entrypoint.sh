#!/bin/bash
set -e

cd /var/www

git config --global --add safe.directory /var/www

[ ! -f .env ] && cp .env.example .env

mkdir -p bootstrap/cache storage/framework/{sessions,views,cache}
chmod -R 775 bootstrap/cache storage

composer install --no-interaction --prefer-dist --optimize-autoloader

php artisan key:generate --no-interaction --force

echo "Aguardando o banco de dados iniciar..."
sleep 5

php artisan migrate:fresh --no-interaction --force

php-fpm
