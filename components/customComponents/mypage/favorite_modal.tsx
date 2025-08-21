// src/app/mypage/favorites/favorite_modal.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Heart, Compass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 인터페이스는 @/types/mypage.ts에서 불러옵니다.
import { FavoriteStore, SelectedStoreType } from "@/types/mypage";

//================================================================================
// 헬퍼 함수
//================================================================================
export const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>
      ))}
      {halfStar && (
        <span className="relative inline-block w-3 text-yellow-400 overflow-hidden">
          ★
          <span className="absolute left-0 w-1/2 overflow-hidden text-gray-300">
            ★
          </span>
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
    </>
  );
};

//================================================================================
// FavoriteStoreCard 컴포넌트
//================================================================================
export const FavoriteStoreCard: React.FC<{
  store: FavoriteStore;
  onRemove: (id: number) => void;
}> = ({ store, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative w-full max-w-[280px] h-[200px] rounded-xl shadow-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onRemove(store.id)}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white bg-opacity-80 focus:outline-none"
      >
        <Heart className="w-5 h-5" fill="red" stroke="red" />
        <span className="sr-only">즐겨찾기에서 제외</span>
      </button>

      {isHovered ? (
        <div className="absolute inset-0 bg-white p-4 flex flex-col justify-center transition-opacity duration-300">
          <h3 className="font-bold text-lg mb-2">{store.name}</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="flex items-center gap-1">
              <span className="text-gray-400">📍</span> 주소 | {store.address}
            </p>
            <p className="flex items-center gap-1">
              <span className="text-gray-400">⭐</span> 리뷰 평점 |{" "}
              {renderStars(store.rating)}
              <span className="ml-1 text-xs text-gray-500">
                ({store.rating})
              </span>
            </p>
            <p className="flex items-center gap-1">
              <span className="text-gray-400">📞</span> 전화번호 | {store.phone}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col">
          {store.imageUrl ? (
            <Image
              src={store.imageUrl}
              alt={store.name}
              fill
              style={{ objectFit: "cover" }}
              className="z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 flex-grow flex items-center justify-center text-gray-500 font-semibold text-sm">
              이미지 준비중
            </div>
          )}
          <div className="absolute bottom-0 w-full p-2 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <h3 className="text-base font-semibold text-center">
              {store.name}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

//================================================================================
// SelectedStoreCard 컴포넌트
//================================================================================
export const SelectedStoreCard: React.FC<{
  store: FavoriteStore;
  isFavorite: boolean;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
}> = ({ store, isFavorite, onToggleFavorite }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg">
      <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
        {store.imageUrl ? (
          <Image
            src={store.imageUrl}
            alt={store.name}
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            이미지 없음
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-lg">{store.name}</h4>
        <div className="text-xs text-gray-600 space-y-0.5 mt-1">
          <p className="flex items-center gap-1">
            <span className="text-gray-400">⭐</span> 평점 | {store.rating}
          </p>
          <p className="flex items-center gap-1">
            <span className="text-gray-400">📍</span> 주소 | {store.address}
          </p>
          <p className="flex items-center gap-1">
            <span className="text-gray-400">📞</span> 전화번호 | {store.phone}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggleFavorite(store.id, isFavorite)}
        className="ml-4 p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
        aria-label="즐겨찾기 추가/제거"
      >
        <Heart
          className="w-5 h-5"
          fill={isFavorite ? "red" : "none"}
          stroke="red"
        />
      </button>
    </div>
  );
};

//================================================================================
// 위치 정보 동의 모달
//================================================================================
interface LocationPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
  onDisagree: () => void;
}

export const LocationPermissionModal: React.FC<
  LocationPermissionModalProps
> = ({ open, onOpenChange, onAgree, onDisagree }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>위치 정보 사용 동의</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            현재 위치를 기반으로 주변 세탁소를 표시하기 위해 위치 정보 사용에
            동의하시겠습니까?
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onDisagree} variant="outline">
            동의 안함
          </Button>
          <Button
            onClick={onAgree}
            className="bg-[#74D4FF] hover:bg-[#5BBCE3] text-white"
          >
            동의
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

//================================================================================
// 즐겨찾기 추가 지도 모달 (Google 지도 연동)
//================================================================================
interface AddFavoritesMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapCenter: { lat: number; lng: number };
  selectedStore: SelectedStoreType | null;
  favoriteStores: FavoriteStore[]; // 즐겨찾기 목록 (마커 색상 등에 활용)
  availableStores: FavoriteStore[]; // 지도에 표시할 모든 매장 목록
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onMapPinClick: (storeId: number) => void; // 지도 마커 클릭 시 호출
}

// Google Maps API 스크립트를 동적으로 로드하는 함수
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  // 이미 로드되었으면 바로 resolve
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // Places 라이브러리 추가 (장소 검색 기능에 필요할 수 있음)
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Maps 스크립트를 로드할 수 없습니다."));
    document.head.appendChild(script);
  });
};

