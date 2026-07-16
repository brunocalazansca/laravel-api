#!/bin/bash
set -e

cd /var/www

git config --global --add safe.directory /var/www

[ ! -f .env ] && cp .env.example .env

mkdir -p bootstrap/cache storage/framework/{sessions,views,cache}
chmod -R 775 bootstrap/cache storage 2>/dev/null || true

if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

php artisan key:generate --no-interaction --force

echo "Aguardando o banco de dados iniciar..."
sleep 5

php artisan migrate --no-interaction --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

php-fpm
