FROM node:10.16.0-alpine

#set a working directory
WORKDIR /usr/src/app

#copy package
COPY package*.json ./

#install dependencies
RUN npm install

#COPY the code
COPY . .

#start the server
CMD ["npm","start"]
