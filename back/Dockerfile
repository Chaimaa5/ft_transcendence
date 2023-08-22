FROM node:20

RUN npm install -g @nestjs/cli

COPY package*.json ./

COPY tsconfig.json ./
# instal dependecies
RUN npm install -g 

COPY passport-42.d.ts ./


RUN npm install --force

COPY ./src ./src
COPY ./upload ./upload

CMD   yes | npx prisma generate && yes | npx prisma migrate dev  && npm run start:dev