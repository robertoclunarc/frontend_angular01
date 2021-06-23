#STAGE 0 COMPILE ON NODEJS
FROM node:12 as node
WORKDIR /app
COPY ./app/ /app/
RUN npm install
ARG config=production
RUN npm run build -- --prod --configuration=$config

#STAGE 1 DEPLOY ON NGINX
#FROM tutum/nginx
#COPY --from=node /site /app
#COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
#COPY ./nginx-custom.conf /etc/nginx/sites-available/default
#COPY ./nginx-custom.conf /etc/nginx/sites-enabled/default