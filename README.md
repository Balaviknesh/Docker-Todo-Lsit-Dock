# Docker-Todo-Lsit-Dock
A simple Todo List app built using MEAN stack and ability to run as container using Docker and Docker Compose


* Requires mongo db
* Use docker compose to run along with mongo-db. 

use this docker compose to run the containers
_______________________________________________
version: '3.3'

services:
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb:/data/db
      - mongodb_config:/data/configdb
    ports:
      - "27017:27017"


  api:
    depends_on:
      - mongodb
    image: bkidocks/todo-list-dock:latest
    ports:
      - "3000:3000"
      - "3001:3001"

volumes:
  mongodb:
  mongodb_config:
________________________

run docker-compose up

run http://localhost:3000 in your browser

![Screenshot](https://i.imgur.com/7OWSe6x.png)
