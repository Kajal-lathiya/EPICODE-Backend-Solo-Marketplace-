import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkProductSchema, triggerBadRequest } from "./validators.js";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";

import ProductsModel from "./model.js";
import createHttpError from "http-errors";

const { NotFound } = httpErrors;

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newProduct = new ProductsModel(req.body);
      const { _id } = await newProduct.save();
      res.status(201).send({ id: _id });
    } catch (error) {
      next(error);
    }
    // try {
    //   const newproduct = {
    //     ...req.body,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     _id: uniqid()
    //   };

    //   const productsArray = await getProducts();
    //   productsArray.push(newproduct);
    //   await writeProducts(productsArray);
    //   res.status(201).send({ id: newproduct.id });
    // } catch (error) {
    //   next(error);
    // }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find();
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
  // try {
  //   const productsArray = await getProducts();
  //   if (req.query && req.query.category) {
  //     const filteredproducts = productsArray.filter(
  //       (product) => product.category === req.query.category
  //     );
  //     res.send(filteredproducts);
  //   } else {
  //     res.send(productsArray);
  //   }
  // } catch (error) {
  //   next(error);
  // }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) res.status(200).send(product);
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
  // try {
  //   const products = await getProducts();
  //   const product = products.find(
  //     (product) => product._id === req.params.productId
  //   );
  //   if (product) {
  //     res.send(product);
  //   } else {
  //     // createHttpError(404, `Product id ${req.params.productId} not found!`)
  //     next(NotFound(`Product id ${req.params.productId} not found!`));
  //   }
  // } catch (error) {
  //   next(error);
  // }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) res.status(200).send(updatedProduct);
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
  // try {
  //   const products = await getProducts();
  //   const index = products.findIndex(
  //     (product) => product._id === req.params.productId
  //   );
  //   if (index !== -1) {
  //     const oldproduct = products[index];
  //     const updatedproduct = {
  //       ...oldproduct,
  //       ...req.body,
  //       updatedAt: new Date()
  //     };
  //     products[index] = updatedproduct;
  //     await writeProducts(products);
  //     res.send(updatedproduct);
  //   } else {
  //     next(NotFound(`Product id ${req.params.productId} not found!`));
  //   }
  // } catch (error) {
  //   next(error);
  // }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deleteProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deleteProduct) res.status(204).send();
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
  // try {
  //   const products = await getProducts();
  //   const remainingproducts = products.filter(
  //     (product) => product._id !== req.params.productId
  //   );
  //   if (products.length !== remainingproducts.length) {
  //     await writeProducts(remainingproducts);
  //     res.status(204).send();
  //   } else {
  //     next(NotFound(`Product id ${req.params.productId} not found!`));
  //   }
  // } catch (error) {
  //   next(error);
  // }
});

// *************************** EMBEDDED REVIEWS ********************************

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const productReview = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: req.body } },
      { new: true, runValidators: true }
    );
    if (productReview) res.status(200).send(productReview);
    else
      next(
        createHttpError(404, `Product id ${req.params.productId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) res.status(200).send(product.reviews);
    else
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const productReview = product.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (productReview) res.status(200).send(productReview);
      else
        next(
          createHttpError(
            404,
            `review with id ${req.params.reviewId} not found!`
          )
        );
    } else
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (index !== -1) {
        product.reviews[index] = {
          ...product.reviews[index].toObject(),
          ...req.body
        };
        await product.save();
        res.status(200).send(product);
      } else
        next(
          createHttpError(
            404,
            `review with id ${req.params.reviewId} not found!`
          )
        );
    } else
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        { $pull: { reviews: { _id: req.params.reviewId } } },
        { new: true }
      );
      if (updatedProduct) res.send(updatedProduct);
      else
        next(
          createHttpError(404, `review id ${req.params.reviewId} not found!`)
        );
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
