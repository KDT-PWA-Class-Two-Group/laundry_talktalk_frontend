'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin } from "iconoir-react";

// 임시 매장 데이터
const nearbyStores = [
  { id: 2, name: "세탁소2번", address: "대전 ㅇㅇ동 202", phone: "010-123-4567" },
  { id: 3, name: "세탁소3번", address: "서울 ㅁㅁ동 33", phone: "010-6665-6666" },
]

export function SearchMap() {
  const [location, setLocation] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<typeof nearbyStores[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`위도: ${latitude}, 경도: ${longitude}`)
          alert(`위치 정보: 위도 ${latitude}, 경도 ${longitude}`)
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 활성화해주세요.")
          } else {
            alert("위치 정보를 가져올 수 없습니다: " + error.message)
          }
        }
      )
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.")
    }
  }

  const handlePinClick = (store: typeof nearbyStores[0]) => {
    setSelectedStore(store)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }

  return (
    <div className="w-full max-w-sm">
      {/* 주소 입력 및 버튼 */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* 현재 위치 표시 */}
      {location && <p className="text-sm text-gray-600 mb-4">{location}</p>}
    
      <div className="border rounded-lg p-4 border-gray-200 bg-white shadow-sm">
        <div id="map" className="w-full h-64">
          {/* 지도 영역: 임시 핀 버튼으로 대체 */}
          <div className="border h-64 w-full bg-gray-100 relative p-2">
            {nearbyStores.map((store) => (
              <button
                key={store.id}
                className="absolute bg-red-500 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                style={{
                  top: `${Math.random() * 80}%`, // 임시 랜덤 위치
                  left: `${Math.random() * 80}%`,
                }}
                onClick={() => handlePinClick(store)}
              >
                <MapPin width={15} height={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedStore && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-80 p-4 relative shadow-lg">
          
          {/* 닫기 버튼 */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={closeModal}
          >
            ✕
          </button>

          {/*매장 이름*/}
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold">{selectedStore.name}</span>
          </div>

          {/* 주소, 전화 */}      
          <p className="text-gray-700 text-sm mb-1">주소: {selectedStore.address}</p>
          <p className="text-gray-700 text-sm mb-2">전화: {selectedStore.phone}</p>

          {/* 별점 */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-yellow-400 ${i < 4 ? '' : 'text-gray-300'}`}>★</span>
            ))}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 mb-2">
            <button
              className="flex-1 bg-sky-500 text-white py-2 rounded"
              onClick={() => {
              if (selectedStore) {
                window.location.href = `/store-info/${selectedStore.id}`;
              }
              }}
            >
              매장정보
            </button>
            <button
              className="flex-1 bg-sky-500 text-white py-2 rounded"
              onClick={() => {
              if (selectedStore) {
                window.location.href = `/laundry-reservation/${selectedStore.id}`;
              }
              }}
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
