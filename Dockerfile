# Dockerfile
FROM node:18.16

WORKDIR /usr/src/apps

COPY package*.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]