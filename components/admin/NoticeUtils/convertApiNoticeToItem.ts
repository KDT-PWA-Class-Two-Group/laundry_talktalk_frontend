import { NoticeItem } from "@/types/admin";

// API에서 받은 공지/홍보 데이터 객체를 프론트엔드에서 사용하는 NoticeItem 형태로 변환하는 함수
// 각 필드는 API 응답의 값이 없거나 형식이 다를 경우를 대비해 안전하게 처리함

export function convertApiNoticeToItem(apiNotice: any): NoticeItem {
  // store_notice_event_type이 false면 "공지", true면 "홍보"로 변환
  // 날짜는 yyyy-mm-dd 형식을 .으로 변환하여 createdAt에 저장
  return {
    id: apiNotice.store_notice_event_id && apiNotice.store_notice_event_id.toString() ? apiNotice.store_notice_event_id.toString() : "",
    title: apiNotice.store_notice_event_title ? apiNotice.store_notice_event_title : "",
    type: apiNotice.store_notice_event_type === false ? "공지" : "홍보",
    createdAt:
      apiNotice.store_notice_event_create_time && apiNotice.store_notice_event_create_time.slice(0, 10)
        ? apiNotice.store_notice_event_create_time.slice(0, 10).replace(/-/g, ".")
        : "",
    startAt: apiNotice.store_notice_event_start_time ? apiNotice.store_notice_event_start_time : "",
    endAt: apiNotice.store_notice_event_end_time ? apiNotice.store_notice_event_end_time : "",
    content: apiNotice.store_notice_event_contents ? apiNotice.store_notice_event_contents : "",
    fileName: apiNotice.store_notice_event_image_url ? apiNotice.store_notice_event_image_url : "",
  };
}
