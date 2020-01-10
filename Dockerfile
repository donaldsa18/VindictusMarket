FROM node:8
WORKDIR /usr/src/vindictusmarket
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
cmd ["npm","start"]