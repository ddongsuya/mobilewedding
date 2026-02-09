/**
 * RSVP 컴포넌트
 * 
 * 참석 여부 응답 폼을 제공하는 컴포넌트
 * 
 * Requirements:
 * - 7.1: RSVP 섹션이 로드되면 참석 여부 선택 폼을 표시한다
 * - 7.2: 사용자가 이름, 연락처, 참석 여부, 참석 인원을 입력하고 제출하면 응답을 저장한다
 * - 7.3: 식사 여부 옵션이 활성화된 경우 식사 참석 여부 선택을 표시한다
 * - 7.4: 사용자가 필수 항목을 누락하고 제출하면 필수 입력 항목 안내를 표시한다
 * - 7.5: RSVP가 성공적으로 제출되면 제출 완료 확인 메시지를 표시한다
 */

import { useState, FormEvent } from 'react';
import type { RsvpProps, RsvpInput } from '../types';
import { validateRsvpInput } from '../utils/validation';

/**
 * 폼 상태 인터페이스
 */
interface FormState {
  name: string;
  phone: string;
  attending: boolean | null;
  guestCount: number;
  mealAttending: boolean | null;
  message: string;
}

/**
 * 초기 폼 상태
 */
const initialFormState: FormState = {
  name: '',
  phone: '',
  attending: null,
  guestCount: 1,
  mealAttending: null,
  message: '',
};

/**
 * 체크 아이콘 컴포넌트
 */
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

/**
 * 참석 여부 선택 버튼 컴포넌트
 * Requirements 7.1: 참석 여부 선택 (참석/불참)
 * Requirements 9.3, 9.4: 접근성 개선 - 키보드 네비게이션, ARIA 속성
 */
interface AttendanceButtonProps {
  selected: boolean | null;
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

const AttendanceButton = ({
  selected,
  value,
  label,
  onChange,
  disabled,
}: AttendanceButtonProps) => {
  const isSelected = selected === value;
  
  /**
   * 키보드 이벤트 핸들러
   * Requirements 9.4: Enter/Space로 선택
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(value);
    }
  };
  
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isSelected
          ? value
            ? 'border-rose-500 bg-rose-50 text-rose-600 focus-visible:ring-rose-500'
            : 'border-gray-500 bg-gray-50 text-gray-600 focus-visible:ring-gray-500'
          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 focus-visible:ring-gray-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-pressed={isSelected}
      aria-label={`${label} ${isSelected ? '(선택됨)' : ''}`}
    >
      {label}
    </button>
  );
};

/**
 * 인원 선택 컴포넌트
 * Requirements 7.2: 참석 선택 시 참석 인원 입력 (1-10명)
 * Requirements 9.3, 9.4: 접근성 개선 - 키보드 네비게이션, ARIA 속성
 */
interface GuestCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  error?: string;
}

const GuestCountSelector = ({
  value,
  onChange,
  disabled,
  error,
}: GuestCountSelectorProps) => {
  const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        참석 인원 <span className="text-red-500" aria-hidden="true">*</span>
        <span className="sr-only">(필수)</span>
      </legend>
      <div 
        className="grid grid-cols-5 gap-2"
        role="radiogroup"
        aria-label="참석 인원 선택"
        aria-describedby={error ? 'guest-count-error' : undefined}
      >
        {counts.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onChange(count)}
            disabled={disabled}
            className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
              value === count
                ? 'border-rose-500 bg-rose-50 text-rose-600 focus-visible:ring-rose-500'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 focus-visible:ring-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            role="radio"
            aria-checked={value === count}
            aria-label={`${count}명`}
          >
            {count}명
          </button>
        ))}
      </div>
      {error && (
        <p id="guest-count-error" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

/**
 * 식사 여부 선택 컴포넌트
 * Requirements 7.3: 식사 여부 선택 옵션 (선택적)
 * Requirements 9.3, 9.4: 접근성 개선 - 키보드 네비게이션, ARIA 속성
 */
interface MealOptionSelectorProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

const MealOptionSelector = ({
  value,
  onChange,
  disabled,
}: MealOptionSelectorProps) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        식사 참석 여부
      </legend>
      <div 
        className="flex gap-3"
        role="radiogroup"
        aria-label="식사 참석 여부 선택"
      >
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
            value === true
              ? 'border-rose-500 bg-rose-50 text-rose-600 focus-visible:ring-rose-500'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 focus-visible:ring-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          role="radio"
          aria-checked={value === true}
        >
          식사 예정
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
            value === false
              ? 'border-gray-500 bg-gray-50 text-gray-600 focus-visible:ring-gray-500'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 focus-visible:ring-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          role="radio"
          aria-checked={value === false}
        >
          식사 안함
        </button>
      </div>
    </fieldset>
  );
};

