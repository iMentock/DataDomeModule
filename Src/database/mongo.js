// dependencies
const { MongoMemoryServer } = require("mongodb-memory-server")
const { MongoClient } = require("mongodb")

// declare db
let database = null

// initialize in memory DB
async function startDB() {
  const mongo = await MongoMemoryServer.create()
  const mongoDBURL = mongo.getUri()
  const connection = await MongoClient.connect(mongoDBURL, {
    useNewUrlParser: true,
  })
  database = connection.db()
}

// return reference to in memory DB
async function getDB() {
  if (!database) await startDB()
  return database
}

module.exports = {
  getDB,
  startDB,
}
