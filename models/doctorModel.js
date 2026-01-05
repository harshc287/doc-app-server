const {sequelize} = require("../config/db")
const {DataTypes} = require("sequelize")

const Doctor = sequelize.define(
    "Doctor",
    {
        id:{
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        Specialist:{
            type: DataTypes.STRING,
            allowNull:false
        },
        fees:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdBy:{
            type:DataTypes.BIGINT.UNSIGNED,
            unique:true,
            references: {
                model:"Users",
                key: "id"
            }
        },
        status:{
            type: DataTypes.ENUM("Pending", "Accepted", "Reject"),
            defaultValue:"Pending"
        }
    },
    {
        tableName: "Doctors"

    }
)

module.exports = Doctor