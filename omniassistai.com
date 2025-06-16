# HTTP server block - redirect to HTTPS
# HTTPS server block
server {
    server_name omniassistai.com www.omniassistai.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Main application (React frontend)
    location / {
        proxy_pass http://localhost:5006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        client_max_body_size 20M;
    }

    # Twilio SMS webhook
    location /sms {
        proxy_pass http://localhost:5007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        client_max_body_size 20M;
    }

    # Twilio Voice webhook  
    location /voice {
    proxy_pass http://localhost:5007;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;  # ← Fixed this line
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300;
    client_max_body_size 20M;
}

    # Token endpoint
    location /token {
        proxy_pass http://localhost:5007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        client_max_body_size 20M;
    }

    #test
    location /api/twilio/token {
    rewrite ^/api/twilio/token$ /token break;
    proxy_pass http://localhost:5007;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300;
    client_max_body_size 20M;
}

location /api/twilio/sms {
    rewrite ^/api/twilio/sms$ /sms break;
    proxy_pass http://localhost:5007;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300;
    client_max_body_size 20M;
}

    #test

    # Logging
    access_log /var/log/nginx/omniassistai.com.access.log;
    error_log /var/log/nginx/omniassistai.com.error.log;

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/omniassistai.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/omniassistai.com/privkey.pem; # managed by Certbot
    #include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    #ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}


server {
    if ($host = www.omniassistai.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = omniassistai.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name omniassistai.com www.omniassistai.com;
    return 404; # managed by Certbot




}
