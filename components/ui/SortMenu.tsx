import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { SortKey } from "@/types/admin";

export default function SortMenu({
  sortKey,
  onChangeSortKey,
}: {
  sortKey: SortKey;
  onChangeSortKey: (newSortKey: SortKey) => void;
}) {
  const sortLabel =
    sortKey === "rating"
      ? "별점순"
      : sortKey === "date"
      ? "등록순"
      : sortKey === "commentAsc"
      ? "댓글 미작성"
      : "댓글 작성";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 px-3 text-sm">
          정렬: {sortLabel}
          <svg
            className="ml-1"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white z-50">
        <DropdownMenuRadioGroup
          value={sortKey}
          onValueChange={(newValue) => onChangeSortKey(newValue as SortKey)}
        >
          <DropdownMenuRadioItem value="date">등록순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rating">별점순</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commentAsc">
            댓글 미작성
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commentDesc">
            댓글 작성
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
