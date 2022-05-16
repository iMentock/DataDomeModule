// dependencies
const { getDB } = require("./mongo")
const { ObjectId } = require("mongodb")

// Cart collection (MongoDB - in memory)
const collectionName = "cart"

// Function adds a given item (shoe) to the cart collection
async function addToCart(item) {
  const database = await getDB()

  let insertedShoeID = await database
    .collection(collectionName)
    .insertOne({ item })
    .then((result) => {
      let stringID = ObjectId(result.insertedId).toString()
      return stringID
    })
    .catch((err) => {
      console.log("ERROR --> ")
      console.log(err)
      return
    })

  return insertedShoeID
}

// Returns all items in DB cart (not used at this time)
async function getItemsInCart() {
  const database = await getDB()
  let cart = await database.collection(collectionName).find({}).toArray()

  return cart
}

// Update (not used at this time)
async function updateCart(cartID, cart) {
  const database = await getDB()
  delete cart._id
  await database.collection(collectionName).update(
    { _id: new ObjectId(cartID) },
    {
      $set: {
        ...cart,
      },
    }
  )
}

// Delete from cart collection (in use)
async function deleteItemFromCart(itemID) {
  const database = await getDB()
  await database.collection(collectionName).deleteOne({
    _id: new ObjectId(itemID),
  })
}

// Delete all from cart (in use - during "checkout")
async function deleteAllFromCart() {
  const database = await getDB()
  await database.collection(collectionName).remove()
}

module.exports = {
  addToCart,
  getItemsInCart,
  updateCart,
  deleteItemFromCart,
}
