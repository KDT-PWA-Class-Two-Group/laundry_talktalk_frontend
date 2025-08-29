import { NoticeItem } from "@/types/admin";
import { convertApiNoticeToItem } from "./convertApiNoticeToItem";

export async function fetchStoreName(storeIdString: string): Promise<string> {
  const res = await fetch("/api/stores");
  const storeDataArray = await res.json();
  const foundStore = storeDataArray.find(
    (storeObj: any) => storeObj.store_id?.toString() === storeIdString
  );
  return foundStore && foundStore.store_name ? foundStore.store_name : "";
}

export async function fetchNoticeList(
  storeIdString: string
): Promise<NoticeItem[]> {
  const response = await fetch(`/app/api/posts/store/${storeIdString}`);
  const noticeDataArray = await response.json();
  return noticeDataArray.map(convertApiNoticeToItem);
}

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
