import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import ProjectDetail from "./pages/ProjectDetail"
import Projects from "./pages/Projects"
import JobMatches from "./pages/JobMatches"
import JobDetail from "./pages/JobDetail" 
import InterviewCoach from "./pages/InterviewCoach"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/jobs" element={<JobMatches />} />
        <Route path="/job/:id" element={<JobDetail />} /> 
        <Route path="/interview" element={<InterviewCoach />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App