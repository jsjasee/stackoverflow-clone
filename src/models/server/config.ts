// this config is slightly diff from the client config, talking to appwrite directly from backend side
import env from "@/src/app/env";
import { Avatars, Client, TablesDB, Storage, Users } from "node-appwrite";
// client is just a 'rope' that you are fetching from appwrite? what does it mean.. is client the frontend 'connection' here?

let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apikey); // Your secret API key

// const databases = new Databases(client); // gives you access to all the databases created in this project id -> deprecated, use below TablesDB code
const tablesDB = new TablesDB(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, tablesDB, avatars, storage, users };
