FROM node:10.16.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5500
CMD [ "npm", "start" ]
