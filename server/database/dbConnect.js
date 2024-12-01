const mongoose = require("mongoose");
const DB_Name = require("../constansts.js")

const DBConnection = async () => {

    try{
        const url = `${process.env.MONGO_URL}${DB_Name}`
 
        const connection = await mongoose.connect(url);
        if(!connection){
            console.log("Error While Connection in Database!!!");
            return;
        }

        console.log("DB CONNECTED");
        


    }catch(error){
        // console.log("DATABASE CONNECTION ERROR" , error);
        
    }
}

module.exports = DBConnection;