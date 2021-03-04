FROM node:latest

RUN mkdir -p /app

WORKDIR /app

COPY api/package*.json ./
RUN ls

RUN npm install 

COPY api .

EXPOSE 9000

CMD ["npm", "start"]