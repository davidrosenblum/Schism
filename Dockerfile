FROM node

COPY . /app
WORKDIR /app

RUN npm i
RUN npm run build

EXPOSE 8080

CMD "npm start"