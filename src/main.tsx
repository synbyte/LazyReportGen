import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Analytics } from "@vercel/analytics/react"
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics/>
    <App />   
  </StrictMode>
);
