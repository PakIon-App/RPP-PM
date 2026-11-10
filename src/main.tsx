// Safely handle environments where window.fetch has only a getter
try {
  const origFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() { return origFetch; },
    set(val) {
      if (typeof val === 'function') {
        // allow updating local reference if needed
      }
    },
    configurable: true,
    enumerable: true
  });
} catch {
  // ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
