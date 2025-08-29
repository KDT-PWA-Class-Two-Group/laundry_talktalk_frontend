// 고유 ID 생성 함수
export const generateId = (prefix: string = "id"): string => {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};
