/**
 * Gallery 컴포넌트 테스트
 * 
 * Requirements:
 * - 3.1: 등록된 커플 사진들을 그리드 형태로 표시
 * - 3.2: 사진을 클릭하면 해당 사진을 확대하여 모달로 표시
 * - 3.3: 모달이 열린 상태에서 좌우 스와이프하면 이전/다음 사진으로 이동
 * - 3.4: 모달 외부를 클릭하거나 닫기 버튼을 클릭하면 모달을 닫는다
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Gallery } from './Gallery';
import { GalleryConfig, GalleryImage } from '../types';

// 테스트용 이미지 데이터
const mockImages: GalleryImage[] = [
  { id: '1', url: '/images/photo1.jpg', alt: '커플 사진 1', order: 1 },
  { id: '2', url: '/images/photo2.jpg', alt: '커플 사진 2', order: 2 },
  { id: '3', url: '/images/photo3.jpg', alt: '커플 사진 3', order: 3 },
];

const mockGalleryConfig: GalleryConfig = {
  images: mockImages,
  layout: 'grid',
};

describe('Gallery 컴포넌트', () => {
  describe('Requirements 3.1: 이미지 그리드 표시', () => {
    it('등록된 커플 사진들을 그리드 형태로 표시한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 모든 이미지가 표시되는지 확인
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('이미지가 order 기준으로 정렬되어 표시된다', () => {
      const unorderedImages: GalleryImage[] = [
        { id: '3', url: '/images/photo3.jpg', alt: '커플 사진 3', order: 3 },
        { id: '1', url: '/images/photo1.jpg', alt: '커플 사진 1', order: 1 },
        { id: '2', url: '/images/photo2.jpg', alt: '커플 사진 2', order: 2 },
      ];
      
      render(<Gallery config={{ ...mockGalleryConfig, images: unorderedImages }} />);
      
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', '커플 사진 1');
      expect(images[1]).toHaveAttribute('alt', '커플 사진 2');
      expect(images[2]).toHaveAttribute('alt', '커플 사진 3');
    });

    it('이미지가 없으면 아무것도 렌더링하지 않는다', () => {
      const emptyConfig: GalleryConfig = { images: [], layout: 'grid' };
      const { container } = render(<Gallery config={emptyConfig} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('갤러리 섹션 제목이 표시된다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      expect(screen.getByRole('heading', { name: '갤러리' })).toBeInTheDocument();
    });

    it('각 이미지에 적절한 alt 텍스트가 있다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      expect(screen.getByAltText('커플 사진 1')).toBeInTheDocument();
      expect(screen.getByAltText('커플 사진 2')).toBeInTheDocument();
      expect(screen.getByAltText('커플 사진 3')).toBeInTheDocument();
    });

    it('slider 레이아웃을 지원한다', () => {
      const sliderConfig: GalleryConfig = { ...mockGalleryConfig, layout: 'slider' };
      render(<Gallery config={sliderConfig} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });
  });

  describe('Requirements 3.2: 이미지 클릭 시 모달 표시', () => {
    it('이미지를 클릭하면 모달이 열린다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 모달이 열렸는지 확인
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('클릭한 이미지가 모달에 확대되어 표시된다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 두 번째 이미지 클릭
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[1]);
      
      // 모달 내 이미지 확인 (모달에는 확대된 이미지가 있음)
      const dialog = screen.getByRole('dialog');
      const modalImage = dialog.querySelector('img');
      expect(modalImage).toHaveAttribute('alt', '커플 사진 2');
    });

    it('모달에 현재 이미지 인덱스가 표시된다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 인덱스 표시 확인 (1 / 3)
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Requirements 3.3: 모달에서 이전/다음 네비게이션', () => {
    it('다음 버튼을 클릭하면 다음 이미지로 이동한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 다음 버튼 클릭 (aria-label에 인덱스 정보가 포함됨)
      const nextButton = screen.getByRole('button', { name: /다음 사진/ });
      fireEvent.click(nextButton);
      
      // 인덱스가 2 / 3으로 변경되었는지 확인
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('이전 버튼을 클릭하면 이전 이미지로 이동한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 두 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[1]);
      
      // 이전 버튼 클릭 (aria-label에 인덱스 정보가 포함됨)
      const prevButton = screen.getByRole('button', { name: /이전 사진/ });
      fireEvent.click(prevButton);
      
      // 인덱스가 1 / 3으로 변경되었는지 확인
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('마지막 이미지에서 다음 버튼을 클릭하면 첫 번째 이미지로 순환한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 마지막 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[2]);
      
      // 다음 버튼 클릭 (aria-label에 인덱스 정보가 포함됨)
      const nextButton = screen.getByRole('button', { name: /다음 사진/ });
      fireEvent.click(nextButton);
      
      // 첫 번째 이미지로 순환했는지 확인
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('첫 번째 이미지에서 이전 버튼을 클릭하면 마지막 이미지로 순환한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 이전 버튼 클릭 (aria-label에 인덱스 정보가 포함됨)
      const prevButton = screen.getByRole('button', { name: /이전 사진/ });
      fireEvent.click(prevButton);
      
      // 마지막 이미지로 순환했는지 확인
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('키보드 오른쪽 화살표로 다음 이미지로 이동한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 오른쪽 화살표 키 누르기
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      // 다음 이미지로 이동했는지 확인
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('키보드 왼쪽 화살표로 이전 이미지로 이동한다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 두 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[1]);
      
      // 왼쪽 화살표 키 누르기
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      // 이전 이미지로 이동했는지 확인
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('스와이프로 다음 이미지로 이동한다 (왼쪽 스와이프)', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 첫 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 이미지 컨테이너 찾기
      const dialog = screen.getByRole('dialog');
      const imageContainer = dialog.querySelector('div[class*="px-12"]');
      
      if (imageContainer) {
        // 왼쪽 스와이프 시뮬레이션 (touchStart -> touchMove -> touchEnd)
        fireEvent.touchStart(imageContainer, {
          touches: [{ clientX: 200 }],
        });
        fireEvent.touchMove(imageContainer, {
          touches: [{ clientX: 100 }],
        });
        fireEvent.touchEnd(imageContainer);
        
        // 다음 이미지로 이동했는지 확인
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      }
    });

    it('스와이프로 이전 이미지로 이동한다 (오른쪽 스와이프)', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 두 번째 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[1]);
      
      // 이미지 컨테이너 찾기
      const dialog = screen.getByRole('dialog');
      const imageContainer = dialog.querySelector('div[class*="px-12"]');
      
      if (imageContainer) {
        // 오른쪽 스와이프 시뮬레이션
        fireEvent.touchStart(imageContainer, {
          touches: [{ clientX: 100 }],
        });
        fireEvent.touchMove(imageContainer, {
          touches: [{ clientX: 200 }],
        });
        fireEvent.touchEnd(imageContainer);
        
        // 이전 이미지로 이동했는지 확인
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
      }
    });

    it('이미지가 하나뿐이면 네비게이션 버튼이 표시되지 않는다', () => {
      const singleImageConfig: GalleryConfig = {
        images: [mockImages[0]],
        layout: 'grid',
      };
      render(<Gallery config={singleImageConfig} />);
      
      // 이미지 클릭하여 모달 열기
      const imageButton = screen.getByRole('button');
      fireEvent.click(imageButton);
      
      // 네비게이션 버튼이 없는지 확인
      expect(screen.queryByRole('button', { name: '이전 사진' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '다음 사진' })).not.toBeInTheDocument();
    });
  });

  describe('Requirements 3.4: 모달 닫기', () => {
    it('닫기 버튼을 클릭하면 모달이 닫힌다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 모달이 열렸는지 확인
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // 닫기 버튼 클릭 (aria-label에 Escape 힌트가 포함됨)
      const closeButton = screen.getByRole('button', { name: /모달 닫기/ });
      fireEvent.click(closeButton);
      
      // 모달이 닫혔는지 확인
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Escape 키를 누르면 모달이 닫힌다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 모달이 열렸는지 확인
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Escape 키 누르기
      fireEvent.keyDown(window, { key: 'Escape' });
      
      // 모달이 닫혔는지 확인
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('모달 외부(배경)를 클릭하면 모달이 닫힌다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      // 모달이 열렸는지 확인
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      
      // 모달 배경(dialog 자체) 클릭
      fireEvent.click(dialog);
      
      // 모달이 닫혔는지 확인
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('섹션에 적절한 aria-labelledby가 있다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'gallery-title');
    });

    it('이미지 버튼에 적절한 aria-label이 있다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      const imageButtons = screen.getAllByRole('button');
      expect(imageButtons[0]).toHaveAttribute('aria-label', expect.stringContaining('클릭하여 확대 보기'));
    });

    it('모달에 적절한 role과 aria 속성이 있다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      // 이미지 클릭하여 모달 열기
      const imageButtons = screen.getAllByRole('button');
      fireEvent.click(imageButtons[0]);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', expect.stringContaining('이미지 확대 보기'));
    });

    it('갤러리 리스트에 적절한 role이 있다', () => {
      render(<Gallery config={mockGalleryConfig} />);
      
      expect(screen.getByRole('list', { name: '커플 사진 갤러리' })).toBeInTheDocument();
    });
  });
});
