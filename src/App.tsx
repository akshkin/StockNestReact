import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './routes/layout/Layout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<h1>Home</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/register" element={<h1>Register</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
