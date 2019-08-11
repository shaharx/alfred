FROM node:12.6.0

RUN apt update
RUN apt install -y openjdk-8-jdk
RUN apt install -y vim

WORKDIR /app
COPY . .

RUN npm install
RUN npm link
RUN rm -rf tests/

WORKDIR /playground

CMD ["node", "../app/welcome.js"]