// 기능 플래그: 새 언어/모듈을 제한적으로 공개
export const flags = {
  betaLangEn: true, // 베타 공개 중이면 true
  betaLangJa: true, // 정식 전까지 true로 두고 UI에서 베타 표시/제한
  // 광고 모듈/커뮤니티 등도 필요시 추가
  // adsModuleEnabled: false,
  // communityEnabled: true,
} as const;
