import { answerCollection, db } from "@/src/models/name";
import { tablesDB, users } from "@/src/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/src/store/Auth";

// write your backend logic here.
// this is for our answer database
// having our own api to create this answer document, and also so that we can increase the reputation?
export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    const response = await tablesDB.createRow({
      databaseId: db,
      tableId: answerCollection,
      rowId: ID.unique(),
      data: {
        content: answer,
        authorId: authorId,
        questionId: questionId,
      },
    });

    // increase author reputation (how does this syntax work?? ) how do you know that the prefs is the same structure as userprefs? did we initialise this prefs anywhere?? i thought Auth.ts only create the userPrefs template only?
    const prefs = await users.getPrefs<UserPrefs>({ userId: authorId });

    await users.updatePrefs({
      userId: authorId,
      prefs: { reputation: Number(prefs.reputation) + 1 },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer", // if error is NOT there, use the latter
      },
      { status: error?.status || error?.code || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await tablesDB.getRow({
      databaseId: db,
      tableId: answerCollection,
      rowId: answerId,
    });

    const response = await tablesDB.deleteRow({
      databaseId: db,
      tableId: answerCollection,
      rowId: answerId,
    });

    // decrease the reputation
    const prefs = await users.getPrefs<UserPrefs>({
      userId: answer.authorId,
    }); // yes each answer row has an attribute 'authorId', each answer row has an attribute called authorId

    await users.updatePrefs({
      userId: answer.authorId,
      prefs: { reputation: Number(prefs.reputation) - 1 },
    });

    return NextResponse.json(
      { data: response },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error deleting the answer", // if error is NOT there, use the latter
      },
      { status: error?.status || error?.code || 500 },
    );
  }
}
