import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import TasksPage from './pages/Tasks'
import WalletPage from './pages/WalletPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path='/chat' element={<ChatPage/>} />
      <Route path='/tasks' element={<TasksPage/>} />
      <Route path='/wallet' element={<WalletPage/>} />
    </Routes>
  )
}