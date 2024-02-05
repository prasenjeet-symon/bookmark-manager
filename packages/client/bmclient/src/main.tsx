window.global ||= window;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApplicationToken } from './datasource/http/http.manager.ts';

ApplicationToken.getInstance().bootUp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
