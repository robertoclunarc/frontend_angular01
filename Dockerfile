#STAGE 0 COMPILE ON NODEJS
FROM node:12 as node
WORKDIR /app
COPY ./app/ /app/
RUN yarn
ARG config=production
RUN echo "build with env: ${config} !!"
RUN npm run build -- --prod --configuration=$config

#STAGE 1 DEPLOY ON NGINX
FROM tutum/nginx
COPY --from=node /site /app
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-custom.conf /etc/nginx/sites-available/default
COPY ./nginx-custom.conf /etc/nginx/sites-enabled/default
RUN touch /var/log/nginx/error.log && touch /var/log/nginx/access.log