#!/bin/sh
set -eu

port="${PORT:-10000}"
sed "s/__PORT__/${port}/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