/**
 * 제출 완료 메시지 컴포넌트
 * Requirements 7.5: 제출 완료 시 감사 메시지 표시
 */
interface SuccessMessageProps {
  attending: boolean;
  onReset: () => void;
}

const SuccessMessage = ({ attending, onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <CheckIcon />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        응답이 제출되었습니다
      </h3>
      <p className="text-gray-600 mb-6">
        {attending
          ? '참석해 주셔서 감사합니다. 결혼식에서 뵙겠습니다!'
          : '응답해 주셔서 감사합니다. 마음은 함께 하겠습니다.'}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2 text-rose-600 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
      >
        다시 작성하기
      </button>
    </div>
  );
};

/**
 * RSVP 폼 컴포넌트
 */
interface RsvpFormProps {
  mealOption: boolean;
  onSubmit: (input: RsvpInput) => Promise<void>;
  onSuccess: (attending: boolean) => void;
}

const RsvpForm = ({ mealOption, onSubmit, onSuccess }: RsvpFormProps) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * 입력 필드 변경 핸들러
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // 제출 에러 메시지 제거
    if (submitError) {
      setSubmitError(null);
    }
  };

  /**
   * 참석 여부 변경 핸들러
   */
  const handleAttendingChange = (attending: boolean) => {
    setFormData((prev) => ({
      ...prev,
      attending,
      // 불참 선택 시 인원을 0으로 설정
      guestCount: attending ? (prev.guestCount || 1) : 0,
      // 불참 선택 시 식사 옵션 초기화
      mealAttending: attending ? prev.mealAttending : null,
    }));
    
    // 에러 메시지 제거
    if (errors.attending) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.attending;
        return newErrors;
      });
    }
  };

  /**
   * 인원 변경 핸들러
   */
  const handleGuestCountChange = (count: number) => {
    setFormData((prev) => ({ ...prev, guestCount: count }));
    
    if (errors.guestCount) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.guestCount;
        return newErrors;
      });
    }
  };

  /**
   * 식사 여부 변경 핸들러
   */
  const handleMealAttendingChange = (mealAttending: boolean) => {
    setFormData((prev) => ({ ...prev, mealAttending }));
  };

  /**
   * 폼 제출 핸들러
   * Requirements 7.4: 입력 유효성 검사
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 참석 여부 선택 확인
    if (formData.attending === null) {
      setErrors({ attending: '참석 여부를 선택해주세요' });
      return;
    }

    // RSVP 입력 데이터 생성
    const input: RsvpInput = {
      name: formData.name,
      phone: formData.phone,
      attending: formData.attending,
      guestCount: formData.attending ? formData.guestCount : 0,
    };

    // 식사 옵션이 활성화되어 있고 참석하는 경우에만 식사 여부 추가
    if (mealOption && formData.attending && formData.mealAttending !== null) {
      input.mealAttending = formData.mealAttending;
    }

    // 메시지가 있는 경우 추가
    if (formData.message.trim()) {
      input.message = formData.message.trim();
    }

    // Requirements 7.4: 유효성 검사
    const validationResult = validateRsvpInput(input);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(input);
      // 성공 시 성공 상태로 전환
      onSuccess(formData.attending);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'RSVP 제출에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 이름 입력 */}
      <div>
        <label htmlFor="rsvp-name" className="block text-sm font-medium text-gray-700 mb-1">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="rsvp-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="이름을 입력해주세요"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          maxLength={20}
          aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="rsvp-name-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* 연락처 입력 */}
      <div>
        <label htmlFor="rsvp-phone" className="block text-sm font-medium text-gray-700 mb-1">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="rsvp-phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="010-0000-0000"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          maxLength={13}
          aria-describedby={errors.phone ? 'rsvp-phone-error' : undefined}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p id="rsvp-phone-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* 참석 여부 선택 - Requirements 7.1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          참석 여부 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <AttendanceButton
            selected={formData.attending}
            value={true}
            label="참석"
            onChange={handleAttendingChange}
            disabled={isSubmitting}
          />
          <AttendanceButton
            selected={formData.attending}
            value={false}
            label="불참"
            onChange={handleAttendingChange}
            disabled={isSubmitting}
          />
        </div>
        {errors.attending && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.attending}
          </p>
        )}
      </div>

      {/* 참석 인원 선택 - Requirements 7.2 (참석 선택 시에만 표시) */}
      {formData.attending === true && (
        <GuestCountSelector
          value={formData.guestCount}
          onChange={handleGuestCountChange}
          disabled={isSubmitting}
          error={errors.guestCount}
        />
      )}

      {/* 식사 여부 선택 - Requirements 7.3 (참석 선택 시에만 표시) */}
      {mealOption && formData.attending === true && (
        <MealOptionSelector
          value={formData.mealAttending}
          onChange={handleMealAttendingChange}
          disabled={isSubmitting}
        />
      )}

      {/* 추가 메시지 입력 (선택) */}
      <div>
        <label htmlFor="rsvp-message" className="block text-sm font-medium text-gray-700 mb-1">
          추가 메시지 <span className="text-gray-400 text-xs">(선택)</span>
        </label>
        <textarea
          id="rsvp-message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="전하고 싶은 말씀이 있으시면 남겨주세요"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
          disabled={isSubmitting}
          maxLength={200}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">
            {formData.message.length}/200
          </span>
        </div>
      </div>

      {/* 제출 에러 메시지 */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full px-4 py-3 text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? '제출 중...' : '참석 여부 제출하기'}
      </button>
    </form>
  );
};

