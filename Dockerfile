FROM node:13.12.0-alpine as build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "run", "start:dev"]