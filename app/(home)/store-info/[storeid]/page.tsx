import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { notFound } from "next/navigation";

// 서버컴포넌트: params로 storeId 받음
export default function StorePage({ params }: { params: { storeid: string } }) {
  // mock 매장 데이터
  const store = {
    id: params.storeid,
    name: `세탁소 ${params.storeid}`,
    phone: `010-1234-56${String(params.storeid).padStart(2, "0")}`,
    address: `서울시 강남구 테헤란로 ${10 + Number(params.storeid)}길`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    image: "/images/store.jpg",
  };

  // mock 공지/이벤트/리뷰 데이터
  const notices = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `공지사항 ${i + 1}`,
    image: `/images/notices1.jpg`,
    content: `공지사항 내용 ${
      i + 1
    }입니다. 위치기반 안내 서비스 등 다양한 소식이 포함됩니다.`,
    date: `2025.08.${(10 + i).toString().padStart(2, "0")}`,
  }));

  const events = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? `진행중 이벤트 ${i + 1}` : `종료된 이벤트 ${i + 1}`,
    image: `/images/events1.jpg`,
    content: `이벤트 내용 ${i + 1}입니다. 세탁기 할인, 특별 혜택 등.`,
    startDate: `2025-08-${(i + 1).toString().padStart(2, "0")}`,
    endDate:
      i % 2 === 0
        ? `2025-09-${(i + 1).toString().padStart(2, "0")}`
        : `2025-07-${(i + 1).toString().padStart(2, "0")}`,
  }));

  const reviews = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    writer: `사용자${i + 1}`,
    date: `2025.08.${(19 - i).toString().padStart(2, "0")}`,
    content: `매장 리뷰 ${
      i + 1
    }입니다. 깔끔하고 친절해요! 세탁기 상태도 좋아요.`,
    option: i % 2 === 0 ? "울코스, 이벤트세탁" : "표준코스",
  }));

  if (!store) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      {/* 매장 정보 카드 */}
      <div className="bg-sky-400 rounded-xl p-4 flex gap-4 items-center shadow-md mb-6">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
          <Image
            src={store.image}
            alt={store.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="font-bold text-white text-sm">{store.name}</div>
          <div className="text-xs text-white">전화번호: {store.phone}</div>
          <div className="text-xs text-white">주소: {store.address}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="bg-white text-sky-700 px-4 py-2 rounded font-bold text-xs shadow">
            별점 {store.rating}
          </span>
        </div>
      </div>

      {/* 탭 UI */}
      <Tabs defaultValue="notice" className="w-full">
        <TabsList className="bg-blue-50 rounded mb-2">
          <TabsTrigger value="notice">공지사항</TabsTrigger>
          <TabsTrigger value="event">이벤트</TabsTrigger>
          <TabsTrigger value="review">리뷰보기</TabsTrigger>
        </TabsList>
        {/* 공지사항 탭 */}
        <TabsContent value="notice">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-blue-100 rounded-lg p-4 mb-4 shadow relative aspect-4/5"
            >
              <div className="absolute top-2 right-4 text-xs text-gray-400">
                {n.date}
              </div>
              <div className="font-bold mb-2">{n.title}</div>
              <div className="relative p-14 aspect-square mt-5">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  className="rounded mb-2 object-cover"
                />
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line p-5">
                {n.content}
              </div>
            </div>
          ))}
        </TabsContent>
        {/* 이벤트 탭 */}
        <TabsContent value="event">
          {/* 진행중/종료된 이벤트 필터 드롭다운 */}
          {/* <EventDropdown events={events} /> */}
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-blue-100 rounded-lg p-4 mb-4 shadow relative aspect-4/5"
            >
              <div className="absolute top-2 right-4 text-xs text-gray-400">
                {e.startDate} ~ {e.endDate}
              </div>
              <div className="font-bold mb-2">{e.title}</div>
              <div className="relative p-14 aspect-square mt-5">
                <Image
                  src={e.image}
                  alt={e.title}
                  fill
                  className="rounded mb-2 object-cover"
                />
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line p-5">
                {e.content}
              </div>
            </div>
          ))}
        </TabsContent>
        {/* 리뷰 탭 */}
        <TabsContent value="review">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-blue-100 rounded-lg p-4 mb-4 shadow relative"
            >
              <div className="absolute top-2 right-4 text-xs text-gray-400">
                {r.date}
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm">작성자: {r.writer}</span>
                <span className="text-xs text-gray-500">옵션: {r.option}</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {r.content}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
