import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import createHttpError from "http-errors"
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
import mongoose, { mongo } from "mongoose";

const server = express();
const port = process.env.PORT;
const publicFolderPath = join(process.cwd(), './public')

// ***************** MIDDLEWARES ********************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} - url ${req.url} `);
  next();
};
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
const corsOptions = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true)
    } else {
      // If it is not --> error
      corsNext(createHttpError(400, `Origin ${origin} is not in the whitelist!`))
    }
  },
}
server.use(express.static(publicFolderPath))
server.use(cors(corsOptions));
server.use(loggerMiddleware);
server.use(express.json());

// ****************** ENDPOINTS *********************
server.use("/products", loggerMiddleware, productsRouter);
server.use("/products", reviewRouter);
server.use("/product", filesRouter);
// ****************** ERROR HANDLERS *************************
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

//********************* MONGODB CONNECT *************************** */
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Sccessfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server is running on port:", port);
  });
})

