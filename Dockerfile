FROM node:14.10.1-alpine3.10

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]