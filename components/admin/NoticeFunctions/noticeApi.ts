import { NoticeItem } from "@/types/admin";
import { convertApiNoticeToItem } from "./convertApiNoticeToItem";

// 매장 ID로 매장 이름을 가져오는 함수
// /api/stores에서 매장 목록을 받아와서 storeId와 일치하는 매장명 반환

export async function fetchStoreName(storeIdString: string): Promise<string> {
  const res = await fetch("/api/stores");
  const storeDataArray = await res.json();
  const foundStore = storeDataArray.find(
    (storeObj: any) => storeObj.store_id?.toString() === storeIdString
  );
  return foundStore && foundStore.store_name ? foundStore.store_name : "";
}

// 매장 ID로 해당 매장의 공지/홍보글 리스트를 가져오는 함수
// API 응답을 NoticeItem 배열로 변환
export async function fetchNoticeList(
  storeIdString: string
): Promise<NoticeItem[]> {
  const response = await fetch(`/app/api/posts/store/${storeIdString}`);
  const noticeDataArray = await response.json();
  return noticeDataArray.map(convertApiNoticeToItem);
}

// 공지/홍보글을 새로 등록하는 함수
// 등록 후 최신 리스트를 반환
export async function createNotice(
  storeIdString: string,
  noticeForm: NoticeItem
): Promise<NoticeItem[] | null> {
  const response = await fetch("/app/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      store_id: storeIdString,
      store_notice_event_type: noticeForm.type === "공지" ? false : true,
      store_notice_event_title: noticeForm.title,
      store_notice_event_contents: noticeForm.content,
      store_notice_event_image_url: noticeForm.fileName,
      store_notice_event_start_time: noticeForm.startAt,
      store_notice_event_end_time: noticeForm.endAt,
    }),
  });
  if (!response.ok) return null;
  const refreshed = await fetch(`/app/api/posts/store/${storeIdString}`);
  const refreshedData = await refreshed.json();
  return refreshedData.map(convertApiNoticeToItem);
}

// 공지/홍보글을 수정하는 함수
// 수정 후 최신 리스트를 반환
export async function updateNotice(
  storeIdString: string,
  noticeId: string,
  noticeForm: NoticeItem
): Promise<NoticeItem[] | null> {
  const response = await fetch(`/app/api/posts/${noticeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      store_notice_event_title: noticeForm.title,
      store_notice_event_contents: noticeForm.content,
      store_notice_event_image_url: noticeForm.fileName,
      store_notice_event_start_time: noticeForm.startAt,
      store_notice_event_end_time: noticeForm.endAt,
      store_notice_event_type: noticeForm.type === "공지" ? false : true,
    }),
  });
  if (!response.ok) return null;
  const refreshed = await fetch(`/app/api/posts/store/${storeIdString}`);
  const refreshedData = await refreshed.json();
  return refreshedData.map(convertApiNoticeToItem);
}

// 공지/홍보글을 삭제하는 함수
// 삭제 후 최신 리스트를 반환
export async function deleteNotice(
  storeIdString: string,
  noticeId: string
): Promise<NoticeItem[] | null> {
  const response = await fetch(`/app/api/posts/${noticeId}`, {
    method: "DELETE",
  });
  if (!response.ok) return null;
  const refreshed = await fetch(`/app/api/posts/store/${storeIdString}`);
  const refreshedData = await refreshed.json();
  return refreshedData.map(convertApiNoticeToItem);
}
