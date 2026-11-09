FROM nginx:1.27-alpine

# Remove default Nginx website configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy our custom Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend static assets (HTML, CSS, JS) to Nginx web root
COPY html/ /usr/share/nginx/html/

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
