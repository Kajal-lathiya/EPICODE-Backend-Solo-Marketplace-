import express from "express";
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import productsRouter from "./api/products/index.js"

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

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port:", port)
})
