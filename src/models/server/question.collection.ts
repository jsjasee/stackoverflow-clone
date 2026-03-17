import { Permission, Role, IndexType, OrderBy } from "node-appwrite";

import { db, questionCollection } from "../name";
import { tablesDB } from "./config";

// a table is known as a collection in appwrite now. its the newer code.
export default async function createQuestionTable() {
  // create collection - createCollection method is deprecated? yes, createTable is now the modern one.
  await tablesDB.createTable({
    databaseId: db,
    tableId: questionCollection,
    name: questionCollection,
    permissions: [
      Permission.read(Role.any()), // anyone can read the questions, regardless of whether they are logged in
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    rowSecurity: false, // set true only if you want row-level permissions
    enabled: true,
    // instead of multiple await like in the other collection.ts, you can just specify what columns AND indexes you want to create directly in the .createTable function! wow!
    columns: [
      {
        key: "title",
        type: "string",
        size: 500,
        required: true,
      },
      {
        key: "content",
        type: "string",
        size: 10000,
        required: true,
      },
      {
        key: "authorId",
        type: "string",
        size: 50,
        required: true,
      },
      {
        key: "tags",
        type: "string",
        size: 50,
        required: true,
        array: true,
        xdefault: undefined,
      },
      {
        key: "attachmentId",
        type: "string",
        size: 50,
        required: false,
      },
    ],
    indexes: [
      {
        key: "title",
        type: IndexType.Fulltext,
        attributes: ["title"],
        orders: ["ASC"],
      },
      {
        key: "content",
        type: IndexType.Fulltext,
        attributes: ["content"],
        orders: ["ASC"],
      },
    ],
  });

  console.log("Question table with columns and indexes created.");
}

// Permission - 'any' is just anyone that visits the page, 'users' is those who are logged in, these 2 are the defaults i guess (can add if you need more) ?
// we need to add the attributes (i guess it's fields) and indexes in a collection?
