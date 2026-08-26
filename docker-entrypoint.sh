#!/bin/sh
set -eu

port="${PORT:-10000}"
sed "s/__PORT__/${port}/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

case "${APP_URL:-}" in
	http://*|https://*) ;;
	*) export APP_URL="${RENDER_EXTERNAL_URL:-http://localhost}" ;;
esac

php artisan config:clear --no-interaction

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
