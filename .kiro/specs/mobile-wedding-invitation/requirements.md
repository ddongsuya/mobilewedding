# 요구사항 문서

## 소개

모바일 청첩장(모바일 웨딩 초대장)은 결혼식 정보를 디지털 형태로 공유할 수 있는 웹 애플리케이션입니다. 신랑/신부 정보, 결혼식 일정, 장소 안내, 갤러리, 축의금 계좌, 방명록, RSVP 기능을 제공하며, 카카오톡이나 링크를 통해 쉽게 공유할 수 있습니다.

## 용어집

- **Invitation_System**: 모바일 청첩장 전체 시스템
- **Couple_Info_Component**: 신랑/신부 정보를 표시하는 컴포넌트
- **Event_Info_Component**: 결혼식 날짜, 시간, 장소를 표시하는 컴포넌트
- **Gallery_Component**: 커플 사진을 표시하는 갤러리 컴포넌트
- **Map_Component**: 오시는 길 및 지도를 표시하는 컴포넌트
- **Account_Component**: 축의금 계좌 정보를 표시하는 컴포넌트
- **Guestbook_Component**: 방명록/축하 메시지 컴포넌트
- **RSVP_Component**: 참석 여부 응답 컴포넌트
- **Share_Component**: 공유 기능 컴포넌트
- **User**: 청첩장을 받아보는 하객
- **Admin**: 청첩장을 생성/관리하는 신랑/신부

## 요구사항

### 요구사항 1: 신랑/신부 정보 표시

**사용자 스토리:** 하객으로서, 신랑과 신부의 정보를 확인하고 싶습니다. 그래야 누구의 결혼식인지 명확히 알 수 있습니다.

#### 인수 조건

1. WHEN 청첩장 페이지가 로드되면 THEN Couple_Info_Component SHALL 신랑과 신부의 이름을 표시한다
2. WHEN 청첩장 페이지가 로드되면 THEN Couple_Info_Component SHALL 신랑과 신부의 부모님 성함을 표시한다
3. WHEN 청첩장 페이지가 로드되면 THEN Couple_Info_Component SHALL 인사말 문구를 표시한다
4. WHERE 연락처 정보가 제공된 경우 THEN Couple_Info_Component SHALL 신랑/신부 및 양가 부모님 연락처를 표시한다

### 요구사항 2: 결혼식 일정 정보

**사용자 스토리:** 하객으로서, 결혼식 날짜, 시간, 장소를 정확히 알고 싶습니다. 그래야 일정을 조율하고 참석할 수 있습니다.

#### 인수 조건

1. WHEN 청첩장 페이지가 로드되면 THEN Event_Info_Component SHALL 결혼식 날짜를 표시한다
2. WHEN 청첩장 페이지가 로드되면 THEN Event_Info_Component SHALL 결혼식 시간을 표시한다
3. WHEN 청첩장 페이지가 로드되면 THEN Event_Info_Component SHALL 예식장 이름과 홀 정보를 표시한다
4. WHEN 청첩장 페이지가 로드되면 THEN Event_Info_Component SHALL D-Day 카운트다운을 표시한다
5. WHEN 사용자가 캘린더 추가 버튼을 클릭하면 THEN Event_Info_Component SHALL 캘린더 앱에 일정을 추가할 수 있는 기능을 제공한다

### 요구사항 3: 갤러리 기능

**사용자 스토리:** 하객으로서, 신랑과 신부의 사진을 보고 싶습니다. 그래야 두 사람의 모습을 미리 볼 수 있습니다.

#### 인수 조건

1. WHEN 갤러리 섹션이 로드되면 THEN Gallery_Component SHALL 등록된 커플 사진들을 그리드 형태로 표시한다
2. WHEN 사용자가 사진을 클릭하면 THEN Gallery_Component SHALL 해당 사진을 확대하여 모달로 표시한다
3. WHEN 모달이 열린 상태에서 좌우 스와이프하면 THEN Gallery_Component SHALL 이전/다음 사진으로 이동한다
4. WHEN 모달 외부를 클릭하거나 닫기 버튼을 클릭하면 THEN Gallery_Component SHALL 모달을 닫는다

### 요구사항 4: 오시는 길 (지도)

**사용자 스토리:** 하객으로서, 예식장 위치와 오시는 길을 알고 싶습니다. 그래야 예식장을 쉽게 찾아갈 수 있습니다.

#### 인수 조건

1. WHEN 오시는 길 섹션이 로드되면 THEN Map_Component SHALL 예식장 주소를 텍스트로 표시한다
2. WHEN 오시는 길 섹션이 로드되면 THEN Map_Component SHALL 지도에 예식장 위치를 마커로 표시한다
3. WHEN 사용자가 네이버 지도 버튼을 클릭하면 THEN Map_Component SHALL 네이버 지도 앱 또는 웹으로 연결한다
4. WHEN 사용자가 카카오맵 버튼을 클릭하면 THEN Map_Component SHALL 카카오맵 앱 또는 웹으로 연결한다
5. WHEN 사용자가 주소 복사 버튼을 클릭하면 THEN Map_Component SHALL 주소를 클립보드에 복사한다
6. WHERE 교통 안내 정보가 제공된 경우 THEN Map_Component SHALL 대중교통, 자가용 안내 정보를 표시한다

