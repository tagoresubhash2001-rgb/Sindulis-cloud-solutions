import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './lib/firebase';

// The ERP is a separate lazy-loaded bundle so the public site stays lean.
const ErpApp = lazy(() => import('./erp/routes/ErpApp'));

const ErpFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-500">
    Loading SINDULIS ERP…
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/erp/*"
          element={
            <Suspense fallback={<ErpFallback />}>
              <ErpApp />
            </Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
