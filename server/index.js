const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path:"./.env"})
const DBConnection = require("./database/dbConnect.js")
const app = require("./app.js")



DBConnection()
.then(() => {
    app.listen(process.env.PORT , () => {
        console.log("Server Started at",process.env.PORT);
        
    })
    
})
.catch(error => {
    console.log(error);
    
})


