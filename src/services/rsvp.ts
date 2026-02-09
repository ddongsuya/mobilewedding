/**
 * RSVP 서비스
 * 
 * Firebase Firestore를 사용하여 RSVP 응답을 관리합니다.
 * 
 * Requirements:
 * - 7.2: 사용자가 이름, 연락처, 참석 여부, 참석 인원을 입력하고 제출하면 응답을 저장한다
 * - 10.2: RSVP 응답을 영구 저장소에 저장한다
 * 
 * Firestore Structure:
 * /weddings/{weddingId}/rsvp/{responseId}: RsvpResponse
 */

import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreInstance, COLLECTIONS } from '../lib/firebase';
import type { RsvpResponse, RsvpInput } from '../types';

/**
 * RSVP 응답을 제출합니다.
 * 
 * @param weddingId - 청첩장 ID
 * @param input - RSVP 입력 데이터 (이름, 연락처, 참석 여부, 참석 인원, 식사 참석 여부, 메시지)
 * @returns Promise<RsvpResponse> - 저장된 RSVP 응답
 * @throws Error - Firestore가 초기화되지 않았거나 저장 실패 시
 * 
 * **Validates: Requirements 7.2, 10.2**
 * 
 * @example
 * const response = await submitRsvp('wedding123', {
 *   name: '홍길동',
 *   phone: '010-1234-5678',
 *   attending: true,
 *   guestCount: 2,
 *   mealAttending: true,
 *   message: '축하드립니다!'
 * });
 */
export async function submitRsvp(
  weddingId: string,
  input: RsvpInput
): Promise<RsvpResponse> {
  const db = getFirestoreInstance();
  
  if (!db) {
    throw new Error('Firebase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.');
  }

  try {
    // 저장할 데이터 준비
    const rsvpData: {
      name: string;
      phone: string;
      attending: boolean;
      guestCount: number;
      mealAttending?: boolean;
      message?: string;
      createdAt: Timestamp;
    } = {
      name: input.name.trim(),
      phone: input.phone.trim(),
      attending: input.attending,
      guestCount: input.guestCount,
      createdAt: Timestamp.now(),
    };

    // 선택적 필드 추가 (undefined가 아닌 경우에만)
    if (input.mealAttending !== undefined) {
      rsvpData.mealAttending = input.mealAttending;
    }

    if (input.message !== undefined && input.message.trim() !== '') {
      rsvpData.message = input.message.trim();
    }

    // RSVP 컬렉션 참조 생성
    const rsvpRef = collection(
      db,
      COLLECTIONS.WEDDINGS,
      weddingId,
      COLLECTIONS.RSVP
    );

    // Firestore에 문서 추가
    const docRef = await addDoc(rsvpRef, rsvpData);

    // 저장된 응답 반환
    const savedResponse: RsvpResponse = {
      id: docRef.id,
      name: rsvpData.name,
      phone: rsvpData.phone,
      attending: rsvpData.attending,
      guestCount: rsvpData.guestCount,
      createdAt: rsvpData.createdAt.toDate(),
    };

    // 선택적 필드 추가
    if (rsvpData.mealAttending !== undefined) {
      savedResponse.mealAttending = rsvpData.mealAttending;
    }

    if (rsvpData.message !== undefined) {
      savedResponse.message = rsvpData.message;
    }

    return savedResponse;
  } catch (error) {
    console.error('RSVP 응답 저장 실패:', error);
    throw new Error('RSVP 응답을 저장하는데 실패했습니다.');
  }
}