/**
 * RSVP 메인 컴포넌트
 * 
 * @param config - RSVP 설정
 * @param onSubmit - RSVP 제출 핸들러
 */
export const RSVP = ({ config, onSubmit }: RsvpProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAttending, setSubmittedAttending] = useState(false);

  // RSVP 기능이 비활성화된 경우 렌더링하지 않음
  if (!config.enabled) {
    return null;
  }

  /**
   * 제출 성공 핸들러
   * Requirements 7.5: 제출 완료 시 감사 메시지 표시
   */
  const handleSuccess = (attending: boolean) => {
    setIsSubmitted(true);
    setSubmittedAttending(attending);
  };

  /**
   * 다시 작성하기 핸들러
   */
  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedAttending(false);
  };

  return (
    <section className="section-container" aria-labelledby="rsvp-title">
      <div className="card">
        {/* 섹션 제목 - Premium serif */}
        <h2
          id="rsvp-title"
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-2 tracking-wider"
        >
          참석 여부
        </h2>

        {/* 안내 문구 */}
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wide">
          참석 여부를 알려주시면 감사하겠습니다
        </p>

        {/* 마감일 표시 (설정된 경우) */}
        {config.deadline && (
          <p className="text-center text-xs text-gray-400 mb-6 tracking-wide">
            응답 마감: {new Date(config.deadline).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* 제출 완료 메시지 또는 폼 */}
        {isSubmitted ? (
          <SuccessMessage
            attending={submittedAttending}
            onReset={handleReset}
          />
        ) : (
          <RsvpForm
            mealOption={config.mealOption}
            onSubmit={onSubmit}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </section>
  );
};

export default RSVP;
