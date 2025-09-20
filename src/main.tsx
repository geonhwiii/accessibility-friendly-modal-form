import 'modern-normalize';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ModalFormPage from './ModalFormPage';
import './globals.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ModalFormPage />
  </StrictMode>,
);
