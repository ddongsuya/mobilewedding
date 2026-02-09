/**
 * Account 컴포넌트
 * 
 * 신랑측/신부측 계좌 정보, 복사 버튼, 카카오페이 버튼을 표시하는 컴포넌트
 * 
 * Requirements:
 * - 5.1: 신랑측과 신부측 계좌 정보를 구분하여 표시
 * - 5.2: 계좌번호를 클립보드에 복사
 * - 5.3: 복사 완료 피드백을 사용자에게 표시
 * - 5.4: 카카오페이 송금 링크가 제공된 경우 카카오페이 송금 버튼을 표시
 */

import { useState, useCallback } from 'react';
import { AccountProps, BankAccount } from '../types';
import { copyToClipboard } from '../utils/clipboard';

/**
 * 복사 상태 타입
 */
type CopyStatus = 'idle' | 'success' | 'error';

/**
 * 복사 상태 관리 인터페이스
 */
interface CopyState {
  [accountKey: string]: CopyStatus;
}

/**
 * 복사 아이콘 컴포넌트
 */
const CopyIcon = () => (
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
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

/**
 * 체크 아이콘 컴포넌트 (복사 성공 시)
 */
const CheckIcon = () => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

/**
 * 카카오페이 아이콘 컴포넌트
 */
const KakaoPayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.874l-.857 3.142a.5.5 0 00.764.545l3.683-2.456c.78.1 1.573.145 2.375.145 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
  </svg>
);

/**
 * 아코디언 화살표 아이콘 컴포넌트
 */
interface ChevronIconProps {
  isOpen: boolean;
}

const ChevronIcon = ({ isOpen }: ChevronIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

/**
 * 계좌 카드 컴포넌트
 */
interface AccountCardProps {
  account: BankAccount;
  accountKey: string;
  copyStatus: CopyStatus;
  onCopy: (accountKey: string, accountNumber: string) => void;
}

const AccountCard = ({ account, accountKey, copyStatus, onCopy }: AccountCardProps) => {
  const { bank, accountNumber, holder, kakaoPayLink } = account;
  
  const handleCopy = () => {
    onCopy(accountKey, accountNumber);
  };
  
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case 'success':
        return (
          <>
            <CheckIcon />
            <span>복사됨</span>
          </>
        );
      case 'error':
        return (
          <>
            <CopyIcon />
            <span>실패</span>
          </>
        );
      default:
        return (
          <>
            <CopyIcon />
            <span>복사</span>
          </>
        );
    }
  };
  
  const getCopyButtonClass = () => {
    const baseClass = 'inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors tap-target';
    switch (copyStatus) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-700`;
      case 'error':
        return `${baseClass} bg-red-100 text-red-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    }
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* 예금주 및 은행 정보 */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-gray-800 font-medium">{holder}</span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-gray-600">{bank}</span>
        </div>
      </div>
      
      {/* 계좌번호 및 복사 버튼 - Requirements 5.2, 5.3 */}
      <div className="flex items-center justify-between gap-2">
        <p 
          className="text-gray-700 font-mono text-sm sm:text-base flex-1"
          aria-label={`계좌번호: ${accountNumber}`}
        >
          {accountNumber}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className={getCopyButtonClass()}
          aria-label={`${holder}님 계좌번호 복사하기`}
          disabled={copyStatus === 'success'}
        >
          {getCopyButtonContent()}
        </button>
      </div>
      
      {/* 카카오페이 버튼 - Requirements 5.4 */}
      {kakaoPayLink && (
        <div className="mt-3">
          <a
            href={kakaoPayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors tap-target text-sm font-medium"
            aria-label={`${holder}님에게 카카오페이로 송금하기`}
          >
            <KakaoPayIcon />
            <span>카카오페이 송금</span>
          </a>
        </div>
      )}
    </div>
  );
};

/**
 * 계좌 그룹 컴포넌트 (신랑측 또는 신부측)
 * Requirements 9.3, 9.4: 접근성 개선 - 아코디언 키보드 네비게이션
 */
interface AccountGroupProps {
  title: string;
  accounts: BankAccount[];
  side: 'groom' | 'bride';
  copyStates: CopyState;
  onCopy: (accountKey: string, accountNumber: string) => void;
}

const AccountGroup = ({ title, accounts, side, copyStates, onCopy }: AccountGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (accounts.length === 0) {
    return null;
  }
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  /**
   * 키보드 이벤트 핸들러
   * Requirements 9.4: Enter/Space로 아코디언 토글
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors tap-target focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`${side}-accounts-content`}
        id={`${side}-accounts-title`}
      >
        <span className="text-gray-800 font-medium">{title}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      
      {/* 아코디언 콘텐츠 */}
      <div
        id={`${side}-accounts-content`}
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        role="region"
        aria-labelledby={`${side}-accounts-title`}
        hidden={!isOpen}
      >
        <div className="p-4 space-y-3 bg-white border-t border-gray-200">
          {accounts.map((account, index) => {
            const accountKey = `${side}-${index}`;
            return (
              <AccountCard
                key={accountKey}
                account={account}
                accountKey={accountKey}
                copyStatus={copyStates[accountKey] || 'idle'}
                onCopy={onCopy}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Account 메인 컴포넌트
 * 
 * @param config - 계좌 정보 설정
 */
export const Account = ({ config }: AccountProps) => {
  const { groom, bride } = config;
  const [copyStates, setCopyStates] = useState<CopyState>({});
  
  /**
   * 계좌번호 복사 핸들러
   * Requirements 5.2, 5.3
   */
  const handleCopy = useCallback(async (accountKey: string, accountNumber: string) => {
    const result = await copyToClipboard(accountNumber);
    
    if (result.success) {
      setCopyStates(prev => ({ ...prev, [accountKey]: 'success' }));
      
      // 2초 후 상태 초기화
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [accountKey]: 'idle' }));
      }, 2000);
    } else {
      setCopyStates(prev => ({ ...prev, [accountKey]: 'error' }));
      
      // 2초 후 상태 초기화
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [accountKey]: 'idle' }));
      }, 2000);
    }
  }, []);
  
  // 계좌 정보가 없는 경우 렌더링하지 않음
  if (groom.length === 0 && bride.length === 0) {
    return null;
  }
  
  return (
    <section className="section-container" aria-labelledby="account-info-title">
      <div className="card">
        {/* 섹션 제목 - Premium serif */}
        <h2 
          id="account-info-title" 
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-2 tracking-wider"
        >
          마음 전하실 곳
        </h2>
        
        {/* 안내 문구 */}
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wide">
          축하의 마음을 전해주세요
        </p>
        
        {/* 계좌 그룹들 - Requirements 5.1 */}
        <div className="space-y-4">
          {/* 신랑측 계좌 */}
          <AccountGroup
            title="신랑측 계좌"
            accounts={groom}
            side="groom"
            copyStates={copyStates}
            onCopy={handleCopy}
          />
          
          {/* 신부측 계좌 */}
          <AccountGroup
            title="신부측 계좌"
            accounts={bride}
            side="bride"
            copyStates={copyStates}
            onCopy={handleCopy}
          />
        </div>
      </div>
    </section>
  );
};

export default Account;
