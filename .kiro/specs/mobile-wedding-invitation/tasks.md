# 구현 계획: 모바일 청첩장

## 개요

React + TypeScript 기반의 모바일 청첩장 SPA를 구현합니다. Firebase Firestore를 백엔드로 사용하고, 카카오/네이버 지도 API 및 카카오톡 공유 SDK를 연동합니다.

## 태스크

- [x] 1. 프로젝트 초기 설정
  - [x] 1.1 Vite + React + TypeScript 프로젝트 생성
    - 프로젝트 스캐폴딩 및 기본 설정
    - Tailwind CSS 설정
    - _Requirements: 9.1, 9.2_
  - [x] 1.2 Firebase 설정 및 연동
    - Firebase 프로젝트 설정 파일 생성
    - Firestore 초기화 코드 작성
    - _Requirements: 10.1, 10.2_
  - [x] 1.3 TypeScript 인터페이스 정의
    - WeddingConfig, GuestbookMessage, RsvpResponse 등 모든 타입 정의
    - _Requirements: 1.1-10.4_

- [x] 2. 핵심 유틸리티 함수 구현
  - [x] 2.1 D-Day 계산 함수 구현
    - calculateDDay 함수 작성
    - _Requirements: 2.4_
  - [ ]* 2.2 D-Day 계산 속성 테스트 작성
    - **Property 1: D-Day 계산 정확성**
    - **Validates: Requirements 2.4**
  - [x] 2.3 캘린더 URL 생성 함수 구현
    - generateCalendarUrl 함수 작성
    - _Requirements: 2.5_
  - [ ]* 2.4 캘린더 URL 생성 속성 테스트 작성
    - **Property 2: 캘린더 URL 생성**
    - **Validates: Requirements 2.5**
  - [x] 2.5 클립보드 복사 함수 구현
    - copyToClipboard 함수 작성
    - _Requirements: 4.5, 5.2, 8.2_
  - [ ]* 2.6 클립보드 복사 속성 테스트 작성
    - **Property 5: 클립보드 복사 라운드 트립**
    - **Validates: Requirements 4.5, 5.2, 8.2**
  - [x] 2.7 비밀번호 해싱 함수 구현
    - hashPassword, verifyPassword 함수 작성
    - _Requirements: 6.4, 6.5, 10.4_
  - [ ]* 2.8 비밀번호 해싱 속성 테스트 작성
    - **Property 8: 비밀번호 해싱 및 검증**
    - **Validates: Requirements 6.4, 6.5, 10.4**

- [x] 3. 체크포인트 - 유틸리티 함수 테스트 확인
  - 모든 테스트가 통과하는지 확인, 문제가 있으면 사용자에게 질문

- [x] 4. 유효성 검사 함수 구현
  - [x] 4.1 방명록 유효성 검사 함수 구현
    - validateGuestbookInput 함수 작성
    - _Requirements: 6.3_
  - [ ]* 4.2 방명록 유효성 검사 속성 테스트 작성
    - **Property 6: 방명록 유효성 검사**
    - **Validates: Requirements 6.3**
  - [x] 4.3 RSVP 유효성 검사 함수 구현
    - validateRsvpInput 함수 작성
    - _Requirements: 7.4_
  - [ ]* 4.4 RSVP 유효성 검사 속성 테스트 작성
    - **Property 9: RSVP 유효성 검사**
    - **Validates: Requirements 7.4**

- [x] 5. 지도 연동 함수 구현
  - [x] 5.1 네이버/카카오 지도 URL 생성 함수 구현
    - openNaverMap, openKakaoMap 함수 작성
    - _Requirements: 4.3, 4.4_
  - [ ]* 5.2 지도 URL 생성 속성 테스트 작성
    - **Property 4: 지도 앱 URL 생성**
    - **Validates: Requirements 4.3, 4.4**

