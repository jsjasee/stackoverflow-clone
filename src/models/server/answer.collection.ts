import { Permission, Role, IndexType, OrderBy } from "node-appwrite";

import { db, answerCollection } from "../name";
import { tablesDB } from "./config";

// a table is known as a collection in appwrite now. its the newer code.
export default async function createAnswerTable() {
  await tablesDB.createTable({
    databaseId: db,
    tableId: answerCollection,
    name: answerCollection,
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

  console.log("Answer table is created");

  // create attributes
  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: answerCollection,
    key: "content",
    size: 10000,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: answerCollection,
    key: "authorId",
    size: 50,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: answerCollection,
    key: "questionId",
    size: 50,
    required: true,
  });

  console.log("Answer attributes / columns created.");

  // no index for answers
}
