import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Auth from './pages/Auth.jsx'
import EmployeeSetupAccount from './pages/EmployeeSetupAccount.jsx'
import '@ant-design/v5-patch-for-react-19';
import socket from './services/socketService.js';

socket.on("connect", () => { });

socket.on("disconnect", () => { });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/employee-setup-account" element={<EmployeeSetupAccount />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