export const AddFavoritesMapModal: React.FC<AddFavoritesMapModalProps> = ({
  open,
  onOpenChange,
  mapCenter,
  selectedStore,
  favoriteStores,
  availableStores, // 모든 매장 목록 prop으로 받기
  onToggleFavorite,
  onMapPinClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null); // 지도를 렌더링할 DOM 요소
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Google Maps API 키 (환경 변수에서 가져옴)
  // NEXT_PUBLIC_ 접두사가 붙어야 브라우저에서 접근 가능합니다.
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 1. 모달이 열릴 때 Google Maps 스크립트 로드
  useEffect(() => {
    if (open && !googleMapsLoaded && GOOGLE_MAPS_API_KEY) {
      loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
        .then(() => {
          setGoogleMapsLoaded(true);
          console.log("Google Maps API 스크립트 로드 완료");
        })
        .catch((error) => {
          console.error("Google Maps API 로드 실패:", error);
          alert("지도를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
        });
    }
    // 모달이 닫힐 때 지도 인스턴스 초기화 및 마커 제거 (리소스 해제)
    if (!open && mapInstance) {
      markers.forEach((marker) => marker.setMap(null)); // 모든 마커 제거
      setMarkers([]);
      // mapInstance.setDiv(null); // 이 줄을 제거하여 오류를 해결합니다.
      setMapInstance(null);
      setGoogleMapsLoaded(false); // 스크립트 다시 로드할 수 있도록 상태 초기화
    }
  }, [open, googleMapsLoaded, GOOGLE_MAPS_API_KEY, mapInstance, markers]);

  // 2. 스크립트 로드 후 지도 인스턴스 초기화
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current && !mapInstance) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 15, // 초기 줌 레벨
        mapId: "YOUR_MAP_ID", // 구글 클라우드 콘솔에서 설정한 맵 ID (선택 사항)
        disableDefaultUI: true, // 기본 UI 숨기기
        zoomControl: true, // 줌 컨트롤만 표시
      });
      setMapInstance(map);
      console.log("Google Maps 지도 인스턴스 초기화 완료");
    }
  }, [googleMapsLoaded, mapRef, mapCenter, mapInstance]);

  // 3. 맵 센터 변경 시 지도 이동
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter(mapCenter);
    }
  }, [mapInstance, mapCenter]);

  // 4. availableStores 또는 mapInstance 변경 시 마커 생성/업데이트
  useEffect(() => {
    if (mapInstance && availableStores.length > 0) {
      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null));
      const newMarkers: google.maps.Marker[] = [];

      availableStores.forEach((store) => {
        // 매장 데이터에 위도와 경도가 있어야 합니다.
        if (store.latitude && store.longitude) {
          const isFav = favoriteStores.some(
            (favStore) => favStore.id === store.id
          );

          const marker = new window.google.maps.Marker({
            position: { lat: store.latitude, lng: store.longitude },
            map: mapInstance,
            title: store.name,
            icon: isFav
              ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 즐겨찾기 여부에 따라 아이콘 변경
          });

          // 마커 클릭 시 상위 컴포넌트의 onMapPinClick 호출
          marker.addListener("click", () => {
            onMapPinClick(store.id);
          });
          newMarkers.push(marker);
        }
      });
      setMarkers(newMarkers);
      console.log("지도 마커 업데이트 완료");
    }
  }, [mapInstance, availableStores, favoriteStores, onMapPinClick]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white max-w-md w-full h-[600px] flex flex-col p-4"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-2">
          <DialogTitle>즐겨찾기 추가</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="relative flex items-center mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <Input
            type="text"
            placeholder="장소를 검색하세요."
            className="pl-10 pr-12"
            // TODO: 장소 검색 기능 추가 시 여기에 검색어 상태 및 onChange 핸들러 추가
          />
          <Button
            // 이 버튼은 현재 위치로 지도를 이동시키는 역할을 합니다.
            // Geolocation API를 사용하여 현재 위치를 가져오고 mapCenter 상태를 업데이트합니다.
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    // 현재 위치를 기준으로 mapCenter를 업데이트하여 지도 이동
                    // 상위 컴포넌트의 mapCenter 상태를 직접 변경할 수는 없으므로,
                    // 이곳에서는 지도 인스턴스의 center를 직접 설정합니다.
                    mapInstance?.setCenter({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
                    mapInstance?.setZoom(15); // 현재 위치로 이동 시 줌 레벨 조정
                  },
                  (error) => {
                    console.error("현재 위치를 가져오지 못했습니다.", error);
                    alert("현재 위치를 가져오는 데 실패했습니다.");
                  }
                );
              } else {
                alert("이 브라우저는 지오로케이션을 지원하지 않습니다.");
              }
            }}
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:bg-gray-100"
            aria-label="현재 위치로 이동"
          >
            <Compass className="w-5 h-5" />
          </Button>
        </div>

        {/* 지도가 렌더링될 영역 */}
        <div
          ref={mapRef}
          className="w-full flex-grow bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg overflow-hidden"
          style={{ height: "300px" }} // 지도 div의 높이 지정
        >
          {/* Google Maps API 로드 상태에 따라 메시지 표시 */}
          {!googleMapsLoaded ? (
            <p className="text-center">Google 지도를 불러오는 중...</p>
          ) : // 지도가 성공적으로 로드되면 이 div 안에 지도가 표시됩니다.
          // 지도 인스턴스가 생성되기 전까지는 "지도를 초기화 중입니다..." 메시지 표시
          !mapInstance ? (
            <p className="text-center">지도를 초기화 중입니다...</p>
          ) : null}
        </div>

        {selectedStore && (
          <div className="pt-4">
            <SelectedStoreCard
              store={selectedStore}
              isFavorite={favoriteStores.some(
                (store) => store.id === selectedStore.id
              )}
              onToggleFavorite={(id) => {
                const isCurrentlyFavorite = favoriteStores.some(
                  (store) => store.id === id
                );
                onToggleFavorite(id, isCurrentlyFavorite);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