- [x] 6. Firebase 서비스 레이어 구현
  - [x] 6.1 방명록 CRUD 서비스 구현
    - getMessages, addMessage, deleteMessage 함수 작성
    - _Requirements: 6.1, 6.2, 6.4, 10.1_
  - [x] 6.2 RSVP 서비스 구현
    - submitRsvp 함수 작성
    - _Requirements: 7.2, 10.2_
  - [ ]* 6.3 데이터 저장 라운드 트립 속성 테스트 작성
    - **Property 10: 데이터 저장 라운드 트립**
    - **Validates: Requirements 10.1, 10.2**

- [x] 7. 체크포인트 - 서비스 레이어 테스트 확인
  - 모든 테스트가 통과하는지 확인, 문제가 있으면 사용자에게 질문

- [x] 8. UI 컴포넌트 구현 - 정보 표시
  - [x] 8.1 CoupleInfo 컴포넌트 구현
    - 신랑/신부 정보, 부모님 성함, 인사말, 연락처 표시
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 8.2 EventInfo 컴포넌트 구현
    - 날짜, 시간, 장소, D-Day 카운트다운, 캘린더 추가 버튼
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 8.3 Account 컴포넌트 구현
    - 신랑측/신부측 계좌 정보, 복사 버튼, 카카오페이 버튼
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 9. UI 컴포넌트 구현 - 갤러리
  - [x] 9.1 Gallery 컴포넌트 구현
    - 이미지 그리드, 모달, 스와이프 네비게이션
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 9.2 갤러리 네비게이션 속성 테스트 작성
    - **Property 3: 갤러리 네비게이션 인덱스**
    - **Validates: Requirements 3.2, 3.3**

- [ ] 10. UI 컴포넌트 구현 - 지도
  - [x] 10.1 Map 컴포넌트 구현
    - 주소 표시, 지도 마커, 네이버/카카오맵 버튼, 주소 복사, 교통 안내
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 11. UI 컴포넌트 구현 - 방명록
  - [x] 11.1 Guestbook 컴포넌트 구현
    - 메시지 목록, 작성 폼, 삭제 기능
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 11.2 방명록 메시지 추가 속성 테스트 작성
    - **Property 7: 방명록 메시지 추가**
    - **Validates: Requirements 6.2**

- [x] 12. UI 컴포넌트 구현 - RSVP
  - [x] 12.1 RSVP 컴포넌트 구현
    - 참석 여부 폼, 인원 선택, 식사 옵션, 제출 기능
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 13. UI 컴포넌트 구현 - 공유
  - [x] 13.1 Share 컴포넌트 구현
    - 카카오톡 공유, 링크 복사, Web Share API
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 13.2 카카오 SDK 초기화 및 공유 함수 구현
    - shareToKakao 함수 작성
    - _Requirements: 8.1_

- [x] 14. 체크포인트 - UI 컴포넌트 테스트 확인
  - 모든 테스트가 통과하는지 확인, 문제가 있으면 사용자에게 질문

- [x] 15. 앱 통합 및 스타일링
  - [x] 15.1 App 컴포넌트에서 모든 섹션 통합
    - 컴포넌트 조합 및 데이터 흐름 연결
    - _Requirements: 1.1-10.4_
  - [x] 15.2 반응형 스타일 적용
    - 모바일 우선 반응형 디자인
    - _Requirements: 9.1, 9.2_
  - [x] 15.3 접근성 개선
    - ARIA 속성, 키보드 네비게이션, 색상 대비
    - _Requirements: 9.3, 9.4_
  - [ ]* 15.4 조건부 렌더링 속성 테스트 작성
    - **Property 11: 조건부 렌더링 일관성**
    - **Validates: Requirements 1.4, 4.6, 5.4, 7.5**

- [x] 16. 샘플 데이터 및 설정 파일
  - [x] 16.1 샘플 청첩장 설정 파일 생성
    - 예시 WeddingConfig JSON 파일 작성
    - _Requirements: 1.1-8.4_

- [x] 17. 최종 체크포인트
  - 모든 테스트가 통과하는지 확인, 문제가 있으면 사용자에게 질문

## 참고사항

- `*` 표시된 태스크는 선택적이며 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 특정 요구사항을 참조하여 추적 가능합니다
- 체크포인트에서 점진적 검증을 수행합니다
- 속성 테스트는 설계 문서의 정확성 속성을 검증합니다
