import { Permission, Role, IndexType, OrderBy } from "node-appwrite";

import { db, voteCollection } from "../name";
import { tablesDB } from "./config";

// a table is known as a collection in appwrite now. its the newer code.
export default async function createVoteTable() {
  await tablesDB.createTable({
    databaseId: db,
    tableId: voteCollection,
    name: voteCollection,
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

  console.log("Vote table is created");

  // create attributes
  await tablesDB.createEnumColumn({
    databaseId: db,
    tableId: voteCollection,
    key: "type",
    elements: ["answer", "question"],
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: voteCollection,
    key: "typeId",
    size: 50,
    required: true,
  });

  await tablesDB.createVarcharColumn({
    databaseId: db,
    tableId: voteCollection,
    key: "votedById",
    size: 50,
    required: true,
  });

  console.log("Vote attributes / columns created.");

  // no index for votes.
}
