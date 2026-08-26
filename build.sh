#!/bin/sh
set -eu

mkdir -p database

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    database_path="${DB_DATABASE:-/var/www/html/database/database.sqlite}"

    if [ "$database_path" != ":memory:" ]; then
        mkdir -p "$(dirname "$database_path")"
        touch "$database_path"
        [ -f "$database_path" ]
    fi
fi

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

if command -v chown >/dev/null 2>&1 && id www-data >/dev/null 2>&1; then
    chown -R www-data:www-data database storage bootstrap/cache
fi

chmod -R ug+rwX database storage bootstrap/cache

export CACHE_STORE=file
export SESSION_DRIVER=file
export QUEUE_CONNECTION=sync

php artisan optimize:clear --no-interaction
php artisan package:discover --ansi

npm run build
