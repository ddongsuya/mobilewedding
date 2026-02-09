# 청첩장 설정 파일 가이드 (Wedding Config Guide)

이 문서는 `sample-config.json` 파일의 구조와 각 필드에 대한 설명을 제공합니다.

## 파일 구조 개요

```
WeddingConfig
├── couple          # 신랑/신부 정보
├── event           # 결혼식 일정 정보
├── gallery         # 갤러리 설정
├── location        # 예식장 위치 정보
├── accounts        # 축의금 계좌 정보
├── guestbook       # 방명록 설정
├── rsvp            # 참석 여부 설정
├── share           # 공유 기능 설정
└── theme           # 테마 설정
```

---

## 상세 필드 설명

### 1. couple (신랑/신부 정보)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `groom` | PersonInfo | ✅ | 신랑 정보 |
| `bride` | PersonInfo | ✅ | 신부 정보 |
| `greeting` | string | ✅ | 인사말 문구 (줄바꿈: `\n` 사용) |

#### PersonInfo (개인 정보)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | ✅ | 이름 |
| `englishName` | string | ❌ | 영문 이름 |
| `father` | ParentInfo | ✅ | 아버지 정보 |
| `mother` | ParentInfo | ✅ | 어머니 정보 |
| `phone` | string | ❌ | 연락처 (예: "010-1234-5678") |

#### ParentInfo (부모님 정보)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | ✅ | 이름 |
| `phone` | string | ❌ | 연락처 |
| `relation` | string | ✅ | 관계 ("장남", "차남", "삼남", "장녀", "차녀", "삼녀" 또는 기타) |

---

### 2. event (결혼식 일정)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `date` | string | ✅ | 결혼식 날짜 (ISO 8601: "YYYY-MM-DD") |
| `time` | string | ✅ | 결혼식 시간 ("HH:mm" 형식) |
| `venueName` | string | ✅ | 예식장 이름 |
| `hallName` | string | ❌ | 홀 이름 |
| `calendarEnabled` | boolean | ✅ | 캘린더 추가 버튼 표시 여부 |

**예시:**
```json
{
  "date": "2025-03-15",
  "time": "14:00",
  "venueName": "더채플앳청담",
  "hallName": "그랜드볼룸 3층",
  "calendarEnabled": true
}
```

---

### 3. gallery (갤러리)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `images` | GalleryImage[] | ✅ | 이미지 목록 |
| `layout` | "grid" \| "slider" | ✅ | 레이아웃 타입 |

#### GalleryImage (갤러리 이미지)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | ✅ | 고유 식별자 |
| `url` | string | ✅ | 이미지 URL |
| `alt` | string | ✅ | 대체 텍스트 (접근성) |
| `order` | number | ✅ | 표시 순서 |

---

### 4. location (위치 정보)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `address` | string | ✅ | 주소 |
| `detailAddress` | string | ❌ | 상세 주소 |
| `coordinates` | object | ✅ | 좌표 정보 |
| `coordinates.lat` | number | ✅ | 위도 |
| `coordinates.lng` | number | ✅ | 경도 |
| `transportation` | object | ❌ | 교통 안내 정보 |
| `transportation.subway` | string | ❌ | 지하철 안내 |
| `transportation.bus` | string | ❌ | 버스 안내 |
| `transportation.car` | string | ❌ | 자가용 안내 |
| `transportation.parking` | string | ❌ | 주차 안내 |

**좌표 찾기 팁:**
- [네이버 지도](https://map.naver.com)에서 장소 검색 후 URL에서 좌표 확인
- [카카오맵](https://map.kakao.com)에서 장소 검색 후 좌표 확인

---

### 5. accounts (축의금 계좌)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `groom` | BankAccount[] | ✅ | 신랑측 계좌 목록 |
| `bride` | BankAccount[] | ✅ | 신부측 계좌 목록 |

#### BankAccount (은행 계좌)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `bank` | string | ✅ | 은행명 |
| `accountNumber` | string | ✅ | 계좌번호 |
| `holder` | string | ✅ | 예금주 |
| `kakaoPayLink` | string | ❌ | 카카오페이 송금 링크 |

---

### 6. guestbook (방명록)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `enabled` | boolean | ✅ | 방명록 기능 활성화 여부 |
| `maxLength` | number | ✅ | 메시지 최대 길이 (글자 수) |

---

### 7. rsvp (참석 여부)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `enabled` | boolean | ✅ | RSVP 기능 활성화 여부 |
| `mealOption` | boolean | ✅ | 식사 옵션 표시 여부 |
| `deadline` | string | ❌ | RSVP 마감일 (ISO 8601: "YYYY-MM-DD") |

---

### 8. share (공유 설정)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `kakaoEnabled` | boolean | ✅ | 카카오톡 공유 활성화 여부 |
| `kakaoAppKey` | string | ❌ | 카카오 JavaScript 앱 키 |
| `ogImage` | string | ❌ | Open Graph 이미지 URL (권장: 1200x630px) |
| `ogTitle` | string | ❌ | Open Graph 제목 |
| `ogDescription` | string | ❌ | Open Graph 설명 |

**카카오 앱 키 발급:**
1. [Kakao Developers](https://developers.kakao.com)에서 애플리케이션 생성
2. 앱 키 > JavaScript 키 복사
3. 플랫폼 > Web에 도메인 등록

---

### 9. theme (테마)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `primaryColor` | string | ✅ | 주요 색상 (hex 코드, 예: "#e11d48") |
| `fontFamily` | string | ✅ | 폰트 패밀리 |
| `backgroundImage` | string | ❌ | 배경 이미지 URL |

**추천 색상:**
- 로즈: `#e11d48`
- 핑크: `#ec4899`
- 골드: `#d97706`
- 네이비: `#1e40af`
- 그린: `#059669`

---

## 사용 방법

### 1. 설정 파일 수정

`sample-config.json` 파일을 복사하여 실제 정보로 수정합니다.

### 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 설정합니다:

```env
VITE_KAKAO_APP_KEY=your_kakao_app_key
VITE_WEDDING_ID=your_wedding_id
```

### 3. 이미지 준비

- 갤러리 이미지: 정사각형 비율 권장 (400x400px 이상)
- OG 이미지: 1200x630px 권장

---

## 주의사항

1. **날짜 형식**: ISO 8601 형식 사용 ("YYYY-MM-DD")
2. **시간 형식**: 24시간 형식 사용 ("HH:mm")
3. **전화번호**: 하이픈 포함 형식 권장 ("010-1234-5678")
4. **좌표**: 소수점 4자리 이상 권장
5. **이미지 URL**: HTTPS 사용 권장
6. **줄바꿈**: JSON에서는 `\n` 사용

---

## 관련 요구사항

이 설정 파일은 다음 요구사항을 지원합니다:

- **Requirements 1.1-1.4**: 신랑/신부 정보 표시
- **Requirements 2.1-2.5**: 결혼식 일정 정보
- **Requirements 3.1-3.4**: 갤러리 기능
- **Requirements 4.1-4.6**: 오시는 길 (지도)
- **Requirements 5.1-5.4**: 축의금 계좌 정보
- **Requirements 6.1-6.5**: 방명록/축하 메시지
- **Requirements 7.1-7.5**: 참석 여부 RSVP
- **Requirements 8.1-8.4**: 공유 기능
