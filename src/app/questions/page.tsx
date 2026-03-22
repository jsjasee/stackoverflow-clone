import { tablesDB, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/src/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/src/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { Questions } from "@/types/appwrite";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ?? "1";

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((+page - 1) * 2), // this number is for the number of results per page also, like the number of results it will fetch from the page? how does pagination works? all i know is if this number and the number in the limit is changed, YOU MUST UPDATE THE NUMBER IN PAGINATION, aka the 'limit' param in pagination IN ORDER FOR IT TO WORK AS WELL.
    Query.limit(2), // this is to limit the number of results returned to 2?
  ];

  if (resolvedSearchParams.tag) {
    queries.push(Query.equal("tags", resolvedSearchParams.tag));
  }

  if (resolvedSearchParams.search) {
    queries.push(
      Query.or([
        Query.search("title", resolvedSearchParams.search),
        Query.search("content", resolvedSearchParams.search),
      ]),
    );
  }

  const questions = await tablesDB.listRows({
    databaseId: db,
    tableId: questionCollection,
    queries,
  });
  console.log("Questions", questions);

  questions.rows = await Promise.all(
    questions.rows.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        tablesDB.listRows({
          databaseId: db,
          tableId: answerCollection,
          queries: [
            Query.equal("questionId", ques.$id),
            Query.limit(1), // for optimization
          ],
        }),
        tablesDB.listRows({
          databaseId: db,
          tableId: voteCollection,
          queries: [
            Query.equal("type", "question"),
            Query.equal("typeId", ques.$id),
            Query.limit(1), // for optimization
          ],
        }),
      ]);

      // you are calculating and adding the field to each question item, which is the totalAnswers and totalVotes
      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask a question
            </span>
          </ShimmerButton>
        </Link>
      </div>
      <div className="mb-4">
        <Search />
      </div>
      <div className="mb-4">
        <p>{questions.total} questions</p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.rows.map((ques: any) => (
          <QuestionCard key={ques.$id} ques={ques} />
        ))}
      </div>
      <Pagination total={questions.total} limit={2} />
    </div>
    // i guess the limit in the pagination determines the number of results per page?
  );
};

export default Page;
