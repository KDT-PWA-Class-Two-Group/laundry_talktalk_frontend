export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    CHECK_ID: (userId: string) => `${API_BASE_URL}/api/auth/check-id/${userId}`,
    FIND_ID: `${API_BASE_URL}/api/auth/find-id`,
    PASSWORD_RESET_REQUEST: `${API_BASE_URL}/api/auth/password/reset-request`,
    PASSWORD_RESET: `${API_BASE_URL}/api/auth/password/reset`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
    WITHDRAWAL: `${API_BASE_URL}/api/auth/withdrawal`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/me/profile`,
    VERIFY_PASSWORD: `${API_BASE_URL}/api/users/me/verify-password`,
    FAVORITES_STORES: `${API_BASE_URL}/api/users/me/favorites/stores`,
    FAVORITES_STORE_ADD: `${API_BASE_URL}/api/users/me/favorites/stores`,
    FAVORITES_STORE_DELETE: (storeId: string) => `${API_BASE_URL}/api/users/me/favorites/stores/${storeId}`,
  },
  STORES: {
    SEARCH_KEYWORD: `${API_BASE_URL}/api/stores/search/keyword`,
    SEARCH_NEARBY: `${API_BASE_URL}/api/stores/search/nearby`,
    STORE_DETAIL: (storeId: string) => `${API_BASE_URL}/api/stores/${storeId}`,
    MACHINE_OPTIONS: (storeId: string, machineId: string) => `${API_BASE_URL}/api/stores/${storeId}/machines/${machineId}/options`,
  },
  RESERVATION: {
    RESERVATIONS: `${API_BASE_URL}/api/reservations`,
    RESERVATION_DETAIL: (reservationId: string) => `${API_BASE_URL}/api/reservations/${reservationId}`,
  },
  REVIEWS: {
    REVIEWS: `${API_BASE_URL}/api/stores/reviews`,
    REVIEWS_STORE: (storeId: string) => `${API_BASE_URL}/api/stores/reviews/${storeId}`,
    REVIEW_COMMENT: (reviewId: string) => `${API_BASE_URL}/api/stores/reviews/${reviewId}/comment`,
    REVIEW_DELETE: (reviewId: string) => `${API_BASE_URL}/api/stores/reviews/${reviewId}`,
  },
  NOTICES: {
    POSTS_STORE: (storeId: string) => `${API_BASE_URL}/api/stores/posts/${storeId}`,
    POSTS: `${API_BASE_URL}/api/stores/posts`,
    POST_DETAIL: (postId: string) => `${API_BASE_URL}/api/stores/posts/${postId}`,
  },
  SERVICE: {
    ESTIMATE: `${API_BASE_URL}/api/laundry/estimate`,
  },
};