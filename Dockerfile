FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --force
CMD ["npm", "run" ,"start:dev"]
EXPOSE 4000