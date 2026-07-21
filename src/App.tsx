import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import ProjectDetail from "./pages/ProjectDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App