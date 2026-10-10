import '@tanstack/react-start/server-only';
import { serverAxios } from "@/lib/api/axios-server.server";

export const VERSION = "v1";

/**
 * @param limit - default 20, max 50
 * @param page - default 1
 */
export const GET_VIDEOS = {
  live: "videos/live", // 현재 진행 중인 라이브 영상 목록
  upcoming: "videos/upcoming", // 예정된 라이브 영상 목록
  all: "videos/all", // 전체 영상 목록
};

export const GET_CHANNELS = {
  index: "channels", // 전체 채널
  meta: "channels/meta", // 채널 메타 정보
  paginated: "channels/paginated", // 채널 목록 (페이징)
  count: "channels/count", // 채널 개수
  waiting: "channels/waiting", // 채널 대기 목록
  search: "channels/search", // 채널 검색 sort=createdAt&direction=asc
};

export const POST_CHANNELS = {
  checkDuplicates: "channels/check-duplicates",
  requests: "channels/requests",
};

export const CHANNEL_ORDER_MAP = {
  createdAt: "desc", // 최신순
  name_kor: "asc", // 이름순
} as const;

export const GET_FEATURED = {
  index: "featured", // 추천/주요 콘텐츠 조회
};

/**
 * 서명은 매 요청마다 실시간으로 생성해야 합니다.
 * 서버 시각과 타임스탬프의 차이가 300초(5분) 이상 벌어지면 `401 Unauthorized`가 반환됩니다.
 */
export const endpointApi = serverAxios;
