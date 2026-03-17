import { Permission, Role, IndexType, OrderBy } from "node-appwrite";

import { db, commentCollection } from "../name";
import { tablesDB } from "./config";

// a table is known as a collection in appwrite now. its the newer code.
export default async function createCommentTable() {
  await tablesDB.createTable({
    databaseId: db,
    tableId: commentCollection,
    name: commentCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    rowSecurity: false,
    enabled: true,
  });

  console.log("Comment table is created");

  // create attributes
  await tablesDB.createEnumColumn({
    databaseId: db,
    tableId: commentCollection,
    key: "type",
    elements: ["answer", "question"],
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: commentCollection,
    key: "content",
    size: 10000,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: commentCollection,
    key: "typeId",
    size: 50,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: commentCollection,
    key: "authorId",
    size: 50,
    required: true,
  });

  console.log("Answer attributes / columns created.");

  // no index for comments.
}
