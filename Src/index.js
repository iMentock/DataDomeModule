// dependencies
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")

// define express
const app = express()

// temporary DB
const tempDB = [{ name: "john smith" }]

// helmet for security
app.use(helmet())

// body parser -- parse JSON into JS objects
app.use(bodyParser.json())

// enablingn CORS for out of domain requests
app.use(cors())

// morgan for logging
app.use(morgan("combined"))

// return all for now
app.get("/", (req, res) => {
  res.send(tempDB)
})

// start server
app.listen(3001, () => {
  console.log("listening on port 3001")
})
