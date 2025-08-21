// src/app/mypage/favorites/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// `@/types/mypage.ts`에서 인터페이스와 mock 데이터를 불러옵니다.
import {
  FavoriteStore,
  SelectedStoreType,
  mockFavoriteStores, // mockFavoriteStores도 여기서 불러옵니다.
} from "@/types/mypage";

// `src/features/favorites/FavoritesComponents.tsx`에서 모든 컴포넌트를 불러옵니다.
// 원본 경로 그대로 유지
import {
  FavoriteStoreCard,
  LocationPermissionModal,
  AddFavoritesMapModal,
} from "./favorite_modal";

//================================================================================
// 메인 페이지 컴포넌트
//================================================================================
export default function FavoritesPage() {
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
  const [availableStores, setAvailableStores] = useState<FavoriteStore[]>([]);
  const [showLocationPermissionModal, setShowLocationPermissionModal] =
    useState(false);
  const [showAddFavoritesModal, setShowAddFavoritesModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedStore, setSelectedStore] = useState<SelectedStoreType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 1. 페이지 로드 시 즐겨찾기 목록과 전체 매장 목록을 가져오는 로직
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // 즐겨찾기 목록 가져오기
        const favsResponse = await fetch("/api/mypage/favorite");
        if (!favsResponse.ok)
          throw new Error("즐겨찾기 목록을 가져오지 못했습니다.");
        const favsData: FavoriteStore[] = await favsResponse.json();
        setFavoriteStores(favsData);

        // 전체 매장 목록 가져오기 (지도 모달용)
        const allStoresResponse = await fetch("/api/mypage/find_store");
        if (!allStoresResponse.ok)
          throw new Error("매장 목록을 가져오지 못했습니다.");
        const allStoresData: FavoriteStore[] = await allStoresResponse.json();
        setAvailableStores(allStoresData);
      } catch (error) {
        console.error("데이터 fetch 실패:", error);
        setIsError(true);
        // API가 연결되지 않았을 경우를 대비하여 목 데이터로 대체
        setFavoriteStores(
          mockFavoriteStores.filter((store) => [1, 3].includes(store.id))
        );
        setAvailableStores(mockFavoriteStores);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // 2. 즐겨찾기 제거 핸들러 (API 요청 포함)
  const handleRemoveFavorite = async (id: number) => {
    try {
      const response = await fetch(`/api/mypage/favorite/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("즐겨찾기 제거에 실패했습니다.");

      // 성공 시, 로컬 상태 업데이트
      const updatedStores = favoriteStores.filter((store) => store.id !== id);
      setFavoriteStores(updatedStores);
    } catch (error) {
      console.error("즐겨찾기 제거 API 실패:", error);
      alert("즐겨찾기 제거에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 3. 즐겨찾기 추가/제거 핸들러 (API 요청 포함)
  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        // 즐겨찾기 제거 요청
        const response = await fetch(`/api/mypage/favorite/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("즐겨찾기 제거에 실패했습니다.");
        setFavoriteStores(favoriteStores.filter((store) => store.id !== id));
      } else {
        // 즐겨찾기 추가 요청
        const storeToAdd = availableStores.find((store) => store.id === id);
        if (!storeToAdd) return;

        const response = await fetch("/api/mypage/favorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeToAdd),
        });
        if (!response.ok) throw new Error("즐겨찾기 추가에 실패했습니다.");

        // 성공 시, 로컬 상태 업데이트
        setFavoriteStores([...favoriteStores, storeToAdd]);
      }

      // 선택된 매장의 즐겨찾기 상태 업데이트
      setSelectedStore((prevStore) => {
        if (prevStore && prevStore.id === id) {
          return { ...prevStore, isFavorite: !isFavorite };
        }
        return prevStore;
      });
    } catch (error) {
      console.error("즐겨찾기 토글 API 실패:", error);
      alert("요청에 실패했습니다. 다시 시도해 주세요.");
    }
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

  const handleMapPinClick = (storeId: number) => {
    // 이제 availableStores에서 매장을 찾습니다.
    const store = availableStores.find((s) => s.id === storeId);
    if (store) {
      const isFav = favoriteStores.some((favStore) => favStore.id === store.id);
      setSelectedStore({ ...store, isFavorite: isFav });
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center pt-8 pb-4 px-8 w-full">
          <h1 className="text-2xl font-bold">즐겨찾기</h1>
          <Button
            onClick={handleOpenAddFavoritesModal}
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-800"
            variant="ghost"
          >
            <Plus className="w-4 h-4" />
            <span>추가하기</span>
          </Button>
        </div>

        <div className="flex-grow justify-center items-center py-8">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {isLoading ? (
              <p className="text-center w-full text-gray-500">
                즐겨찾기 목록을 불러오는 중...
              </p>
            ) : isError ? (
              <p className="text-center w-full text-red-500">
                데이터를 불러오는 데 실패했습니다.
              </p>
            ) : favoriteStores.length > 0 ? (
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

      <LocationPermissionModal
        open={showLocationPermissionModal}
        onOpenChange={setShowLocationPermissionModal}
        onAgree={handleAgreeLocation}
        onDisagree={handleDisagreeLocation}
      />

      <AddFavoritesMapModal
        open={showAddFavoritesModal}
        onOpenChange={setShowAddFavoritesModal}
        mapCenter={mapCenter}
        selectedStore={selectedStore}
        favoriteStores={favoriteStores}
        availableStores={availableStores}
        onToggleFavorite={handleToggleFavorite}
        onMapPinClick={handleMapPinClick}
      />
    </>
  );
}
