import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkProductSchema, triggerBadRequest } from "./validators.js";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";

const { NotFound } = httpErrors;

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newproduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid()
      };

      const productsArray = await getProducts();
      productsArray.push(newproduct);
      await writeProducts(productsArray);
      res.status(201).send({ id: newproduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    if (req.query && req.query.category) {
      const filteredproducts = productsArray.filter(
        (product) => product.category === req.query.category
      );
      res.send(filteredproducts);
    } else {
      res.send(productsArray);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const product = products.find(
      (product) => product._id === req.params.productId
    );
    if (product) {
      res.send(product);
    } else {
      // createHttpError(404, `Product id ${req.params.productId} not found!`)
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();

    const index = products.findIndex(
      (product) => product._id === req.params.productId
    );
    if (index !== -1) {
      const oldproduct = products[index];
      const updatedproduct = {
        ...oldproduct,
        ...req.body,
        updatedAt: new Date()
      };
      products[index] = updatedproduct;
      await writeProducts(products);
      res.send(updatedproduct);
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const remainingproducts = products.filter(
      (product) => product._id !== req.params.productId
    );
    if (products.length !== remainingproducts.length) {
      await writeProducts(remainingproducts);
      res.status(204).send();
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
