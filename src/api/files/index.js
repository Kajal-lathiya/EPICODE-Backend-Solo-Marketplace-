import express from "express";
import multer from "multer";
import {
  saveProductsImages,
  getProducts,
  writeProducts
} from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const filesRouter = express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,  // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "epicode/products"
    }
  })
}).single("imageUrl");

filesRouter.post(
  "/:productId/upload",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      // const fileName = req.file.originalname;
      // await saveProductsImages(fileName, req.file.buffer);

      // const url = `http://localhost:3001/images/${fileName}`;

      console.log(req.file);
      const url = req.file.path;
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
