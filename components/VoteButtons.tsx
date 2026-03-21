"use client";

import { tablesDB } from "@/src/models/client/config";
import { db, voteCollection } from "@/src/models/name";
import { useAuthStore } from "@/src/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { RowList, VoteRow } from "@/types/ui";

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: RowList<VoteRow>;
  downvotes: RowList<VoteRow>;
  className?: string;
}) => {
  const [votedRow, setVotedRow] = React.useState<VoteRow | null | undefined>(
    undefined,
  );

  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total,
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (!user) {
        setVotedRow(null);
        return;
      }

      const response: RowList<VoteRow> = await tablesDB.listRows({
        databaseId: db,
        tableId: voteCollection,
        queries: [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ],
      });

      setVotedRow(response.rows[0] ?? null);
    })();
  }, [user, id, type]);

  const toggleUpvote = async () => {
    if (!user) return router.push("/login");
    if (votedRow === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "upvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(data.data.voteResult);
      setVotedRow(data.data.row);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  const toggleDownvote = async () => {
    if (!user) return router.push("/login");
    if (votedRow === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "downvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(data.data.voteResult);
      setVotedRow(data.data.row);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-start gap-y-4",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedRow?.voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30",
        )}
        onClick={toggleUpvote}
      >
        <IconCaretUpFilled />
      </button>

      <span>{voteResult}</span>

      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedRow?.voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30",
        )}
        onClick={toggleDownvote}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons;
