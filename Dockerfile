# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:22-bookworm AS base

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y --no-install-recommends libnss3 libnspr4 libnss3-tools libdbus-1-3 libgtk-3-dev libasound2

WORKDIR /usr/src/app

COPY . .

RUN chmod -R 777 /usr/src/app

RUN chmod -R 777 /usr/local/lib

RUN npm install -g tsx

RUN npm ci

RUN rm -rf /usr/src/app/.cache

RUN npx --yes puppeteer browsers install chrome

EXPOSE 3000

CMD ["npm", "run", "dev"]
