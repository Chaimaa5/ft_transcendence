FROM node:20


COPY package*.json ./


RUN npm install 

COPY . .
# COPY vite.config.js ./

# RUN npm install vite -- save-dev
# RUN npm install vite@latest

CMD ["npm", "run", "dev"]
