"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus, Heart, Compass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 즐겨찾기 가게 데이터의 타입을 정의합니다.
interface FavoriteStore {
  id: number;
  name: string;
  address: string;
  rating: number;
  phone: string;
  imageUrl?: string;
}

// 예시 데이터입니다. 실제로는 API 호출로 받아와야 합니다.
const mockFavoriteStores: FavoriteStore[] = [
  {
    id: 1,
    name: "크린토피아 월평점",
    address: "대전 0000-000",
    rating: 4.5,
    phone: "010-1123-4455",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image",
  },
  {
    id: 2,
    name: "크린토피아 대전점",
    address: "대전 0000-000",
    rating: 3.0,
    phone: "010-1234-5678",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image",
  },
  {
    id: 3,
    name: "크린토피아 유성점",
    address: "대전 0000-000",
    rating: 5.0,
    phone: "010-9876-5432",
    imageUrl: "",
  },
  {
    id: 4,
    name: "크린토피아 둔산점",
    address: "대전 0000-000",
    rating: 4.0,
    phone: "010-5555-4444",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image",
  },
];

// 평점을 별점으로 변환하여 표시하는 함수
const renderStars = (rating: number) => {
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

// 즐겨찾기 목록에 표시되는 카드 컴포넌트
const FavoriteStoreCard: React.FC<{
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

// 지도에서 선택한 매장 정보를 표시하는 컴포넌트
const SelectedStoreCard: React.FC<{
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

export default function FavoritesPage() {
  const [favoriteStores, setFavoriteStores] =
    useState<FavoriteStore[]>(mockFavoriteStores);
  const [showLocationPermissionModal, setShowLocationPermissionModal] =
    useState(false);
  const [showAddFavoritesModal, setShowAddFavoritesModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedStore, setSelectedStore] = useState<FavoriteStore | null>(
    null
  );

  const handleRemoveFavorite = (id: number) => {
    const updatedStores = favoriteStores.filter((store) => store.id !== id);
    setFavoriteStores(updatedStores);
  };

  const handleToggleFavorite = (id: number, isFavorite: boolean) => {
    if (isFavorite) {
      const updatedStores = favoriteStores.filter((store) => store.id !== id);
      setFavoriteStores(updatedStores);
    } else {
      const storeToAdd = mockFavoriteStores.find((store) => store.id === id);
      if (storeToAdd) {
        setFavoriteStores([...favoriteStores, storeToAdd]);
      }
    }
    // 선택된 매장 정보 업데이트
    setSelectedStore((prevStore) =>
      prevStore ? { ...prevStore, isFavorite: !isFavorite } : null
    );
  };

  const handleOpenAddFavoritesModal = () => {
    setShowLocationPermissionModal(true);
  };

  const findAndSetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보를 가져오지 못했습니다.", error);
        }
      );
    } else {
      console.log("위치 정보를 지원하지 않는 브라우저입니다.");
    }
  };

  const handleAgreeLocation = () => {
    setShowLocationPermissionModal(false);
    findAndSetUserLocation();
    setShowAddFavoritesModal(true);
  };

  const handleDisagreeLocation = () => {
    setShowLocationPermissionModal(false);
    setMapCenter({ lat: 37.5665, lng: 126.978 });
    setShowAddFavoritesModal(true);
  };

  // 지도에서 핀을 클릭했을 때 호출될 함수 (예시)
  const handleMapPinClick = (storeId: number) => {
    const store = mockFavoriteStores.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center pt-8 pb-4 px-8 w-full">
          <h1 className="text-2xl font-bold">즐겨찾기</h1>
          <button
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-800"
            onClick={handleOpenAddFavoritesModal}
          >
            <Plus className="w-4 h-4" />
            <span>추가하기</span>
          </button>
        </div>

        <div className="flex-grow justify-center items-center py-8">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {favoriteStores.length > 0 ? (
              favoriteStores.map((store) => (
                <FavoriteStoreCard
                  key={store.id}
                  store={store}
                  onRemove={handleRemoveFavorite}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                즐겨찾기한 세탁소가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 위치 동의 확인 모달 */}
      <Dialog
        open={showLocationPermissionModal}
        onOpenChange={setShowLocationPermissionModal}
      >
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
            <Button onClick={handleDisagreeLocation} variant="outline">
              동의 안함
            </Button>
            <Button
              onClick={handleAgreeLocation}
              className="bg-[#74D4FF] hover:bg-[#5BBCE3] text-white"
            >
              동의
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 즐겨찾기 추가 지도 모달 */}
      <Dialog
        open={showAddFavoritesModal}
        onOpenChange={setShowAddFavoritesModal}
      >
        <DialogContent
          className="bg-white max-w-md w-full h-[600px] flex flex-col p-4"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-2">
            <DialogTitle>즐겨찾기 추가</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="relative flex items-center mb-2">
            <input
              type="text"
              placeholder="장소를 검색하세요."
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <button
              onClick={() => handleMapPinClick(1)} // 예시로 핀 클릭 이벤트 호출
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="현재 위치로 이동"
            >
              <Compass className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full flex-grow bg-gray-200 flex items-center justify-center text-gray-500">
            <p className="text-center">
              현재 지도 중심 좌표:
              <br />
              위도: {mapCenter.lat.toFixed(4)}, 경도: {mapCenter.lng.toFixed(4)}
              <br />
              <br />
              (실제 지도 API 연동 시 이 위치를 중심으로 지도와 마커를
              표시합니다.)
            </p>
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
                  handleToggleFavorite(id, isCurrentlyFavorite);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
