
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize.js');
const User = require("../models/user.model.js")
const Otp = sequelize.define("Otp" , {
    otp:{
        type:DataTypes.NUMBER,
        allowNull:false
    },
    timestamps:{
        type:DataTypes.DATE,
        defaultValue:Date.now,
        allowNull:false,
        get : (timestamps) => timestamps.getTime(),
        set : (timestamps) => new Date(timestamps)
    }
})

Otp.belongsTo(User, { foreignKey: 'userId', as: 'Author' }); 


module.exports = Otp;