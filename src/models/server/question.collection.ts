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
  });

  console.log("Question table is created");

  // create attributes
  // size is the maximum number of characters allowed for that field

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: questionCollection,
    key: "title",
    size: 500,
    required: true,
  });

  await tablesDB.createTextColumn({
    databaseId: db,
    tableId: questionCollection,
    key: "content", // a text column has no limits - for longer text content
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: questionCollection,
    key: "authorId",
    size: 50,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: questionCollection,
    key: "tags",
    size: 50,
    required: true,
    xdefault: undefined, // default value if none is given.
    array: true, // this column stores an array of strings ?
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: questionCollection,
    key: "attachmentId",
    size: 50,
    required: false,
  });

  console.log("Question attributes / columns created.");

  // Create Indexes -- if it does not work, can be done manually in the appwrite website -> indexes are just a way of how appwrite searches the things in the database
  await tablesDB.createIndex({
    databaseId: db,
    tableId: questionCollection,
    key: "title", // name for this index, can use this key to edit the index later?
    type: IndexType.Fulltext,
    columns: ["title"],
    orders: [OrderBy.Asc], // arrange searches in ascending order?
  });

  await tablesDB.createIndex({
    databaseId: db,
    tableId: questionCollection,
    key: "content",
    type: IndexType.Fulltext,
    columns: ["content"],
    orders: [OrderBy.Asc],
  });
}

// Permission - 'any' is just anyone that visits the page, 'users' is those who are logged in, these 2 are the defaults i guess (can add if you need more) ?
// we need to add the attributes (i guess it's fields) and indexes in a collection?
