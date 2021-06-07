FROM node:13.12.0-alpine as build
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# Install dependencies
COPY package*.json ./
RUN npm install

USER node

COPY --chown=node:node . .

CMD [ "node", "./index.js" ]