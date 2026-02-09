/**
 * Guestbook 컴포넌트
 * 
 * 방명록 메시지 목록, 작성 폼, 삭제 기능을 제공하는 컴포넌트
 * 
 * Requirements:
 * - 6.1: 방명록 섹션이 로드되면 기존에 작성된 축하 메시지 목록을 표시한다
 * - 6.2: 사용자가 이름, 비밀번호, 메시지를 입력하고 등록 버튼을 클릭하면 새 축하 메시지를 저장하고 목록에 추가한다
 * - 6.3: 사용자가 빈 필드로 등록을 시도하면 필수 입력 항목 안내 메시지를 표시한다
 * - 6.4: 사용자가 자신의 메시지 삭제를 요청하고 올바른 비밀번호를 입력하면 해당 메시지를 삭제한다
 * - 6.5: 비밀번호 해싱 저장 (guestbook service에서 처리)
 */

import { useState, useCallback, FormEvent } from 'react';
import type { GuestbookProps, GuestbookInput, GuestbookMessage } from '../types';
import { validateGuestbookInput } from '../utils/validation';

/**
 * 폼 상태 인터페이스
 */
interface FormState {
  name: string;
  password: string;
  message: string;
}

/**
 * 삭제 모달 상태 인터페이스
 */
interface DeleteModalState {
  isOpen: boolean;
  messageId: string | null;
  password: string;
  error: string | null;
  isDeleting: boolean;
}

/**
 * 초기 폼 상태
 */
const initialFormState: FormState = {
  name: '',
  password: '',
  message: '',
};

/**
 * 초기 삭제 모달 상태
 */
const initialDeleteModalState: DeleteModalState = {
  isOpen: false,
  messageId: null,
  password: '',
  error: null,
  isDeleting: false,
};

/**
 * 날짜 포맷팅 함수
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 삭제 아이콘 컴포넌트
 */
const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

/**
 * 닫기 아이콘 컴포넌트
 */
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * 메시지 카드 컴포넌트
 * Requirements 6.1: 작성자, 내용, 날짜 표시
 */
interface MessageCardProps {
  message: GuestbookMessage;
  onDeleteClick: (messageId: string) => void;
}

const MessageCard = ({ message, onDeleteClick }: MessageCardProps) => {
  const handleDeleteClick = () => {
    onDeleteClick(message.id);
  };

  return (
    <article 
      className="bg-gray-50 rounded-lg p-4"
      aria-label={`${message.name}님의 축하 메시지`}
    >
      {/* 헤더: 작성자 이름, 날짜, 삭제 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">{message.name}</span>
          <span className="text-xs text-gray-400">
            {formatDate(message.createdAt)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors tap-target"
          aria-label={`${message.name}님의 메시지 삭제하기`}
        >
          <TrashIcon />
        </button>
      </div>
      
      {/* 메시지 내용 */}
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {message.message}
      </p>
    </article>
  );
};

/**
 * 메시지 목록 컴포넌트
 * Requirements 6.1: 기존에 작성된 축하 메시지 목록을 표시
 */
interface MessageListProps {
  messages: GuestbookMessage[];
  onDeleteClick: (messageId: string) => void;
}

