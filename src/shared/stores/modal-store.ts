import { useSyncExternalStore } from 'react';

interface ModalState {
  isOpen: boolean;
  modalId: string | null;
  resolver: ((value: any) => void) | null;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialState: ModalState = {
  isOpen: false,
  modalId: null,
  resolver: null,
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

  openModal: (modalId: string): Promise<FormData | null> => {
    return new Promise((resolve) => {
      state = {
        isOpen: true,
        modalId,
        resolver: resolve,
      };
      notifyListeners();
    });
  },

  
  closeModal: () => {
    if (state.resolver) {
      state.resolver(null);
    }
    state = initialState;
    notifyListeners();
  },

  
  resolveModal: (data: FormData) => {
    if (state.resolver) {
      state.resolver(data);
    }
    state = initialState;
    notifyListeners();
  },
};

export function useModalStore() {
  return useSyncExternalStore(modalStore.subscribe, modalStore.getSnapshot);
}

export async function openFormModal(): Promise<FormData | null> {
  return modalStore.openModal('form-modal');
}