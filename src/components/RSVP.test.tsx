/**
 * RSVP 컴포넌트 테스트
 * 
 * Requirements:
 * - 7.1: RSVP 섹션이 로드되면 참석 여부 선택 폼을 표시한다
 * - 7.2: 사용자가 이름, 연락처, 참석 여부, 참석 인원을 입력하고 제출하면 응답을 저장한다
 * - 7.3: 식사 여부 옵션이 활성화된 경우 식사 참석 여부 선택을 표시한다
 * - 7.4: 사용자가 필수 항목을 누락하고 제출하면 필수 입력 항목 안내를 표시한다
 * - 7.5: RSVP가 성공적으로 제출되면 제출 완료 확인 메시지를 표시한다
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RSVP } from './RSVP';
import type { RsvpConfig } from '../types';

describe('RSVP 컴포넌트', () => {
  const mockConfig: RsvpConfig = {
    enabled: true,
    mealOption: true,
  };

  const mockConfigWithDeadline: RsvpConfig = {
    enabled: true,
    mealOption: true,
    deadline: '2024-12-31',
  };

  const mockConfigNoMeal: RsvpConfig = {
    enabled: true,
    mealOption: false,
  };

  let mockOnSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSubmit = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirements 7.1: 참석 여부 선택 폼 표시', () => {
    it('RSVP 섹션 제목을 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('heading', { name: '참석 여부' })).toBeInTheDocument();
    });

    it('이름 입력 필드를 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
    });

    it('연락처 입력 필드를 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('textbox', { name: /연락처/ })).toBeInTheDocument();
    });

    it('참석/불참 선택 버튼을 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: '참석' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '불참' })).toBeInTheDocument();
    });

    it('제출 버튼을 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: '참석 여부 제출하기' })).toBeInTheDocument();
    });

    it('마감일이 설정된 경우 마감일을 표시한다', () => {
      render(<RSVP config={mockConfigWithDeadline} onSubmit={mockOnSubmit} />);

      expect(screen.getByText(/응답 마감:/)).toBeInTheDocument();
      expect(screen.getByText(/2024년 12월 31일/)).toBeInTheDocument();
    });
  });

  describe('Requirements 7.2: 참석 인원 입력 (1-10명)', () => {
    it('참석 선택 시 인원 선택 버튼을 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석 버튼 클릭 (getAllByRole 사용하여 첫 번째 버튼 선택)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      // 1-10명 버튼 확인 (role="radio"로 변경됨)
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByRole('radio', { name: `${i}명` })).toBeInTheDocument();
      }
    });

    it('불참 선택 시 인원 선택 버튼을 표시하지 않는다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 불참 버튼 클릭
      fireEvent.click(screen.getByRole('button', { name: /불참/ }));

      // 인원 선택 버튼이 없어야 함
      expect(screen.queryByRole('radio', { name: '1명' })).not.toBeInTheDocument();
    });

    it('유효한 입력으로 제출하면 onSubmit이 호출된다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);
      fireEvent.click(screen.getByRole('radio', { name: '2명' }));

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          phone: '010-1234-5678',
          attending: true,
          guestCount: 2,
        });
      });
    });

    it('불참 선택 시 guestCount가 0으로 제출된다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      fireEvent.click(screen.getByRole('button', { name: /불참/ }));

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          phone: '010-1234-5678',
          attending: false,
          guestCount: 0,
        });
      });
    });
  });

  describe('Requirements 7.3: 식사 여부 선택 옵션', () => {
    it('mealOption이 true이고 참석 선택 시 식사 옵션을 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석 버튼 클릭 (getAllByRole 사용하여 첫 번째 버튼 선택)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      expect(screen.getByText('식사 참석 여부')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '식사 예정' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '식사 안함' })).toBeInTheDocument();
    });

    it('mealOption이 false인 경우 식사 옵션을 표시하지 않는다', () => {
      render(<RSVP config={mockConfigNoMeal} onSubmit={mockOnSubmit} />);

      // 참석 버튼 클릭 (getAllByRole 사용하여 첫 번째 버튼 선택)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      expect(screen.queryByText('식사 참석 여부')).not.toBeInTheDocument();
    });

    it('불참 선택 시 식사 옵션을 표시하지 않는다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 불참 버튼 클릭
      fireEvent.click(screen.getByRole('button', { name: /불참/ }));

      expect(screen.queryByText('식사 참석 여부')).not.toBeInTheDocument();
    });

    it('식사 옵션 선택 시 mealAttending이 포함되어 제출된다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);
      fireEvent.click(screen.getByRole('radio', { name: '식사 예정' }));

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          phone: '010-1234-5678',
          attending: true,
          guestCount: 1,
          mealAttending: true,
        });
      });
    });
  });

  describe('Requirements 7.4: 입력 유효성 검사', () => {
    it('이름이 비어있으면 오류 메시지를 표시한다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 이름 없이 다른 필드만 입력
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('연락처 형식이 잘못되면 오류 메시지를 표시한다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 잘못된 연락처 형식
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '123' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('올바른 연락처를 입력해주세요')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('참석 여부를 선택하지 않으면 오류 메시지를 표시한다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석 여부 선택 없이 다른 필드만 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('참석 여부를 선택해주세요')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Requirements 7.5: 제출 완료 확인 메시지', () => {
    it('참석으로 제출 성공 시 감사 메시지를 표시한다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('응답이 제출되었습니다')).toBeInTheDocument();
        expect(screen.getByText('참석해 주셔서 감사합니다. 결혼식에서 뵙겠습니다!')).toBeInTheDocument();
      });
    });

    it('불참으로 제출 성공 시 감사 메시지를 표시한다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      fireEvent.click(screen.getByRole('button', { name: /불참/ }));

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('응답이 제출되었습니다')).toBeInTheDocument();
        expect(screen.getByText('응답해 주셔서 감사합니다. 마음은 함께 하겠습니다.')).toBeInTheDocument();
      });
    });

    it('다시 작성하기 버튼을 클릭하면 폼으로 돌아간다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력 및 제출
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('응답이 제출되었습니다')).toBeInTheDocument();
      });

      // 다시 작성하기 클릭
      fireEvent.click(screen.getByRole('button', { name: '다시 작성하기' }));

      // 폼이 다시 표시됨
      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
      expect(screen.queryByText('응답이 제출되었습니다')).not.toBeInTheDocument();
    });
  });

  describe('제출 실패 처리', () => {
    it('제출 실패 시 에러 메시지를 표시한다', async () => {
      mockOnSubmit.mockRejectedValue(new Error('네트워크 오류가 발생했습니다.'));

      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      // 참석 버튼 클릭 (aria-label로 정확히 매칭)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(screen.getByText('네트워크 오류가 발생했습니다.')).toBeInTheDocument();
      });

      // 폼은 여전히 표시됨
      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
    });
  });

  describe('RSVP 비활성화', () => {
    it('enabled가 false인 경우 컴포넌트를 렌더링하지 않는다', () => {
      const disabledConfig: RsvpConfig = {
        enabled: false,
        mealOption: true,
      };

      const { container } = render(<RSVP config={disabledConfig} onSubmit={mockOnSubmit} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('추가 메시지 입력', () => {
    it('추가 메시지 입력 필드를 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('textbox', { name: /추가 메시지/ })).toBeInTheDocument();
    });

    it('추가 메시지가 있으면 제출 데이터에 포함된다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 폼 입력
      fireEvent.change(screen.getByRole('textbox', { name: /이름/ }), { target: { value: '홍길동' } });
      fireEvent.change(screen.getByRole('textbox', { name: /연락처/ }), { target: { value: '010-1234-5678' } });
      // 참석 버튼 클릭 (aria-label로 정확히 매칭)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);
      fireEvent.change(screen.getByRole('textbox', { name: /추가 메시지/ }), { target: { value: '축하드립니다!' } });

      // 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          phone: '010-1234-5678',
          attending: true,
          guestCount: 1,
          message: '축하드립니다!',
        });
      });
    });

    it('메시지 글자 수를 표시한다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByText('0/200')).toBeInTheDocument();

      fireEvent.change(screen.getByRole('textbox', { name: /추가 메시지/ }), { target: { value: '축하합니다!' } });

      expect(screen.getByText('6/200')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('섹션에 적절한 aria-labelledby가 있다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      const section = screen.getByRole('region', { name: /참석 여부/i });
      expect(section).toBeInTheDocument();
    });

    it('입력 필드에 적절한 레이블이 있다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('textbox', { name: /이름/ })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /연락처/ })).toBeInTheDocument();
    });

    it('오류 메시지에 role="alert"가 있다', async () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 빈 폼 제출
      fireEvent.click(screen.getByRole('button', { name: '참석 여부 제출하기' }));

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('참석/불참 버튼에 aria-pressed 속성이 있다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석/불참 버튼 찾기 (getAllByRole 사용)
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      const attendButton = attendButtons[0];
      const declineButton = screen.getByRole('button', { name: /^불참/ });

      expect(attendButton).toHaveAttribute('aria-pressed', 'false');
      expect(declineButton).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(attendButton);

      expect(attendButton).toHaveAttribute('aria-pressed', 'true');
      expect(declineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('인원 선택 버튼에 role="radio"와 aria-checked 속성이 있다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석 버튼 클릭
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      const radioButton = screen.getByRole('radio', { name: '1명' });
      expect(radioButton).toHaveAttribute('aria-checked', 'true');

      const radioButton2 = screen.getByRole('radio', { name: '2명' });
      expect(radioButton2).toHaveAttribute('aria-checked', 'false');
    });

    it('radiogroup에 적절한 aria-label이 있다', () => {
      render(<RSVP config={mockConfig} onSubmit={mockOnSubmit} />);

      // 참석 버튼 클릭
      const attendButtons = screen.getAllByRole('button', { name: /^참석/ });
      fireEvent.click(attendButtons[0]);

      expect(screen.getByRole('radiogroup', { name: '참석 인원 선택' })).toBeInTheDocument();
      expect(screen.getByRole('radiogroup', { name: '식사 참석 여부 선택' })).toBeInTheDocument();
    });
  });
});
