// Dependencies
const { getDB } = require("./mongo")
const { ObjectID, ObjectId } = require("mongodb")
const { faker } = require("@faker-js/faker")
const { generateShoeImage } = require("../utlities/shoeImages")

// Collection name (MongoDB -- in memory)
const collectionName = "cart"

// Insert a shoe product to the current cart
async function insertShoe(shoe) {
  const database = await getDB()
  const { insertedID } = await database
    .collection(collectionName)
    .insertOne(shoe)
  return insertedID
}

// Get all shoes in DB
async function getAllShoes() {
  const database = await getDB()

  let shoes = await database.collection("shoes").find({}).toArray()

  if (shoes.length == 0) {
    generateShoes()
  }

  return await database.collection("shoes").find({}).toArray()
}

// Function that uses Faker dependency to generate 11 shoes and inserts into DB (in memory)
async function generateShoes() {
  const database = await getDB()

  for (let i = 0; i <= 10; i++) {
    let shoeName = faker.commerce.productName()
    let shoePrice = faker.commerce.price()
    let shoePicture = generateShoeImage(i)
    let tempShoe = { shoeName, shoePrice, shoePicture }
    const { insertedID } = await database
      .collection("shoes")
      .insertOne(tempShoe)
  }
  return
}

module.exports = {
  insertShoe,
  getAllShoes,
  generateShoes,
}
