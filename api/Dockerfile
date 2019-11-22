FROM node:10-alpine

ENV DBhost="/kvmnt/orchestra_database_host"
ENV DBuser="/kvmnt/orchestra_database_username"
ENV DBpass="/kvmnt/orchestra_database_password"
ENV DBname="/kvmnt/orchestra_database_name"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 2000
CMD [ "node", "myapp.js" ]



