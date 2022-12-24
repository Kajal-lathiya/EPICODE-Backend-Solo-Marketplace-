import express from "express";
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import productsRouter from "./api/products/index.js"
import {badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js";
const server = express()
const port = 3001

// ***************** MIDDLEWARES ********************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} - url ${req.url} `)
  next() 
}

server.use(cors()) 
server.use(loggerMiddleware)
server.use(express.json()) 

// ****************** ENDPOINTS *********************
server.use("/products", loggerMiddleware, productsRouter)


// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notFoundHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port:", port)
})
