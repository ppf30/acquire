# ACQUIRE

Extrae los datos del consumo energético desde la API externa de Kunna. Una vez obtenidos transforma los datos
para generar un vector con 7 características que recibirá predict, además guarda toda la información en 
```MongoDB``` y le devuelve al orquestador un identificador único.

## Repositorios del proyecto
```bash 
https://github.com/ppf30/acquire.git
```
```bash
https://github.com/ppf30/orchestrator.git
```
```bash
https://github.com/ppf30/predict.git
```


## Uso Local

```bash
# Iniciar el orquestador
node server.js
```

## Uso docker
Todo el proyecto está dockerizado, por lo tanto si queremos probarlo con contenedores debemos clonar los repositorios y con el ```docker-compose.yml``` en la carpeta, ejecutamos los siguientes comandos en la terminal:
```bash
docker-compose up -d --build
```

Al finalizar podemos eliminar los contenedores:
```bash
docker-compose down
```
## Pruebas en Postman
GET http://localhost:3002/health

POST http://localhost:3002/data



## Lenguaje 

* Todo el código está en Java Scrip

## Estructura del Proyecto

```
acquire/
│── controllers/
│──│── acquireControllers.js
│── data/
│──│── acquireData.js
│──│── connectDB.js
│── node_modules/
│── routes/
│──│── acquireRoutes.js
│── services/
│──│── kunnaService.js
│── dockerfile
│── package-lock.json
│── package.json
│──server.js
│── README.md

```


## Licencia

Este proyecto está bajo la licencia MIT.
