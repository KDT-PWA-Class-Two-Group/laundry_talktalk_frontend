'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SearchMap() {
  const [location, setLocation] = useState<string | null>(null)

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
            alert(
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 활성화해주세요."
            )
          } else {
            alert("위치 정보를 가져올 수 없습니다: " + error.message)
          }
        }
      )
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.")
    }
  }

  return (
  <div className="w-full max-w-sm">
    <div className="flex items-center gap-2">
      <Input type="text" placeholder="주소를 입력하세요" />
      <Button
        type="button"
        variant="outline"
        className="bg-sky-500 text-white px-3 py-1 rounded"
        onClick={() => alert("주소 검색 기능은 아직 구현되지 않았습니다.")}
      >
        검색
      </Button>
      <Button
        type="button"
        variant="outline"
        className="bg-sky-500 text-white px-3 py-1 rounded"
        onClick={handleGetLocation}
      >
        위치
      </Button>
    </div>


    {location && (
      <p className="text-sm text-gray-600 mt-2">{location}</p>
    )}
  </div>
)
}
