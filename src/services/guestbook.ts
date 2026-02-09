/**
 * 방명록 CRUD 서비스
 * 
 * Firebase Firestore를 사용하여 방명록 메시지를 관리합니다.
 * 
 * Requirements:
 * - 6.1: 방명록 섹션이 로드되면 기존에 작성된 축하 메시지 목록을 표시한다
 * - 6.2: 사용자가 이름, 비밀번호, 메시지를 입력하고 등록 버튼을 클릭하면 새 축하 메시지를 저장하고 목록에 추가한다
 * - 6.4: 사용자가 자신의 메시지 삭제를 요청하고 올바른 비밀번호를 입력하면 해당 메시지를 삭제한다
 * - 10.1: 방명록 메시지를 영구 저장소에 저장한다
 * 
 * Firestore Structure:
 * /weddings/{weddingId}/guestbook/{messageId}: GuestbookMessage
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreInstance, COLLECTIONS } from '../lib/firebase';
import { hashPassword, verifyPassword } from '../utils/password';
import type { GuestbookMessage, GuestbookInput } from '../types';

/**
 * 방명록 메시지 목록을 조회합니다.
 * 
 * @param weddingId - 청첩장 ID
 * @returns Promise<GuestbookMessage[]> - 방명록 메시지 목록 (작성일 내림차순)
 * @throws Error - Firestore가 초기화되지 않았거나 조회 실패 시
 * 
 * **Validates: Requirements 6.1**
 * 
 * @example
 * const messages = await getMessages('wedding123');
 * // Returns: [{ id: '...', name: '홍길동', message: '축하합니다!', ... }, ...]
 */
export async function getMessages(weddingId: string): Promise<GuestbookMessage[]> {
  const db = getFirestoreInstance();
  
  if (!db) {
    throw new Error('Firebase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.');
  }

  try {
    // 방명록 컬렉션 참조 생성
    const guestbookRef = collection(
      db,
      COLLECTIONS.WEDDINGS,
      weddingId,
      COLLECTIONS.GUESTBOOK
    );

    // 작성일 내림차순으로 정렬하여 조회
    const q = query(guestbookRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    // Firestore 문서를 GuestbookMessage 형태로 변환
    const messages: GuestbookMessage[] = querySnapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name,
        passwordHash: data.passwordHash,
        message: data.message,
        // Firestore Timestamp를 Date로 변환
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt),
      };
    });

    return messages;
  } catch (error) {
    console.error('방명록 메시지 조회 실패:', error);
    throw new Error('방명록 메시지를 불러오는데 실패했습니다.');
  }
}

/**
 * 새 방명록 메시지를 추가합니다.
 * 
 * 비밀번호는 SHA-256으로 해싱되어 저장됩니다.
 * 
 * @param weddingId - 청첩장 ID
 * @param input - 방명록 입력 데이터 (이름, 비밀번호, 메시지)
 * @returns Promise<GuestbookMessage> - 저장된 방명록 메시지
 * @throws Error - Firestore가 초기화되지 않았거나 저장 실패 시
 * 
 * **Validates: Requirements 6.2, 10.1**
 * 
 * @example
 * const newMessage = await addMessage('wedding123', {
 *   name: '홍길동',
 *   password: '1234',
 *   message: '결혼을 진심으로 축하합니다!'
 * });
 */
export async function addMessage(
  weddingId: string,
  input: GuestbookInput
): Promise<GuestbookMessage> {
  const db = getFirestoreInstance();
  
  if (!db) {
    throw new Error('Firebase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.');
  }

  try {
    // 비밀번호 해싱
    const passwordHash = await hashPassword(input.password);

    // 저장할 데이터 준비
    const messageData = {
      name: input.name.trim(),
      passwordHash,
      message: input.message.trim(),
      createdAt: Timestamp.now(),
    };

    // 방명록 컬렉션 참조 생성
    const guestbookRef = collection(
      db,
      COLLECTIONS.WEDDINGS,
      weddingId,
      COLLECTIONS.GUESTBOOK
    );

    // Firestore에 문서 추가
    const docRef = await addDoc(guestbookRef, messageData);

    // 저장된 메시지 반환
    const savedMessage: GuestbookMessage = {
      id: docRef.id,
      name: messageData.name,
      passwordHash: messageData.passwordHash,
      message: messageData.message,
      createdAt: messageData.createdAt.toDate(),
    };

    return savedMessage;
  } catch (error) {
    console.error('방명록 메시지 저장 실패:', error);
    throw new Error('방명록 메시지를 저장하는데 실패했습니다.');
  }
}

/**
 * 방명록 메시지를 삭제합니다.
 * 
 * 비밀번호 검증 후 일치하는 경우에만 삭제를 수행합니다.
 * 
 * @param weddingId - 청첩장 ID
 * @param messageId - 삭제할 메시지 ID
 * @param password - 메시지 작성 시 입력한 비밀번호
 * @returns Promise<boolean> - 삭제 성공 여부
 * @throws Error - Firestore가 초기화되지 않았거나, 메시지를 찾을 수 없거나, 비밀번호가 일치하지 않는 경우
 * 
 * **Validates: Requirements 6.4**
 * 
 * @example
 * try {
 *   const success = await deleteMessage('wedding123', 'message456', '1234');
 *   if (success) {
 *     console.log('메시지가 삭제되었습니다.');
 *   }
 * } catch (error) {
 *   console.error(error.message); // '비밀번호가 일치하지 않습니다.'
 * }
 */
export async function deleteMessage(
  weddingId: string,
  messageId: string,
  password: string
): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    throw new Error('Firebase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.');
  }

  try {
    // 먼저 메시지 목록을 조회하여 해당 메시지의 비밀번호 해시를 가져옴
    const messages = await getMessages(weddingId);
    const targetMessage = messages.find((msg) => msg.id === messageId);

    if (!targetMessage) {
      throw new Error('메시지를 찾을 수 없습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, targetMessage.passwordHash);

    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 메시지 문서 참조 생성
    const messageRef = doc(
      db,
      COLLECTIONS.WEDDINGS,
      weddingId,
      COLLECTIONS.GUESTBOOK,
      messageId
    );

    // Firestore에서 문서 삭제
    await deleteDoc(messageRef);

    return true;
  } catch (error) {
    // 이미 처리된 에러는 그대로 전달
    if (error instanceof Error) {
      if (
        error.message === '메시지를 찾을 수 없습니다.' ||
        error.message === '비밀번호가 일치하지 않습니다.'
      ) {
        throw error;
      }
    }
    
    console.error('방명록 메시지 삭제 실패:', error);
    throw new Error('방명록 메시지를 삭제하는데 실패했습니다.');
  }
}
