#node file configration
FROM node:16.13 as reactwork
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build


#nginx configration
FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=reactwork /app/build .
ENTRYPOINT ["nginx" , "-g" , "daemon off;"]

