import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

let mongo: any
declare global {
  var signIn: () => string[];
}

jest.mock(`../natsWrapper.ts`)
beforeAll(async () => {
  process.env.JWT_KEY = `whatever`
  mongo = await MongoMemoryServer.create()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signIn = () => {
  // Build a JWT payload.  { id, email }
  const id = new mongoose.Types.ObjectId().toHexString()
  const payload = {
    id,
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);


  //!! Currently not sessionizing ticket due to supertest cookies issue
  // Build session Object. { jwt: MY_JWT }
  // const session = { jwt: token };

  // Turn that session into JSON
  // const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  // const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [token];
}