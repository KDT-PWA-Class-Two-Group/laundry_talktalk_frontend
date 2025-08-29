// 숫자를 한국어 표기법으로 포맷하는 함수
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("ko-KR").format(value);
};
