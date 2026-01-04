require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
app.use(express.json())
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const openApiSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));



const bazarouter = require('./routes/klubovi')
const klub = require('./models/klub')
app.use('/klubovi', bazarouter)

app.get('/openapi.json', (req, res) => {
  res.type('application/json');
  res.sendFile(path.join(__dirname, 'openapi.json'));
});

app.use((req, res) => {
  res.status(404).json({
    status: "Not Found",
    message: "Endpoint ne postoji",
    response: null
  })
})



async function start(){
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Mongoose connected")
        app.listen(3000, () => console.log("Server Started on 3000"));
    } catch(err){
        console.error(" DB connect error:", err);
        process.exit(1);
    }
}


start();
