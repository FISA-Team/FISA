FROM node:14-alpine as build

WORKDIR /app
COPY package-lock.json package.json ./
RUN apk add git
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine

ENV API_URL=""

COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

RUN apk update
RUN apk add bash
RUN apk add dos2unix

RUN dos2unix /var/www/generate-env.sh

EXPOSE 80

RUN chmod +x /var/www/generate-env.sh

CMD ["/bin/bash", "-c", "cd /var/www && echo \"API_URL=$API_URL\n\" >> .env && ./generate-env.sh && nginx -g \"daemon off;\""]
