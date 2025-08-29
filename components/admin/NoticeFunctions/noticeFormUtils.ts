import { NoticeItem } from "@/types/admin";

export const getInitialNoticeForm = (todayDateString: string): NoticeItem => ({
  id: "",
  title: "",
  type: "공지",
  createdAt: todayDateString.replace(/-/g, "."),
  startAt: todayDateString,
  endAt: todayDateString,
  content: "",
  fileName: "",
});
