'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin } from "iconoir-react"

//임시 데이터
const nearbyStores = [
  { id: 2, name: "세탁소2번", address: "대전 ㅇㅇ동 202", phone: "010-123-4567", image: "/images/wash1.jpg" },
  { id: 3, name: "세탁소3번", address: "서울 ㅁㅁ동 33", phone: "010-6665-6666", image: "/images/wash2.jpg" },
]

export function SearchMap() {
  const [location, setLocation] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<typeof nearbyStores[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`위도: ${latitude}, 경도: ${longitude}`);
          alert(`위치 정보: 위도 ${latitude}, 경도 ${longitude}`);

          // 위치 정보를 /api/nearby로 POST 요청
          try {
            const response = await fetch('/api/nearby', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ latitude, longitude }),
            });
            if (!response.ok) {
              throw new Error('서버에 위치 정보를 전송하는 데 실패했습니다.');
            }
            const data = await response.json();
            console.log('서버 응답:', data);
          } catch (error) {
            console.error('위치 정보 전송 오류:', error);
          }
        },
        (error) => alert("위치 정보를 가져올 수 없습니다: " + error.message)
      );
    }
  }

  const handlePinClick = async (store: typeof nearbyStores[0], latitude: number, longitude: number) => {
    setSelectedStore(store)
    setIsModalOpen(true)
    try {
      const response = await fetch('/api/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error('서버에 매장 정보를 전송하는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버 응답:', data);
    } catch (error) {
      console.error('매장 정보 전송 오류:', error);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* 검색 영역 */}
      <div className="border rounded-lg p-4 border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Input type="text" placeholder="주소를 입력하세요" />
          <Button
            type="button"
            className="bg-sky-500 text-white px-3 py-1 rounded"
            onClick={() => alert("주소 검색 기능은 아직 구현되지 않았습니다.")}
          >
            검색
          </Button>
          <Button
            type="button"
            className="bg-sky-500 text-white px-3 py-1 rounded"
            onClick={handleGetLocation}
          >
            위치
          </Button>
        </div>
        {location && <p className="text-sm text-gray-600 mt-2">{location}</p>}
      </div>

      {/* 임시 지도 및 핀 */}
      {/* 지도 영역 */}
      <div className="border rounded-lg p-4 border-gray-200 bg-white shadow-sm">
        <div className="relative h-64 bg-gray-100">
          {nearbyStores.map((store) => (
            <div
              key={store.id}
              className="absolute flex flex-col items-center"
              style={{
              // 임시로 실제 위도/경도 값을 37~38, 127~128 범위에서 랜덤 생성
              top: `${((store.id * 12345) % 100) * 0.8}%`,
              left: `${((store.id * 54321) % 100) * 0.8}%`,
              }}
            >
              <button
              className="bg-red-500 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
              onClick={() =>
                handlePinClick(
                store,
                37 + Math.random(), // 임시 위도
                127 + Math.random() // 임시 경도
                )
              }
              >
              <MapPin width={14} height={14} />
              </button>
              {/* 매장 이름 라벨 및 위도/경도 표기 */}
              <span className="mt-1 text-xs bg-white px-1 rounded shadow">
              {store.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-80 p-4 relative shadow-lg">
            <button
              className="absolute top-2 right-2 w-5 h-5 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>

             {/* 매장 이미지 */}
            {selectedStore.image && (
              <img 
                src={selectedStore.image} 
                alt={selectedStore.name} 
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}

            <div className="flex items-center mb-2">
              <span className="text-lg font-bold">{selectedStore.name}</span>
            </div>
            <p className="text-gray-700 text-sm mb-1">주소: {selectedStore.address}</p>
            <p className="text-gray-700 text-sm mb-2">전화: {selectedStore.phone}</p>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-yellow-400 ${i < 4 ? '' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button
                className="flex-1 bg-sky-500 text-white py-2 rounded"
                onClick={() => window.location.href = `/store-info/${selectedStore.id}`}
              >
                매장정보
              </button>
              <button
                className="flex-1 bg-sky-500 text-white py-2 rounded"
                onClick={() => window.location.href = `/laundry-reservation/${selectedStore.id}`}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
