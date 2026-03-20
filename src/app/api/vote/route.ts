import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/src/models/name";
import { tablesDB, users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import { table } from "console";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    // grab the data
    const { votedById, voteStatus, type, typeId } = await request.json();

    // list the rows that fits the condition i guess
    // the queries is like a filter condition, like in notion, only get the rows that fits these filters?
    const response = await tablesDB.listRows({
      databaseId: db,
      tableId: voteCollection,
      queries: [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("votedById", votedById),
      ],
    });

    if (response.rows.length > 0) {
      // that means there are existing rows (data) - someone wants to take back their upvote or take back their downvote. if taking back upvote, increase rep by 1, if taking back downvote, increase rep by 1.
      // what does the $ mean?
      await tablesDB.deleteRow({
        databaseId: db,
        tableId: voteCollection,
        rowId: response.rows[0].$id,
      });

      // decrease the reputation (you can also upvote or downvote the answer, that's why we are checking the type)
      const QuestionOrAnswer = await tablesDB.getRow({
        databaseId: db,
        tableId: type === "question" ? questionCollection : answerCollection,
        rowId: typeId,
      });

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId,
      );

      await users.updatePrefs<UserPrefs>({
        userId: QuestionOrAnswer.authorId,
        prefs: {
          reputation:
            response.rows[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        },
      });
    }

    // if the voteStatus (upvote or downvote) does not match what we have aka what the user sent does not match what we have?
    // this means previous vote does not exist or vote status changes, like previously user pressed upvote but now pressed downvote..
    if (response.rows[0]?.voteStatus !== voteStatus) {
      // if they are changing their vote, create a fresh document.
      const rowCreated = await tablesDB.createRow({
        databaseId: db,
        tableId: voteCollection,
        rowId: ID.unique(),
        data: {
          type,
          typeId,
          voteStatus,
          votedById,
        },
      });

      // Increase or decrease the reputation of the question/answer by the author accordingly
      const QuestionOrAnswer = await tablesDB.getRow({
        databaseId: db,
        tableId: type === "question" ? questionCollection : answerCollection,
        rowId: typeId,
      });

      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId,
      );

      // if vote was present
      if (response.rows[0]) {
        await users.updatePrefs<UserPrefs>({
          userId: QuestionOrAnswer.authorId,
          prefs: {
            reputation:
              // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
              response.rows[0].voteStatus === "upvoted"
                ? Number(authorPrefs.reputation) - 1
                : Number(authorPrefs.reputation) + 1,
          },
        });
      } else {
        // why do we need this block? we are just checking voteStatus and NOT response.rows[0]
        await users.updatePrefs<UserPrefs>({
          userId: QuestionOrAnswer.authorId,
          prefs: {
            reputation:
              // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
              voteStatus === "upvoted"
                ? Number(authorPrefs.reputation) + 1
                : Number(authorPrefs.reputation) - 1,
          },
        });
      }
    }

    // what is going on here, why limit our query to just 1? - aren't we just getting ONE upvote them?
    const [upvotes, downvotes] = await Promise.all([
      tablesDB.listRows({
        databaseId: db,
        tableId: voteCollection,
        queries: [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // limit our results to just ONE. so it's an upvote. and for optimization as we only need total?? how does the structure even look like...
        ],
      }),
      tablesDB.listRows({
        databaseId: db,
        tableId: voteCollection,
        queries: [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // limit our results to just ONE. so it's a downvote.
        ],
      }),
    ]);

    return NextResponse.json({
      data: {
        row: null,
        voteResult: upvotes.total - downvotes.total,
      },
      message: "vote handled",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error in voting",
      },
      { status: error?.status || error?.code || 500 },
    );
  }
}