const MessageList = ({ messages, onDeleteClick }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>아직 작성된 메시지가 없습니다.</p>
        <p className="text-sm mt-1">첫 번째 축하 메시지를 남겨주세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

/**
 * 삭제 확인 모달 컴포넌트
 * Requirements 6.4: 비밀번호 입력 후 본인 메시지 삭제 기능
 * Requirements 9.3, 9.4: 접근성 개선 - 키보드 네비게이션, 포커스 관리
 */
interface DeleteModalProps {
  state: DeleteModalState;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteModal = ({ state, onPasswordChange, onConfirm, onClose }: DeleteModalProps) => {
  if (!state.isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 키보드 이벤트 핸들러
   * Requirements 9.4: Escape 키로 모달 닫기
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 id="delete-modal-title" className="text-lg font-medium text-gray-800">
            메시지 삭제
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label="닫기 (Escape)"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 모달 내용 */}
        <form onSubmit={handleSubmit} className="p-4">
          <p id="delete-modal-description" className="text-sm text-gray-600 mb-4">
            메시지를 삭제하려면 작성 시 입력한 비밀번호를 입력해주세요.
          </p>

          <div className="mb-4">
            <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="delete-password"
              value={state.password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                state.error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={state.isDeleting}
              autoFocus
              aria-describedby={state.error ? 'delete-password-error' : undefined}
              aria-invalid={!!state.error}
            />
            {/* Requirements 6.5: 비밀번호 오류 메시지 표시 */}
            {state.error && (
              <p id="delete-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              disabled={state.isDeleting}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              disabled={state.isDeleting || !state.password}
            >
              {state.isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * 메시지 작성 폼 컴포넌트
 * Requirements 6.2, 6.3: 이름, 비밀번호, 메시지 입력 폼
 */
interface MessageFormProps {
  maxLength: number;
  onSubmit: (input: GuestbookInput) => Promise<void>;
}

const MessageForm = ({ maxLength, onSubmit }: MessageFormProps) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Requirements 6.3: 유효성 검사
    const validationResult = validateGuestbookInput(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // 메시지 길이 검사
    if (formData.message.length > maxLength) {
      setErrors({ message: `메시지는 ${maxLength}자 이내로 입력해주세요` });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData);
      // 성공 시 폼 초기화
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '메시지 등록에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이름 입력 */}
      <div>
        <label htmlFor="guestbook-name" className="block text-sm font-medium text-gray-700 mb-1">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="guestbook-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="이름을 입력해주세요"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          maxLength={20}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="guestbook-password" className="block text-sm font-medium text-gray-700 mb-1">
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="guestbook-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="삭제 시 필요합니다 (4자 이상)"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          maxLength={20}
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* 메시지 입력 */}
      <div>
        <label htmlFor="guestbook-message" className="block text-sm font-medium text-gray-700 mb-1">
          축하 메시지 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="guestbook-message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="축하 메시지를 남겨주세요"
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
          maxLength={maxLength}
          aria-describedby={errors.message ? 'message-error' : 'message-count'}
          aria-invalid={!!errors.message}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message ? (
            <p id="message-error" className="text-sm text-red-500" role="alert">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span 
            id="message-count" 
            className={`text-xs ${
              formData.message.length > maxLength ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {formData.message.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* 제출 에러 메시지 */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* 등록 버튼 */}
      <button
        type="submit"
        className="w-full px-4 py-3 text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? '등록 중...' : '축하 메시지 남기기'}
      </button>
    </form>
  );
};

/**
 * Guestbook 메인 컴포넌트
 * 
 * @param config - 방명록 설정
 * @param messages - 방명록 메시지 목록
 * @param onSubmit - 메시지 등록 핸들러
 * @param onDelete - 메시지 삭제 핸들러
 */
export const Guestbook = ({ config, messages, onSubmit, onDelete }: GuestbookProps) => {
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(initialDeleteModalState);

  // 방명록 기능이 비활성화된 경우 렌더링하지 않음
  if (!config.enabled) {
    return null;
  }

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleDeleteClick = useCallback((messageId: string) => {
    setDeleteModal({
      isOpen: true,
      messageId,
      password: '',
      error: null,
      isDeleting: false,
    });
  }, []);

  /**
   * 삭제 모달 비밀번호 변경 핸들러
   */
  const handleDeletePasswordChange = useCallback((password: string) => {
    setDeleteModal((prev) => ({
      ...prev,
      password,
      error: null,
    }));
  }, []);

  /**
   * 삭제 확인 핸들러
   * Requirements 6.4: 올바른 비밀번호 입력 시 메시지 삭제
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.messageId || !deleteModal.password) {
      return;
    }

    setDeleteModal((prev) => ({ ...prev, isDeleting: true, error: null }));

    try {
      await onDelete(deleteModal.messageId, deleteModal.password);
      // 성공 시 모달 닫기
      setDeleteModal(initialDeleteModalState);
    } catch (error) {
      // Requirements 6.5: 비밀번호 오류 메시지 표시
      setDeleteModal((prev) => ({
        ...prev,
        isDeleting: false,
        error: error instanceof Error ? error.message : '삭제에 실패했습니다.',
      }));
    }
  }, [deleteModal.messageId, deleteModal.password, onDelete]);

  /**
   * 삭제 모달 닫기 핸들러
   */
  const handleDeleteModalClose = useCallback(() => {
    setDeleteModal(initialDeleteModalState);
  }, []);

  return (
    <section className="section-container" aria-labelledby="guestbook-title">
      <div className="card">
        {/* 섹션 제목 - Premium serif */}
        <h2
          id="guestbook-title"
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-2 tracking-wider"
        >
          방명록
        </h2>

        {/* 안내 문구 */}
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wide">
          신랑 신부에게 축하 메시지를 남겨주세요
        </p>

        {/* 메시지 작성 폼 - Requirements 6.2, 6.3 */}
        <div className="mb-8">
          <MessageForm maxLength={config.maxLength} onSubmit={onSubmit} />
        </div>

        {/* 구분선 - Premium style */}
        <div className="flex items-center justify-center mb-8" aria-hidden="true">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
        </div>

        {/* 메시지 목록 - Requirements 6.1 */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4 tracking-wide">
            축하 메시지 ({messages.length})
          </h3>
          <MessageList messages={messages} onDeleteClick={handleDeleteClick} />
        </div>
      </div>

      {/* 삭제 확인 모달 - Requirements 6.4, 6.5 */}
      <DeleteModal
        state={deleteModal}
        onPasswordChange={handleDeletePasswordChange}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteModalClose}
      />
    </section>
  );
};

export default Guestbook;
