# syntax=docker/dockerfile:1

FROM node:18-alpine 

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]

EXPOSE 5000