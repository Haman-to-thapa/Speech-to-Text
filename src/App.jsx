
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './Layout/Layout'
import Login from './auth/Login'
import Register from './auth/Register'
import ProtectedRoute from './auth/ProtectedRoute'

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path="*" element={<Navigate to={token ? <Layout /> : <Login />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App