// src/types/ui.ts
import type {
  Answers as AnswerRowBase,
  Comments as CommentRowBase,
  Votes as VoteRowBase,
} from "@/types/appwrite";

export type RowList<T> = {
  total: number;
  rows: T[];
};

export type UserPreview = {
  $id: string;
  name: string;
  reputation: number;
};

export type AuthorPreview = {
  $id: string;
  name: string;
};

export type VoteRow = VoteRowBase;

export type CommentRow = CommentRowBase & {
  author: AuthorPreview;
};

export type AnswerRow = AnswerRowBase & {
  author: UserPreview;
  comments: RowList<CommentRow>;
  upvotesDocuments: RowList<VoteRow>;
  downvotesDocuments: RowList<VoteRow>;
};
