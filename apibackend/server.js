require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
app.use(express.json())
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { Parser } = require("json2csv");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const checkJwt = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
});


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

app.post("/export", checkJwt, async (req, res) => {
  try {
    
    const klubovi = await klub.find().lean();

    
    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    
    fs.writeFileSync(
      path.join(exportDir, "klubovi.json"),
      JSON.stringify(klubovi, null, 2),
      "utf8"
    );

    
    const cleaned = klubovi.map(({ __v, ...rest }) => rest);
    const parser = new Parser();
    const csv = parser.parse(cleaned);

    fs.writeFileSync(path.join(exportDir, "klubovi.csv"), csv, "utf8");

    return res.status(200).send("Export OK");
  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).send("Export failed");
  }
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

