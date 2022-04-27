FROM node:14.17.5-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs

FROM node:14.17.5-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
CMD npm start