import { db } from "../name";
import createAnswerTable from "./answer.collection";
import createCommentTable from "./comment.collection";
import createQuestionTable from "./question.collection";
import createVoteTable from "./vote.collection";

import { tablesDB } from "./config";

export default async function getOrCreateDB() {
  try {
    await tablesDB.get({
      databaseId: db,
    }); // tablesDB is getting connected here
    console.log("Database / tablesDB connected.");
  } catch (error) {
    // in case database is NOT connected.
    try {
      await tablesDB.create({
        databaseId: db,
        name: db,
      });
      console.log("database (aka table) created");
      // create collections
      await Promise.all([
        createQuestionTable(),
        createAnswerTable(),
        createCommentTable(),
        createVoteTable(),
      ]);
      console.log("Collection created");
      console.log("Database connected.");
    } catch (error) {
      console.log("Error creating databases or collection.", error);
    }
  }

  return tablesDB;
}
