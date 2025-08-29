import type { ReviewRow } from "../../../types/admin";

export const toTime = (dateString: string) => {
  const [year, month, day] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
};

export const byNewest = (nextReview: ReviewRow, prevReview: ReviewRow) =>
  toTime(prevReview.createdAt) - toTime(nextReview.createdAt);

export const byRating = (nextReview: ReviewRow, prevReview: ReviewRow) =>
  prevReview.rating - nextReview.rating;

export const toInt = (hasComment: boolean) => (hasComment ? 1 : 0);
