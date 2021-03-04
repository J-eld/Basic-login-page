FROM node:latest

RUN mkdir -p /app

WORKDIR /app

COPY login-page/package*.json ./
RUN ls

RUN npm install 

COPY login-page .

EXPOSE 3000

CMD ["npm", "start"]