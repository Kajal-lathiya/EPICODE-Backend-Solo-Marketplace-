import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { checkProductSchema, triggerBadRequest } from './validators.js';

const { NotFound } = httpErrors;

const productsRouter = express.Router();

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "products.json"
);

const getproducts = () => JSON.parse(fs.readFileSync(productsJSONPath));
const writeproducts = (productsArray) =>
  fs.writeFileSync(productsJSONPath, JSON.stringify(productsArray));

productsRouter.post("/", checkProductSchema,triggerBadRequest, (req, res, next) => {
  try {
    const newproduct = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: uniqid()
    };

    const productsArray = getproducts();
    productsArray.push(newproduct);
    writeproducts(productsArray);
    res.status(201).send({ id: newproduct.id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", (req, res, next) => {
  try {
    const productsArray = getproducts();
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

productsRouter.get("/:productId", (req, res, next) => {
  try {
    const products = getproducts();
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

productsRouter.put("/:productId", (req, res, next) => {
  try {
    const products = getproducts();

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
      writeproducts(products);
      res.send(updatedproduct);
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", (req, res, next) => {
  try {
    const products = getproducts();
    const remainingproducts = products.filter(
      (product) => product._id !== req.params.productId
    );
    if (products.length !== remainingproducts.length) {
      writeproducts(remainingproducts);
      res.status(204).send();
    } else {
      next(NotFound(`Product id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
