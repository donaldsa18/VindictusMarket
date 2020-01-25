FROM node:8
WORKDIR /usr/src/vindictusmarket
COPY package*.json ./
RUN npm install
COPY src ./src
COPY public ./public
RUN npm run build
EXPOSE 3002
cmd ["npm","run","start-prod"]