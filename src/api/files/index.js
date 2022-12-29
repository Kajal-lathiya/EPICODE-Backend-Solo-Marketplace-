import express from "express";
import multer from "multer";
import {
  saveProductsImages,
  getProducts,
  writeProducts
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:productId/upload",
  multer().single("imageUrl"),
  async (req, res, next) => {
    try {
      const fileName = req.file.originalname;
      await saveProductsImages(fileName, req.file.buffer);

      const url = `http://localhost:3001/images/${fileName}`;

      const products = await getProducts();

      const index = products.findIndex(
        (product) => product._id === req.params.productId
      ); 
      if (index !== -1) {
        const oldProduct = products[index];

        const updatedProduct = {
          ...oldProduct,
          imageUrl: url,
          updatedAt: new Date()
        };

        products[index] = updatedProduct;

        await writeProducts(products);
      }

      res.send("file upload successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
