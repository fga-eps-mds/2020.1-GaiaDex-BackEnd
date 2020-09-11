FROM node:14.10.1-alpine3.10

WORKDIR /app

VOLUME .:/app

COPY ./package.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]