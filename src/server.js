import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {join } from "path"
import productsRouter from "./api/products/index.js";
import reviewRouter from "./api/reviews/index.js";
import filesRouter from "./api/files/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler
} from "./errorHandlers.js";

const server = express();
const port = 3001;
const publicFolderPath = join(process.cwd(), './public')

// ***************** MIDDLEWARES ********************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} - url ${req.url} `);
  next();
};

server.use(express.static(publicFolderPath))
server.use(cors());
server.use(loggerMiddleware);
server.use(express.json());

// ****************** ENDPOINTS *********************
server.use("/products", loggerMiddleware, productsRouter);
server.use("/products", reviewRouter);
server.use("/product", filesRouter);
// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
