FROM node:20

WORKDIR /app

COPY *.json ./


RUN npm install 

# COPY ./src ./src

COPY vite.config.js ./

# RUN npm install vite -- save-dev
# RUN npm install vite@latest

CMD ["npm", "run", "dev"]
