FROM alpine:3.7

WORKDIR /app

COPY package*.json ./

RUN apk add --update nodejs && \
    npm i

COPY . /app

ENV TEAM_ID=CC_321_323_335_336

EXPOSE 8000

CMD ["node", "index.js"]
