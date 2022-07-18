FROM node:18
WORKDIR /app
COPY ./src/* package.json package-lock.json ./
RUN npm install
CMD ["node", "index.js" ]
