# Stage 1: Build
FROM oven/bun:1-alpine AS build

ARG API_URL=https://api.tudominio.com/api/v1
WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Inject API_URL into environment.prod.ts
RUN sed -i "s|apiUrl: '.*'|apiUrl: '$API_URL'|g" src/environments/environment.prod.ts

# Build the Angular application for production
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage
# Note: The directory name in 'dist' depends on 'angular.json' project name.
# It is usually 'dist/facturacion-sunat/browser' for Angular 17+
COPY --from=build /app/dist/facturacion-sunat/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
