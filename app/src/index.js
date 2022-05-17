// Dependencies
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { startDB } = require("./database/mongo")
const {
  getItemsInCart,
  updateCart,
  addToCart,
  deleteItemFromCart,
} = require("./database/cart")
const { expressjwt: jwt } = require("express-jwt")
const jwks = require("jwks-rsa")
const { auth } = require("express-oauth2-jwt-bearer")
const { generateShoes, getAllShoes } = require("./database/shoes")

// Define express
const app = express()

// Helmet for security
app.use(helmet())

// Body parser -- parse JSON into JS objects
app.use(bodyParser.json())

// Enabling CORS for out of domain requests
app.use(cors())

// Morgan for logging
app.use(morgan("combined"))

// Return all for now (not protected)
app.get("/shoes", async (req, res) => {
  res.send(await getAllShoes(req.body))
})

// --------------- Secure paths below this line----------------------------
app.use(
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://dev-298b8i8r.us.auth0.com/.well-known/jwks.json",
    }),
    audience: "https://test-api",
    issuer: "https://dev-298b8i8r.us.auth0.com/",
    algorithms: ["RS256"],
  })
)

// Get all shoes in cart
app.get("/cart", async (req, res) => {
  res.send(await getItemsInCart())
})

// Insert a shoe into cart, pass to DataDome for verification first
app.post("/cart", async (req, res) => {
  const shoeID = req.body.shoe
  /**
   * In a production environment this would call out to the Data Dome API
   * The call would pass in the necessary parameters either in the data level or headers
   * Because this call is innacessable without Auth0 authentication it is protected
   * Each call would be asynchronous
   * For this demo I will fake the good or bad response randomly with roughly
   * 67% success rate and either pass the call through or send back with an error
   */
  var isNotBot = Math.random() < 0.67

  if (isNotBot) {
    let insertedID = await addToCart(shoeID)
    return res.send({ message: insertedID })
  } else {
    return res.status(401).send({ message: "Detected bad actor." })
  }
})

// Delete an item from cart
app.delete("/cart/:id", async (req, res) => {
  let result = await deleteItemFromCart(req.params.id)
  res.send({ message: "Item deleted" })
})

// Delete an item from cart
app.delete("/cart/remove/all", async (req, res) => {
  let result = await deleteItemFromCart(req.params.id)
  res.send({ message: "All items deleted" })
})

// Start in memory MongoDB then the server
startDB().then(async () => {
  await generateShoes()
  app.listen(process.env.PORT || 3001, async () => {
    console.log("listening on port 3001")
  })
})
