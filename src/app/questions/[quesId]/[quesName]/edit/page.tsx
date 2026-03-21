import { db, questionCollection } from "@/src/models/name";
import { tablesDB } from "@/src/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { Questions } from "@/types/appwrite";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const question: Questions = await tablesDB.getRow({
    databaseId: db,
    tableId: questionCollection,
    rowId: params.quesId,
  });

  return <EditQues question={question} />;
};

export default Page;
