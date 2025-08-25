# NEXT (cross-fresh)

## 목표(하루 90분): Swipe → Result 한 사이클 통과
- [ ] SwipeScore에서 오른쪽 스와이프 → addResult 호출 확인
- [ ] Result/MatchResult에 점수/좋아요 표시 반영
- [ ] ko/ja i18n 키 빠진 것 보충 (경고만 사라지면 OK)

## 실행 루틴
1) npx expo start -c
2) AIDemo 화면 열어 i18n/버튼 반응 체크 (연결 확인)
3) SwipeScore → 우측 스와이프 1~2장
4) Result/MatchResult 화면에서 데이터 렌더 확인

## 메모
- 경고만 있고 빌드 되면 **진행 우선**, 경고는 마지막에 한 번에 처리
