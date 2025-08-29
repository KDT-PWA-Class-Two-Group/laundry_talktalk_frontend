import { NoticeItem } from "@/types/admin";

export function convertApiNoticeToItem(apiNotice: any): NoticeItem {
  return {
    id:
      apiNotice.store_notice_event_id &&
      apiNotice.store_notice_event_id.toString()
        ? apiNotice.store_notice_event_id.toString()
        : "",
    title: apiNotice.store_notice_event_title
      ? apiNotice.store_notice_event_title
      : "",
    type: apiNotice.store_notice_event_type === false ? "공지" : "홍보",
    createdAt:
      apiNotice.store_notice_event_create_time &&
      apiNotice.store_notice_event_create_time.slice(0, 10)
        ? apiNotice.store_notice_event_create_time
            .slice(0, 10)
            .replace(/-/g, ".")
        : "",
    startAt: apiNotice.store_notice_event_start_time
      ? apiNotice.store_notice_event_start_time
      : "",
    endAt: apiNotice.store_notice_event_end_time
      ? apiNotice.store_notice_event_end_time
      : "",
    content: apiNotice.store_notice_event_contents
      ? apiNotice.store_notice_event_contents
      : "",
    fileName: apiNotice.store_notice_event_image_url
      ? apiNotice.store_notice_event_image_url
      : "",
  };
}
