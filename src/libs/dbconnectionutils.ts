import { Db, MongoClient } from 'mongodb';

export async function connectToClient() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.mongoDBuser}:${process.env.mongoDBpassword}@cluster0.xcuqu.mongodb.net/nextData?retryWrites=true&w=majority`
  );

  return client;
}

export async function userExists(database: Db, collectionName: string, searchParams: { email: string }) {
  const usersCollection = database.collection(collectionName);
  return await usersCollection.findOne(searchParams);
}
