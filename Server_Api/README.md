# World_of_Stories BackEnd.

This project is the server api for World of Stories app, created with NodeJs, MongoDb and Swagger documentation

## Development server

Run `./start-swagger.sh` for generate swagger.json documentation file and run de server.
Run `npm run dev` for start server with last changes

. localhost:3000/ server path
. localhost:3000/api/ for swagger documentation

### To create a Service.
    . Add the route in src/routes/ 'section'.routes.ts
    . Create controller in src/controllers/ 'section'.controller.ts 
    . If is new section, add the section Route to src/app.ts

## Models and Swagger

In src/swagger/ you will find de swagger documentation directory
You can run `./generate.sh` to create WoS_Angular_Librery in generator/dist/wos-api

### To create Service and Model in api
    . Create service path at src/swagger/services/<section>/<serviceName>.json
    . Create service models definitions at src/swagger/services/<section>/<serviceName>.json
    . Create shared models definitions at src/swagger/commons/models.json
    . Add all definitions (hared and services) to src/swagger/commons/definitions.json
    . Add path to src/swagger/commons/paths.json


## MongoDB

. localhost:27017