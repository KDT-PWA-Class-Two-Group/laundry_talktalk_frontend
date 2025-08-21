// @/types/mypage.ts

// 사용자 정보를 정의하는 인터페이스
export interface User {
  user_id: number;
  email: string;
  password?: string; // 비밀번호는 선택적(optional)으로 처리
  phone: string;
  access_token: string;
  refresh_token: string;
  login_id: string;
  user_admin: boolean;
}

// 예시로 사용할 모의(Mock) 사용자 데이터
// 실제로는 로그인 후 API 호출을 통해 받아와야 합니다.
export const MOCK_USER: User = {
  user_id: 1,
  email: "KDT123@gmail.com",
  password: "1234",
  phone: "010-1234-5678",
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  login_id: "KDT123",
  user_admin: false,
};

// 즐겨찾기 가게 데이터의 타입을 정의합니다.
export interface FavoriteStore {
  id: number;
  name: string;
  address: string;
  rating: number;
  phone: string;
  imageUrl?: string;
  isFavorite?: boolean;
  latitude: number; // ★ 추가됨: 위도
  longitude: number; // ★ 추가됨: 경도
}

// 지도에서 선택된 가게의 타입을 정의합니다.
// FavoriteStore를 확장하여 isFavorite 속성을 포함합니다.
export interface SelectedStoreType extends FavoriteStore {
  isFavorite: boolean;
}

// 예시 데이터입니다. 실제로는 API 호출로 받아와야 합니다.
export const mockFavoriteStores: FavoriteStore[] = [
  {
    id: 1,
    name: "크린토피아 월평점",
    address: "대전 서구 월평동 123-1", // 주소 구체화 (예시)
    rating: 4.5,
    phone: "010-1123-4455",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image+1",
    latitude: 36.3656, // 대전 월평동 근처 위도
    longitude: 127.359, // 대전 월평동 근처 경도
  },
  {
    id: 2,
    name: "크린토피아 대전점",
    address: "대전 중구 대전천동 456-2", // 주소 구체화 (예시)
    rating: 3.0,
    phone: "010-1234-5678",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image+2",
    latitude: 36.3283, // 대전 대전천동 근처 위도
    longitude: 127.4278, // 대전 대전천동 근처 경도
  },
  {
    id: 3,
    name: "크린토피아 유성점",
    address: "대전 유성구 봉명동 789-3", // 주소 구체화 (예시)
    rating: 5.0,
    phone: "010-9876-5432",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image+3", // 이미지 없는 경우 대비 이미지 추가
    latitude: 36.3533, // 대전 유성구 봉명동 근처 위도
    longitude: 127.3418, // 대전 유성구 봉명동 근처 경도
  },
  {
    id: 4,
    name: "크린토피아 둔산점",
    address: "대전 서구 둔산동 101-4", // 주소 구체화 (예시)
    rating: 4.0,
    phone: "010-5555-4444",
    imageUrl: "https://via.placeholder.com/300x200.png?text=Store+Image+4",
    latitude: 36.3504, // 대전 둔산동 근처 위도
    longitude: 127.3845, // 대전 둔산동 근처 경도
  },
];

// 이용 내역 데이터의 타입을 정의합니다.
export interface UsageItem {
  id: number;
  status: "ongoing" | "completed" | "cancelled" | "reviewed";
  date: string;
  time: string;
  storeName: string;
  reservationDate: string;
  duration: string;
  code: string;
  price: string;
}

// 예시 데이터입니다. 실제로는 API 호출로 받아와야 합니다.
export const initialMockData: UsageItem[] = [
  {
    id: 1,
    status: "ongoing",
    date: "2025.08.14 | 13시 10분",
    storeName: "크린토피아 월평점",
    reservationDate: "2025.08.14 | 14:00 ~ 18:00",
    duration:
      "총 소요시간: 3시간 30분 | 세탁 시간: 1시간 30분 | 건조 시간: 2시간",
    code: "코스: 이불 빨래, 건조",
    price: "이용 가격: 30,000원",
    time: "",
  },
  {
    id: 2,
    status: "completed",
    date: "2025.08.10 | 15시 10분",
    storeName: "크린토피아 둔산점",
    reservationDate: "2025.08.10 | 14:00 ~ 18:00",
    duration:
      "총 소요시간: 2시간 00분 | 세탁 시간: 1시간 00분 | 건조 시간: 1시간",
    code: "코스: 일반 세탁",
    price: "이용 가격: 20,000원",
    time: "",
  },
  {
    id: 3,
    status: "cancelled",
    date: "2025.08.07 | 13시 10분",
    storeName: "크린토피아 월평점",
    reservationDate: "2025.08.07 | 10:00 ~ 12:00",
    duration: "총 소요시간: 1시간 30분 | 세탁 시간: 45분 | 건조 시간: 45분",
    code: "코스: 운동복 세탁",
    price: "이용 가격: 15,000원",
    time: "",
  },
  {
    id: 4,
    status: "reviewed",
    date: "2025.08.05 | 11시 00분",
    storeName: "크린토피아 유성점",
    reservationDate: "2025.08.05 | 09:00 ~ 11:00",
    duration:
      "총 소요시간: 4시간 00분 | 세탁 시간: 2시간 00분 | 건조 시간: 2시간",
    code: "코스: 드라이클리닝",
    price: "이용 가격: 40,000원",
    time: "",
  },
];
