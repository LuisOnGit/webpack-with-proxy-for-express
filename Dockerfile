FROM node
WORKDIR /app
COPY ./src/* package.json package-lock.json ./
RUN npm install
CMD ["npm", "run", "start"]
