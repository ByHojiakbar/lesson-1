const { sequelize } = require("../../lib/db.service");
const { DataTypes } = require("sequelize");

const ProductModel = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "products",
  timestamps: true,
});

module.exports = ProductModel;