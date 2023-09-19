FROM node:18-alpine
WORKDIR /app
COPY . .
RUN curl -fsSL https://bun.sh/install | bash
RUN bun install
CMD ["yarn", "start:dev"]