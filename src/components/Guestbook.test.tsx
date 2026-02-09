/**
 * Guestbook 컴포넌트 테스트
 * 
 * Requirements:
 * - 6.1: 방명록 섹션이 로드되면 기존에 작성된 축하 메시지 목록을 표시한다
 * - 6.2: 사용자가 이름, 비밀번호, 메시지를 입력하고 등록 버튼을 클릭하면 새 축하 메시지를 저장하고 목록에 추가한다
 * - 6.3: 사용자가 빈 필드로 등록을 시도하면 필수 입력 항목 안내 메시지를 표시한다
 * - 6.4: 사용자가 자신의 메시지 삭제를 요청하고 올바른 비밀번호를 입력하면 해당 메시지를 삭제한다
 * - 6.5: 잘못된 비밀번호가 입력되면 비밀번호 오류 메시지를 표시한다
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Guestbook } from './Guestbook';
import type { GuestbookConfig, GuestbookMessage } from '../types';

describe('Guestbook 컴포넌트', () => {
  const mockConfig: GuestbookConfig = {
    enabled: true,
    maxLength: 500,
  };

  const mockMessages: GuestbookMessage[] = [
    {
      id: 'msg1',
      name: '홍길동',
      passwordHash: 'hash1',
      message: '결혼을 진심으로 축하합니다!',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'msg2',
      name: '김철수',
      passwordHash: 'hash2',
      message: '행복하세요!',
      createdAt: new Date('2024-01-14'),
    },
  ];

  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let mockOnDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    mockOnDelete = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirements 6.1: 축하 메시지 목록 표시', () => {
    it('기존에 작성된 메시지 목록을 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('결혼을 진심으로 축하합니다!')).toBeInTheDocument();
      expect(screen.getByText('김철수')).toBeInTheDocument();
      expect(screen.getByText('행복하세요!')).toBeInTheDocument();
    });

    it('메시지 작성 날짜를 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('2024.01.15')).toBeInTheDocument();
      expect(screen.getByText('2024.01.14')).toBeInTheDocument();
    });

    it('메시지 개수를 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('축하 메시지 (2)')).toBeInTheDocument();
    });

    it('메시지가 없는 경우 안내 문구를 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={[]}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('아직 작성된 메시지가 없습니다.')).toBeInTheDocument();
      expect(screen.getByText('첫 번째 축하 메시지를 남겨주세요!')).toBeInTheDocument();
    });
  });

  describe('Requirements 6.2: 새 메시지 작성', () => {
    it('이름, 비밀번호, 메시지 입력 필드를 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /축하 메시지/ })).toBeInTheDocument();
    });

    it('유효한 입력으로 등록 버튼을 클릭하면 onSubmit이 호출된다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '테스트' } });
      fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: '1234' } });
      fireEvent.change(screen.getByRole('textbox', { name: /축하 메시지/ }), { target: { value: '축하합니다!' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '테스트',
          password: '1234',
          message: '축하합니다!',
        });
      });
    });

    it('메시지 등록 성공 후 폼이 초기화된다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /이름/ }) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/비밀번호/) as HTMLInputElement;
      const messageInput = screen.getByRole('textbox', { name: /축하 메시지/ }) as HTMLTextAreaElement;

      fireEvent.change(nameInput, { target: { value: '테스트' } });
      fireEvent.change(passwordInput, { target: { value: '1234' } });
      fireEvent.change(messageInput, { target: { value: '축하합니다!' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('메시지 등록 실패 시 에러 메시지를 표시한다', async () => {
      mockOnSubmit.mockRejectedValue(new Error('저장에 실패했습니다.'));
      
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '테스트' } });
      fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: '1234' } });
      fireEvent.change(screen.getByRole('textbox', { name: /축하 메시지/ }), { target: { value: '축하합니다!' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(screen.getByText('저장에 실패했습니다.')).toBeInTheDocument();
      });
    });
  });

  describe('Requirements 6.3: 입력 유효성 검사', () => {
    it('이름이 비어있으면 오류 메시지를 표시한다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: '1234' } });
      fireEvent.change(screen.getByRole('textbox', { name: /축하 메시지/ }), { target: { value: '축하합니다!' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('비밀번호가 4자 미만이면 오류 메시지를 표시한다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '테스트' } });
      fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: '123' } });
      fireEvent.change(screen.getByRole('textbox', { name: /축하 메시지/ }), { target: { value: '축하합니다!' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(screen.getByText('비밀번호는 4자 이상이어야 합니다')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('메시지가 비어있으면 오류 메시지를 표시한다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '테스트' } });
      fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: '1234' } });
      
      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        expect(screen.getByText('메시지를 입력해주세요')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('메시지 글자 수를 표시한다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('0/500')).toBeInTheDocument();

      fireEvent.change(screen.getByRole('textbox', { name: /축하 메시지/ }), { target: { value: '축하합니다!' } });

      expect(screen.getByText('6/500')).toBeInTheDocument();
    });
  });

  describe('Requirements 6.4: 메시지 삭제', () => {
    it('삭제 버튼을 클릭하면 비밀번호 입력 모달이 표시된다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('메시지 삭제')).toBeInTheDocument();
    });

    it('올바른 비밀번호 입력 후 삭제 버튼을 클릭하면 onDelete가 호출된다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      // 삭제 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      // 비밀번호 입력 (모달 내 비밀번호 필드)
      fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'testpass' } });
      
      // 삭제 확인
      fireEvent.click(screen.getByRole('button', { name: '삭제' }));

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith('msg1', 'testpass');
      });
    });

    it('삭제 성공 후 모달이 닫힌다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      // 삭제 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      // 비밀번호 입력 (모달 내 비밀번호 필드)
      fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'testpass' } });
      
      // 삭제 확인
      fireEvent.click(screen.getByRole('button', { name: '삭제' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('취소 버튼을 클릭하면 모달이 닫힌다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      // 삭제 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      // 취소 버튼 클릭
      fireEvent.click(screen.getByRole('button', { name: '취소' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Requirements 6.5: 비밀번호 오류 메시지', () => {
    it('잘못된 비밀번호 입력 시 오류 메시지를 표시한다', async () => {
      mockOnDelete.mockRejectedValue(new Error('비밀번호가 일치하지 않습니다.'));
      
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      // 삭제 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      // 잘못된 비밀번호 입력 (모달 내 비밀번호 필드)
      fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), { target: { value: 'wrongpass' } });
      
      // 삭제 확인
      fireEvent.click(screen.getByRole('button', { name: '삭제' }));

      await waitFor(() => {
        expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
      });

      // 모달은 열린 상태로 유지
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('방명록 비활성화', () => {
    it('enabled가 false인 경우 컴포넌트를 렌더링하지 않는다', () => {
      const disabledConfig: GuestbookConfig = {
        enabled: false,
        maxLength: 500,
      };

      const { container } = render(
        <Guestbook
          config={disabledConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('접근성', () => {
    it('섹션에 적절한 aria-labelledby가 있다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      const section = screen.getByRole('region', { name: /방명록/i });
      expect(section).toBeInTheDocument();
    });

    it('입력 필드에 적절한 레이블이 있다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /축하 메시지/ })).toBeInTheDocument();
    });

    it('오류 메시지에 role="alert"가 있다', async () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '축하 메시지 남기기' }));

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('삭제 모달에 적절한 aria 속성이 있다', () => {
      render(
        <Guestbook
          config={mockConfig}
          messages={mockMessages}
          onSubmit={mockOnSubmit}
          onDelete={mockOnDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /삭제하기/i });
      fireEvent.click(deleteButtons[0]);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'delete-modal-title');
    });
  });
});
