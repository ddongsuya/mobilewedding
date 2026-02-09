/**
 * CoupleInfo 컴포넌트
 * 
 * 신랑/신부 정보, 부모님 성함, 인사말, 연락처를 표시하는 컴포넌트
 * 
 * Requirements:
 * - 1.1: 신랑과 신부의 이름을 표시
 * - 1.2: 신랑과 신부의 부모님 성함을 표시
 * - 1.3: 인사말 문구를 표시
 * - 1.4: 연락처 정보가 제공된 경우 연락처를 표시
 */

import { CoupleInfoProps, PersonInfo, ParentInfo } from '../types';

/**
 * 전화 아이콘 컴포넌트
 */
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

/**
 * 연락처 버튼 컴포넌트
 */
interface ContactButtonProps {
  phone: string;
  name: string;
  label?: string;
}

const ContactButton = ({ phone, name, label }: ContactButtonProps) => (
  <a
    href={`tel:${phone}`}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors tap-target"
    aria-label={`${label || name}에게 전화하기`}
  >
    <PhoneIcon />
    <span>{label || name}</span>
  </a>
);

/**
 * 부모님 정보 표시 컴포넌트
 */
interface ParentDisplayProps {
  father: ParentInfo;
  mother: ParentInfo;
  personName: string;
  side: 'groom' | 'bride';
}

const ParentDisplay = ({ father, mother, personName, side }: ParentDisplayProps) => {
  const sideLabel = side === 'groom' ? '신랑' : '신부';
  
  return (
    <div className="text-center">
      <p className="text-gray-600 text-sm sm:text-base tracking-wide">
        <span className="text-gray-500">{father.name}</span>
        <span className="text-gold-400 mx-1.5">·</span>
        <span className="text-gray-500">{mother.name}</span>
        <span className="text-gray-400 mx-2">의</span>
        <span className="text-gray-600 font-medium">{father.relation}</span>
      </p>
      <p className="mt-2 font-serif text-2xl sm:text-3xl font-light text-gray-800 tracking-wider" aria-label={`${sideLabel} ${personName}`}>
        {personName}
      </p>
    </div>
  );
};

/**
 * 개인 정보 카드 컴포넌트 (신랑 또는 신부)
 */
interface PersonCardProps {
  person: PersonInfo;
  side: 'groom' | 'bride';
  showContacts: boolean;
}

const PersonCard = ({ person, side, showContacts }: PersonCardProps) => {
  const sideLabel = side === 'groom' ? '신랑' : '신부';
  const hasAnyContact = person.phone || person.father.phone || person.mother.phone;
  
  return (
    <div className="flex flex-col items-center">
      {/* 부모님 정보 및 이름 */}
      <ParentDisplay
        father={person.father}
        mother={person.mother}
        personName={person.name}
        side={side}
      />
      
      {/* 영문 이름 (선택적) */}
      {person.englishName && (
        <p className="mt-0.5 text-sm text-gray-400 italic">
          {person.englishName}
        </p>
      )}
      
      {/* 연락처 버튼들 (조건부 렌더링) */}
      {showContacts && hasAnyContact && (
        <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label={`${sideLabel}측 연락처`}>
          {person.phone && (
            <ContactButton phone={person.phone} name={person.name} label={sideLabel} />
          )}
          {person.father.phone && (
            <ContactButton phone={person.father.phone} name={person.father.name} label={`${sideLabel} 아버지`} />
          )}
          {person.mother.phone && (
            <ContactButton phone={person.mother.phone} name={person.mother.name} label={`${sideLabel} 어머니`} />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 구분선 컴포넌트 (하트 아이콘) - Premium animated
 */
const HeartDivider = () => (
  <div className="flex items-center justify-center my-8 sm:my-10" aria-hidden="true">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-200 max-w-20"></div>
    <div className="mx-4 text-gold-400 animate-heartbeat">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-200 max-w-20"></div>
  </div>
);

/**
 * CoupleInfo 메인 컴포넌트
 * 
 * @param config - 신랑/신부 정보 설정
 */
export const CoupleInfo = ({ config }: CoupleInfoProps) => {
  const { groom, bride, greeting } = config;
  
  // 연락처 정보가 하나라도 있는지 확인
  const hasGroomContacts = !!(groom.phone || groom.father.phone || groom.mother.phone);
  const hasBrideContacts = !!(bride.phone || bride.father.phone || bride.mother.phone);
  const hasAnyContacts = hasGroomContacts || hasBrideContacts;
  
  return (
    <section className="section-container" aria-labelledby="couple-info-title">
      <div className="card">
        {/* 섹션 제목 (스크린 리더용) */}
        <h2 id="couple-info-title" className="sr-only">
          신랑 신부 소개
        </h2>
        
        {/* 인사말 - Premium typography */}
        <div className="text-center mb-10 sm:mb-12">
          <p 
            className="font-serif text-gray-700 text-base sm:text-lg leading-loose whitespace-pre-line text-balance tracking-wide"
            aria-label="인사말"
          >
            {greeting}
          </p>
        </div>
        
        {/* 신랑/신부 정보 */}
        <div className="space-y-6 sm:space-y-0 sm:flex sm:justify-center sm:items-start sm:gap-16 md:gap-20">
          {/* 신랑 정보 */}
          <PersonCard 
            person={groom} 
            side="groom" 
            showContacts={hasAnyContacts}
          />
          
          {/* 구분선 (모바일에서만 표시) */}
          <div className="sm:hidden">
            <HeartDivider />
          </div>
          
          {/* 데스크톱 구분선 - Premium animated heart */}
          <div className="hidden sm:flex sm:items-center sm:self-center" aria-hidden="true">
            <div className="text-gold-400 animate-heartbeat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          
          {/* 신부 정보 */}
          <PersonCard 
            person={bride} 
            side="bride" 
            showContacts={hasAnyContacts}
          />
        </div>
      </div>
    </section>
  );
};

export default CoupleInfo;
