# Stage 1: Build stage
FROM php:8.2-fpm-alpine as build-stage

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    bash \
    git \
    curl \
    unzip \
    sqlite-dev \
    libpq-dev \
    && docker-php-ext-install \
    pdo_sqlite \
    pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (better layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci

# Copy application files
COPY . .

# Run Laravel's package discovery after artisan is available
RUN php artisan package:discover --ansi

# Build Vite assets
RUN npm run build

# Generate Laravel app key (will be overridden by Render environment variable)
RUN php artisan key:generate --no-interaction || true

# Set proper permissions for storage and bootstrap cache
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/testing bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Stage 2: Runtime stage
FROM php:8.2-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    bash \
    curl \
    sqlite-dev \
    libpq-dev \
    nginx \
    supervisor \
    && docker-php-ext-install \
    pdo_sqlite \
    pdo_pgsql

# Set working directory
WORKDIR /var/www/html

# Copy application from build stage
COPY --from=build-stage --chown=www-data:www-data /var/www/html /var/www/html

# Copy Nginx configuration and Render port entrypoint
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy supervisor configuration for managing PHP-FPM and nginx
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:php-fpm]
command=/usr/local/sbin/php-fpm --nodaemonize
autostart=true
autorestart=true
stderr_logfile=/var/log/php-fpm.err.log
stdout_logfile=/var/log/php-fpm.out.log
priority=999

[program:nginx]
command=/usr/sbin/nginx -c /etc/nginx/nginx.conf -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx/error.log
stdout_logfile=/var/log/nginx/access.log
priority=998
EOF

# Create log directories
RUN mkdir -p /var/log/supervisor /var/log/nginx /var/log/php-fpm.d

# Render supplies PORT at runtime; the entrypoint applies it to Nginx.
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-10000}/ || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
