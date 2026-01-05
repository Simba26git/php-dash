# Production Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All code reviewed and approved
- [ ] No console.log statements in production
- [ ] All TODOs resolved or documented
- [ ] Code passes linting
- [ ] All tests passing
- [ ] No security vulnerabilities

### Environment Configuration
- [ ] Production .env file configured
- [ ] API URLs point to production
- [ ] Database credentials secured
- [ ] Secret keys rotated
- [ ] CORS origins configured
- [ ] Rate limits set appropriately

### Database
- [ ] Migrations tested
- [ ] Seed data prepared (if needed)
- [ ] Backup strategy in place
- [ ] Indexes optimized
- [ ] Database connections pooled

## Deployment Steps

### Backend (Laravel)

1. **Update Dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Configure Environment**
   ```bash
   cp .env.production .env
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate --force
   ```

4. **Optimize**
   ```bash
   php artisan optimize
   composer dump-autoload --optimize
   ```

5. **Set Permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

### Frontend (React)

1. **Install Dependencies**
   ```bash
   cd react
   npm ci
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Verify Build**
   ```bash
   ls -la dist/
   ```

### Using Docker

1. **Build Images**
   ```bash
   docker-compose build
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

3. **Run Migrations**
   ```bash
   docker-compose exec app php artisan migrate --force
   ```

## Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html/public

    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain Certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Performance Optimization

### Backend Optimizations

1. **Enable OPcache**
   ```ini
   ; php.ini
   opcache.enable=1
   opcache.memory_consumption=256
   opcache.max_accelerated_files=20000
   opcache.validate_timestamps=0
   ```

2. **Queue Configuration**
   ```bash
   # Start queue worker
   php artisan queue:work --daemon
   ```

3. **Cache Configuration**
   ```bash
   # Use Redis for cache
   php artisan config:cache
   php artisan route:cache
   ```

### Frontend Optimizations

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;
   ```

2. **Set Cache Headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## Monitoring Setup

### Health Checks

```bash
# API Health
curl https://yourdomain.com/api/health

# Expected Response:
# {"status":"healthy","timestamp":"..."}
```

### Log Monitoring

```bash
# Laravel Logs
tail -f storage/logs/laravel.log

# Nginx Access Logs
tail -f /var/log/nginx/access.log

# Nginx Error Logs
tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p database_name > backup_$DATE.sql
gzip backup_$DATE.sql

# Upload to S3 (optional)
aws s3 cp backup_$DATE.sql.gz s3://your-bucket/backups/
```

### Application Backups

```bash
# Backup entire application
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/html
```

## Rollback Procedure

1. **Stop Application**
   ```bash
   sudo systemctl stop nginx
   ```

2. **Restore Database**
   ```bash
   gunzip < backup_YYYYMMDD.sql.gz | mysql -u username -p database_name
   ```

3. **Restore Code**
   ```bash
   cd /var/www
   rm -rf html
   tar -xzf app_backup_YYYYMMDD.tar.gz
   ```

4. **Clear Cache**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

5. **Restart Services**
   ```bash
   sudo systemctl start nginx
   sudo systemctl restart php8.1-fpm
   ```

## Post-Deployment Verification

### Smoke Tests

- [ ] Homepage loads correctly
- [ ] Login functionality works
- [ ] Dashboard displays data
- [ ] API endpoints respond
- [ ] Database queries execute
- [ ] File uploads work
- [ ] Email sending works
- [ ] Payment processing works (if applicable)

### Performance Tests

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No JavaScript errors in console
- [ ] No broken images/assets
- [ ] Mobile responsiveness verified

### Security Tests

- [ ] HTTPS working correctly
- [ ] Security headers present
- [ ] No exposed sensitive data
- [ ] Authentication working
- [ ] Rate limiting active
- [ ] CORS configured correctly

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/html
          git pull origin main
          composer install --no-dev
          php artisan migrate --force
          php artisan config:cache
          cd react && npm ci && npm run build
```

## Troubleshooting

### Common Issues

1. **500 Internal Server Error**
   - Check Laravel logs
   - Verify file permissions
   - Check .env configuration

2. **CORS Errors**
   - Verify CORS configuration
   - Check allowed origins
   - Confirm API URL in frontend

3. **Database Connection Failed**
   - Verify database credentials
   - Check database server status
   - Confirm network connectivity

4. **Assets Not Loading**
   - Clear browser cache
   - Check asset URLs
   - Verify build process

## Support Contacts

- DevOps Team: devops@company.com
- Backend Team: backend@company.com
- Frontend Team: frontend@company.com
- Emergency Hotline: +1-XXX-XXX-XXXX

## Additional Resources

- [Laravel Deployment Documentation](https://laravel.com/docs/deployment)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [React Production Build Guide](https://react.dev/learn/start-a-new-react-project#production-grade-react-frameworks)
