import { useSyncExternalStore } from 'react';

interface ModalState<T = unknown> {
  isOpen: boolean;
  modalId: string | null;
  resolver: ((value: T | null) => void) | null;
  triggerElement: HTMLElement | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalId: null,
  resolver: null,
  triggerElement: null,
};

let state = initialState;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export const modalStore = {
  getSnapshot: () => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  openModal: <T>(modalId: string, triggerElement?: HTMLElement): Promise<T | null> => {
    return new Promise((resolve) => {
      state = {
        isOpen: true,
        modalId,
        resolver: resolve as (value: unknown | null) => void,
        triggerElement: triggerElement || document.activeElement as HTMLElement,
      };
      notifyListeners();
    });
  },

  closeModal: () => {
    if (state.resolver) {
      state.resolver(null);
    }

    const triggerElement = state.triggerElement;
    if (triggerElement && document.contains(triggerElement)) {
      setTimeout(() => triggerElement.focus(), 0);
    }

    state = initialState;
    notifyListeners();
  },

  resolveModal: <T>(data: T) => {
    if (state.resolver) {
      state.resolver(data);
    }

    const triggerElement = state.triggerElement;
    if (triggerElement && document.contains(triggerElement)) {
      setTimeout(() => triggerElement.focus(), 0);
    }

    state = initialState;
    notifyListeners();
  },
};

export function useModalStore() {
  return useSyncExternalStore(modalStore.subscribe, modalStore.getSnapshot);
}