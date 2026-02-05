# Stage 1: Build
FROM oven/bun:1-alpine AS build

ARG API_URL=https://api.tudominio.com/api/v1
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN sed -i "s|apiUrl: '.*'|apiUrl: '$API_URL'|g" src/environments/environment.prod.ts

RUN bun run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/facturacion-sunat/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
