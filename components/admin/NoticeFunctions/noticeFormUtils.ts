import { NoticeItem } from "@/types/admin";

// 오늘 날짜를 받아서 공지/홍보글 폼의 초기값 객체를 반환하는 함수
// createdAt은 yyyy.mm.dd 형식으로 변환, 나머지는 빈 값 또는 기본값으로 설정

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
