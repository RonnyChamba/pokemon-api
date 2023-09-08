const express =  require("express");
const mysql = require("mysql2");
const routers = require("./routers");
const dbconfig = require("./dbconfig");

const cors = require('cors');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

const connection =  mysql.createConnection(dbconfig);

connection.connect((error) => { 
    if(error) {
        console.log("Error: ", error);
    } else {
        // console.log("Database is connected");
    }
});

app.use(express.json());


// add the router
app.use('/api', routers);


app.listen(3000, () => {

    console.log("Server is running on port 3000");
});

