FROM node:20

WORKDIR /app

COPY *.json ./

RUN npm install
RUN npm install socket.io-client

COPY . .

COPY vite.config.js ./

CMD ["npm", "run", "dev"]
