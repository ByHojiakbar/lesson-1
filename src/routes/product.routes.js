const { Router } = require("express");
const productController = require("../controllers/product.controller");

const productRouter = Router();

productRouter.get("/all", productController.GET_PRODUCTS);
productRouter.post("/create", productController.CREATE_PRODUCT);

productRouter
  .route("/:id")
  .get(productController.GET_PRODUCT)
  .delete(productController.DELETE_PRODUCT)
  .put(productController.UPDATE_PRODUCT);

module.exports = productRouter;