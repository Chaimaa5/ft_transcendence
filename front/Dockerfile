FROM node:20

WORKDIR /app

COPY *.json ./

RUN npm install 

COPY . .

COPY vite.config.js ./

CMD ["npm", "run", "dev"]
