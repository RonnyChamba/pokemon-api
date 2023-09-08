
require('dotenv').config();

const express = require("express");

const dbconfig = require("./dbconfig");

const axios = require('axios');

// allow us to use async/await
const mysql = require("mysql2/promise");

// create a new router
const router = express.Router();

// define routers
router.get("/", async (req, res) => {

    const connection = await mysql.createConnection(dbconfig);

    const [rows, fields] = await connection.execute("SELECT * FROM pokemons");

    const data = {
        data: rows,
        empty: rows.length === 0
    }

    res.json(data);
});


router.get("/:ide", async (req, res) => {

    console.log("req.params.ide", req.params.ide);
    const connection = await mysql.createConnection(dbconfig);

    const [rows, fields] = await connection.execute("SELECT * FROM pokemons WHERE id = ?", [req.params.ide]);

    const data = {
         ... rows ? rows[0] : {},
    }

    res.json(data);
});


router.post("/", async (req, res) => {

    const connection = await mysql.createConnection(dbconfig);

    const data = req.body;

    const SQLINSERT = "INSERT INTO pokemons (NAME, DESCRIPTION, IMAGE, HEIGHT, WEIGHT, SERIAL) VALUES (?, ?, ?,?,?,?)";

    const [result,] = await connection.execute(SQLINSERT, 
        [data.name, 
            data.description, 
            data.image,
            data.height,
            data.weight,
            data.id]);

    console.log(result);

    res.status(201).json({ message: 'Pokemon created successfully!' });

});

router.put("/:id", async (req, res) => {

    try {

        const connection = await mysql.createConnection(dbconfig);

        const data = req.body;

        const id = req.params.id;


        // verify if pokemon exists

        const SQLSELECT = "SELECT * FROM pokemons WHERE id = ?";

        const [rows, fields] = await connection.execute(SQLSELECT, [id]);

        if (rows.length === 0) {
            res.status(404).json(new Error("Pokemon not found", 404));
            return;
        }

        const SQLUPDATE = "UPDATE pokemons SET name = ?, description = ?, image = ?, height =?, weight =? WHERE id= ?";

        const [result,] = await connection.execute(SQLUPDATE, [data.name, data.description, data.image, data.height, data.weight, id]);

        console.log(result);


        res.json({ message: 'Pokemon update successfully!' });
    }
    catch (error) {
        console.log(error);

        res.status(400).json(new Error("Error update pokemon", 400));
    }
});


router.delete("/:id", async (req, res) => {

    try {

        const connection = await mysql.createConnection(dbconfig);

        const id = req.params.id;


        // verify if pokemon exists
        const SQLSELECT = "SELECT * FROM pokemons WHERE id = ?";

        const [rows, fields] = await connection.execute(SQLSELECT, [id]);

        if (rows.length === 0) {
            res.status(404).json(new Error("Pokemon not found", 404));
            return;
        }
        // console.log(rows);
        // console.log(fields);


        const SQLDELETE = "DELETE FROM pokemons WHERE id = ?";

        const [result,] = await connection.execute(SQLDELETE, [id]);

        // console.log(result);

        res.status(204).json({ message: 'Pokemon delete successfully!' });
    }
    catch (error) {
        console.log(error);

        res.status(400).json(new Error("Error delete pokemon", 400));
    }
});


router.get("/search/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const URL = process.env.API_POKEMON;
        const response = await axios.get(`${URL}/${id}`);
        const pokemonData = response.data;

    
        const  sendPokemon = {
            name: pokemonData.name,
            description: pokemonData?.description || '',
            image: pokemonData.sprites.front_default,
            id: pokemonData.id,
            height: pokemonData.height,
            weight: pokemonData.weight,
        }

        res.json(sendPokemon);
    }
    catch (error) {
        // console.log('error ' ,error?.message);
        res.status(400).json(new Error(error?.message, 400));
    }
});

// export default router;
module.exports = router;



class Error {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}