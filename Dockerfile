###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
ENV NODE_ENV development
RUN yarn install --only=development && yarn cache clean --force
COPY --chown=node:node . .
USER node


###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn run build
ENV NODE_ENV production
RUN yarn ci --only=production && yarn cache clean --force
USER node

###################
# PRODUCTION
###################


FROM node:20-alpine As production

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]