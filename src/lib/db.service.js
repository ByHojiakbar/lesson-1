const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "postgres",
    database: "oy8",
    port: 5432,
    host: "localhost",
    username: "postgres",
    password: "samacoder",
    logging: false,
    sync: true
})

async function dbConnection() {
    try {
        await sequelize.authenticate();
        require("../model")
        await sequelize.sync({alter: true})
        console.log(`Db successfuly connected`);
        
    } catch (err) {
        console.log(`Db failedt to start ${err.message}`);
        
        
    }
    
}

module.exports = dbConnection, sequelize