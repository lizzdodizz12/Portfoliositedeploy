#!/bin/sh
set -eu

php artisan optimize:clear --no-interaction
php artisan package:discover --ansi

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

if command -v chown >/dev/null 2>&1 && id www-data >/dev/null 2>&1; then
    chown -R www-data:www-data storage bootstrap/cache
fi

chmod -R ug+rwX storage bootstrap/cache

npm run build
