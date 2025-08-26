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
    LIST: `${API_BASE_URL}/api/stores`,
    SEARCH_KEYWORD: `${API_BASE_URL}/api/stores/search/keyword`,
    SEARCH_NEARBY: `${API_BASE_URL}/api/stores/search/nearby`,
    STORE_DETAIL: (storeId: string) => `${API_BASE_URL}/api/stores/${storeId}`,
    MACHINE_OPTIONS: (storeId: string, machineId: string) => `${API_BASE_URL}/api/stores/${storeId}/machines/${machineId}/options`,
  },
  MACHINE: {
    OPTIONS: `${API_BASE_URL}/api/machine/options`,
    ESTIMATE: `${API_BASE_URL}/api/machine/estimate`,
  },
  POSTS: {
    POSTS_STORE: (storeId: string) => `${API_BASE_URL}/api/posts/store/${storeId}`,
    POSTS_CREATE: `${API_BASE_URL}/api/posts`,
    POST_PUT_DELETE: (postId: string) => `${API_BASE_URL}/api/posts/${postId}`,
  },
  RESERVATION: {
    RESERVATIONS: `${API_BASE_URL}/api/reservations`,
    RESERVATION_CANCEL: (reservationId: string) => `${API_BASE_URL}/api/reservations/${reservationId}`,
  },
  REVIEWS: {
    REVIEWS: `${API_BASE_URL}/api/reviews`,
    REVIEWS_LIST: (storeId: string) => `${API_BASE_URL}/api/reviews/list/${storeId}`,
    REVIEWS_COMMENT: (reviewId: string) => `${API_BASE_URL}/api/reviews/${reviewId}/comment`,
    REVIEWS_DELETE: (reviewId: string) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  },
};