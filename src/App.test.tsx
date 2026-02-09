import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import App from './App'

// Mock the guestbook service to avoid Firebase dependency
vi.mock('./services/guestbook', () => ({
  getMessages: vi.fn().mockRejectedValue(new Error('Firebase not configured')),
  addMessage: vi.fn().mockResolvedValue({
    id: 'test-id',
    name: 'Test',
    passwordHash: '',
    message: 'Test message',
    createdAt: new Date(),
  }),
  deleteMessage: vi.fn().mockResolvedValue(true),
}))

// Mock the RSVP service
vi.mock('./services/rsvp', () => ({
  submitRsvp: vi.fn().mockResolvedValue({
    id: 'test-rsvp-id',
    name: 'Test',
    phone: '010-1234-5678',
    attending: true,
    guestCount: 1,
    createdAt: new Date(),
  }),
}))

describe('App', () => {
  it('renders the wedding invitation header', async () => {
    await act(async () => {
      render(<App />)
    })
    
    // Wait for the app to finish loading
    await waitFor(() => {
      expect(screen.getByText('WEDDING INVITATION')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('renders all main sections', async () => {
    await act(async () => {
      render(<App />)
    })
    
    // Wait for the app to finish loading
    await waitFor(() => {
      expect(screen.getByText('예식 안내')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Check for section titles (using actual component titles)
    expect(screen.getByText('갤러리')).toBeInTheDocument()
    expect(screen.getByText('마음 전하실 곳')).toBeInTheDocument()
    expect(screen.getByText('방명록')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '참석 여부' })).toBeInTheDocument()
    expect(screen.getByText('공유하기')).toBeInTheDocument()
  })

  it('renders the couple info section with greeting', async () => {
    await act(async () => {
      render(<App />)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/서로 다른 두 사람이 만나/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('renders the event info with date and venue', async () => {
    await act(async () => {
      render(<App />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('더채플앳청담')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(screen.getByText('그랜드볼룸 3층')).toBeInTheDocument()
  })

  it('renders the footer with couple names', async () => {
    await act(async () => {
      render(<App />)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/© 2025 모바일 청첩장/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
