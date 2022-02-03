FROM node:16.13.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./dist ./dist

CMD ['npm', 'run', "start"]