### 요구사항 5: 축의금 계좌 정보

**사용자 스토리:** 하객으로서, 축의금을 보낼 계좌 정보를 알고 싶습니다. 그래야 참석하지 못하더라도 마음을 전할 수 있습니다.

#### 인수 조건

1. WHEN 계좌 정보 섹션이 로드되면 THEN Account_Component SHALL 신랑측과 신부측 계좌 정보를 구분하여 표시한다
2. WHEN 사용자가 계좌번호 복사 버튼을 클릭하면 THEN Account_Component SHALL 해당 계좌번호를 클립보드에 복사한다
3. WHEN 계좌번호가 복사되면 THEN Account_Component SHALL 복사 완료 피드백을 사용자에게 표시한다
4. WHERE 카카오페이 송금 링크가 제공된 경우 THEN Account_Component SHALL 카카오페이 송금 버튼을 표시한다

### 요구사항 6: 방명록/축하 메시지

**사용자 스토리:** 하객으로서, 신랑과 신부에게 축하 메시지를 남기고 싶습니다. 그래야 축하하는 마음을 전할 수 있습니다.

#### 인수 조건

1. WHEN 방명록 섹션이 로드되면 THEN Guestbook_Component SHALL 기존에 작성된 축하 메시지 목록을 표시한다
2. WHEN 사용자가 이름, 비밀번호, 메시지를 입력하고 등록 버튼을 클릭하면 THEN Guestbook_Component SHALL 새 축하 메시지를 저장하고 목록에 추가한다
3. WHEN 사용자가 빈 필드로 등록을 시도하면 THEN Guestbook_Component SHALL 필수 입력 항목 안내 메시지를 표시한다
4. WHEN 사용자가 자신의 메시지 삭제를 요청하고 올바른 비밀번호를 입력하면 THEN Guestbook_Component SHALL 해당 메시지를 삭제한다
5. IF 잘못된 비밀번호가 입력되면 THEN Guestbook_Component SHALL 비밀번호 오류 메시지를 표시한다

### 요구사항 7: 참석 여부 RSVP

**사용자 스토리:** 하객으로서, 참석 여부를 미리 알리고 싶습니다. 그래야 신랑/신부가 하객 수를 파악할 수 있습니다.

#### 인수 조건

1. WHEN RSVP 섹션이 로드되면 THEN RSVP_Component SHALL 참석 여부 선택 폼을 표시한다
2. WHEN 사용자가 이름, 연락처, 참석 여부, 참석 인원을 입력하고 제출하면 THEN RSVP_Component SHALL 응답을 저장한다
3. WHEN RSVP가 성공적으로 제출되면 THEN RSVP_Component SHALL 제출 완료 확인 메시지를 표시한다
4. WHEN 사용자가 필수 항목을 누락하고 제출하면 THEN RSVP_Component SHALL 필수 입력 항목 안내를 표시한다
5. WHERE 식사 여부 옵션이 활성화된 경우 THEN RSVP_Component SHALL 식사 참석 여부 선택을 표시한다

### 요구사항 8: 공유 기능

**사용자 스토리:** 신랑/신부로서, 청첩장을 쉽게 공유하고 싶습니다. 그래야 많은 하객에게 청첩장을 전달할 수 있습니다.

#### 인수 조건

1. WHEN 사용자가 카카오톡 공유 버튼을 클릭하면 THEN Share_Component SHALL 카카오톡 공유 기능을 실행한다
2. WHEN 사용자가 링크 복사 버튼을 클릭하면 THEN Share_Component SHALL 청첩장 URL을 클립보드에 복사한다
3. WHEN 링크가 복사되면 THEN Share_Component SHALL 복사 완료 피드백을 표시한다
4. WHERE Web Share API가 지원되는 환경에서 THEN Share_Component SHALL 네이티브 공유 기능을 제공한다

### 요구사항 9: 반응형 디자인 및 접근성

**사용자 스토리:** 하객으로서, 어떤 기기에서든 청첩장을 편하게 볼 수 있기를 원합니다. 그래야 모바일, 태블릿, PC 어디서든 접근할 수 있습니다.

#### 인수 조건

1. THE Invitation_System SHALL 모바일 우선 반응형 디자인을 적용한다
2. THE Invitation_System SHALL 다양한 화면 크기에서 적절한 레이아웃을 제공한다
3. THE Invitation_System SHALL 웹 접근성 표준(WCAG 2.1 AA)을 준수한다
4. THE Invitation_System SHALL 적절한 색상 대비와 폰트 크기를 제공한다

### 요구사항 10: 데이터 관리

**사용자 스토리:** 신랑/신부로서, 청첩장 데이터를 안전하게 관리하고 싶습니다. 그래야 방명록과 RSVP 응답을 확인할 수 있습니다.

#### 인수 조건

1. THE Invitation_System SHALL 방명록 메시지를 영구 저장소에 저장한다
2. THE Invitation_System SHALL RSVP 응답을 영구 저장소에 저장한다
3. WHEN 데이터 저장에 실패하면 THEN Invitation_System SHALL 사용자에게 오류 메시지를 표시한다
4. THE Invitation_System SHALL 비밀번호를 해시하여 저장한다
