export type ReviewRow = {
  id: string;
  rating: number; // 0.5 step 지원 (예: 1.5, 3.5)
  author: string;
  createdAt: string; // "YYYY.MM.DD"
  content: string;
  hasComment: boolean;
  comment?: string;
};
export type SortKey = "date" | "rating" | "commentAsc" | "commentDesc";
export interface Store {
  id: string;
  name: string;
  address?: string;
}

export interface StoreSelectProps {
  value: string; // storeId
  stores: Store[];
  onChange: (id: string) => void;
}
