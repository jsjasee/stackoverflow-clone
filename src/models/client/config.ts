// configures how your client (frontend) can connect to the appwrite.
import env from "@/src/app/env";
import {
  Client,
  Account,
  Avatars,
  Databases, // deprecated, use TablesDB instead.
  Storage,
  TablesDB,
} from "appwrite";

// What are Avatars used for? lightweight image loading for avatars?
// the env file ensures that the contents are typescript safe?
// what is account used for? did we event it up..?

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId); // Your project ID

const tablesDB = new TablesDB(client); // gives you access to all the databases created in this project id
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, tablesDB, account, avatars, storage };
