# 🚀 접근성 친화적 모달폼 구현

## 🛠 기술 스택

- **Vite** (빌드 도구)
- **Bun** (패키지 매니저)
- **Tailwind CSS** (스타일링)
- **react-hook-form** + **zod** (폼 관리 및 유효성 검사)
- **Biome** (린터/포매터)

## 🎯 구현 완료 사항

### ✅ 기본 모달 기능
- [x] **모달 닫기**: ESC 키 입력 또는 바깥 영역(overlay) 클릭 시 모달 닫기
- [x] **선언적 호출**: `const result = await openFormModal()` 형태로 사용 가능
- [x] **데이터 반환**: 제출 완료 시 입력값 반환, 취소/닫기 시 `null` 반환

### ✅ 포커스 관리
- [x] **포커스 이동**: 모달 열림 시 제목 요소로 포커스 이동
- [x] **포커스 복귀**: 모달 닫힘 시 트리거 버튼으로 포커스 복귀
- [x] **포커스 트랩**: Tab/Shift+Tab 키로 모달 내부에서만 포커스 순환

### ✅ 폼 사용성
- [x] **키보드 접근성**: 키보드만으로 입력하고 제출 가능
- [x] **유효성 검증**: 실패 시 오류 메시지 표시
- [x] **스크린리더 지원**: `role="alert"`로 오류 메시지 즉시 전달
- [x] **이메일 검증**: zod를 활용한 이메일 유효성 검사 포함

### ✅ UI/UX
- [x] **배경 스크롤 방지**: 모달 열림 시 배경 스크롤 비활성화
- [x] **내부 스크롤**: 모달 내용이 길어져도 내부에서 스크롤 가능
- [x] **애니메이션**: `prefers-reduced-motion` 설정 고려한 부드러운 애니메이션

### ✅ 접근성 (고도화)
- [x] **동적 ARIA 속성**: 컴파운드 컴포넌트를 통한 자동 `aria-labelledby`, `aria-describedby` 연결
- [x] **의미론적 구조**: `Modal.Title`, `Modal.Description` 등으로 명확한 구조 제공
- [x] **타입 안전성**: 완전한 TypeScript 지원

## 💡 고민했던 부분

### 접근성을 위한 컴파운드 컴포넌트 패턴 도입
처음에는 `createPortal`로 단순한 Modal 컴포넌트를 구현했었습니다. 하지만 접근성 ARIA 속성들(`aria-labelledby`, `aria-describedby`)을 관리하기 어려운 문제가 있었습니다:

**기존 방식의 문제점:**
```tsx
// AS-IS : 하드코딩으로 적용했던 접근성 속성
<div aria-labelledby="modal-title" aria-describedby="modal-description">
  <h2 id="modal-title">제목</h2>  // 모든 모달이 같은 ID 사용
  <p id="modal-description">설명</p>
</div>
```

**컴파운드 컴포넌트 패턴으로 개선:**
```tsx
// TO-BE : 컴파운트 패턴을 통해 접근성을 FormModal을 구현할 때 주입할 수 있음.
<Modal.Root>
  <Modal.Content>
    <Modal.Title>{'제목이 들어갈 부분'}</Modal.Title>
    <Modal.Description visuallyHidden>
      {'내용이 들어갈 부분'}
    </Modal.Description>
  </Modal.Content>
</Modal.Root>
```

### Modal 관련 훅 분리
비즈니스 로직을 재사용 가능한 hooks로 분리했습니다:

```tsx
// useModalBehavior: 모달의 동작 관리
export function useModalBehavior(isOpen: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalStore.closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return { overlayRef, contentRef, handleOverlayClick };
}

// useModalFocus: 포커스 관리
export function useModalFocus(isOpen: boolean, contentRef: RefObject<HTMLDivElement>, titleId?: string) {
  useEffect(() => {
    if (!isOpen) return;

    // 모달 열림 시 제목으로 포커스 이동
    const titleElement = titleId ? document.getElementById(titleId) : null;
    if (titleElement) {
      titleElement.setAttribute('tabindex', '-1');
      titleElement.focus();
    }
  }, [isOpen, titleId]);
}
```

### Modal Store

타입 안전한 제네릭 store로 다양한 모달 타입을 지원합니다:

```tsx
// AS-IS: FormData에 종속된 기존 방식
interface ModalState {
  isOpen: boolean;
  resolver: ((value: FormData | null) => void) | null;  // FormData 하드코딩
}

// TO-BE: 제네릭으로 개선된 방식
interface ModalState<T = unknown> {
  isOpen: boolean;
  resolver: ((value: T | null) => void) | null;
  triggerElement: HTMLElement | null; 
}

// 사용
export const modalStore = {
  openModal: <T>(modalId: string, triggerElement?: HTMLElement): Promise<T | null> => {
    return new Promise((resolve) => {
      state = { isOpen: true, modalId, resolver: resolve, triggerElement };
    });
  },
};

// 타입 안전한 사용
const formResult = await modalStore.openModal<FormData>('form-modal', button);
const confirmResult = await modalStore.openModal<boolean>('confirm-modal', button);
```

## 📁 프로젝트 구조

```
src/
├── features/apply-form/          # 신청 폼 기능
│   ├── model/schema.ts          # zod 스키마 + openFormModal API
│   └── ui/apply-form-modal.tsx  # 컴파운드 컴포넌트 활용 모달
├── shared/
│   ├── stores/modal-store.ts    # 제네릭 모달 상태 관리
│   ├── hooks/                   # 재사용 가능한 custom hooks
│   ├── ui/
│   │   ├── modal/              # 컴파운드 모달 컴포넌트들
│   │   ├── form-input.tsx      # react-hook-form 통합 입력
│   │   └── form-select.tsx     # react-hook-form 통합 선택
│   └── constants/options.ts    # 선택 옵션 상수
└── ModalFormPage.tsx           # 메인 페이지
```

## 🚀 실행 방법

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# 코드 검사
bun run check
```

## 📋 폼 필드

- **이름 / 닉네임** (필수)
- **이메일** (필수, 형식 검증)
- **FE 경력 연차** (필수, 선택형)
- **Github 링크** (선택, URL 형식 검증)
