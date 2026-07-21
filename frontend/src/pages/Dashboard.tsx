import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Upload,
  FileText,
  Briefcase,
  Settings,
  User,
  ChevronRight,
  PlusCircle,
  Loader2,
} from 'lucide-react'
import { projects } from '@/lib/api'

interface Project {
  id: string
  title: string // We'll use originalFilename as title
  status: string
  createdAt: string
  originalFilename: string
}

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [projectList, setProjectList] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, completed: 0, processing: 0 })

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await projects.list()
        const data = res.data
        setProjectList(data)
        const total = data.length
        const completed = data.filter((p: any) => p.status === 'completed').length
        const processing = data.filter((p: any) => p.status === 'processing' || p.status === 'pending').length
        setStats({ total, completed, processing })
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Compute average score from completed projects (mock for now – we'll get from API later)
  const avgScore = projectList.length > 0 ? 85 : 0 // placeholder

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar – same as before, but use user name */}
      <aside className="hidden w-64 bg-white shadow-md lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold text-blue-600">CareerAI</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link to="/" className="flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/upload" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <Upload className="mr-3 h-5 w-5" />
              Upload CV
            </Link>
            <Link to="/projects" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <FileText className="mr-3 h-5 w-5" />
              My Projects
            </Link>
            <Link to="/jobs" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <Briefcase className="mr-3 h-5 w-5" />
              Job Matches
            </Link>
          </nav>

          <div className="border-t px-3 py-4">
            <div className="flex items-center rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
            <Link to="/settings" className="mt-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="mt-1 text-gray-500">
                Here's what's happening with your career journey.
              </p>
            </div>
            <Link to="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload New CV
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Resume Score</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{avgScore}%</p>
              <p className="mt-1 text-xs text-gray-500">Overall average</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Projects</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">{stats.processing} in progress</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Credits</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">5</p>
              <p className="mt-1 text-xs text-gray-500">Free tier</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Job Matches</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Coming soon</p>
            </div>
          </div>

          {/* Recent projects */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-500">
                View all
                <ChevronRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : projectList.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Upload your first CV to get started.</p>
                <Link to="/upload">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Upload CV</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projectList.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    className="block rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{project.originalFilename}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(project.createdAt).toLocaleDateString()}
                            {project.status === 'processing' && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Processing
                              </span>
                            )}
                            {project.status === 'completed' && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Completed
                              </span>
                            )}
                            {project.status === 'pending' && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                Pending
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      {project.status === 'completed' && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">85%</p>
                          <p className="text-xs text-gray-500">ATS Score</p>
                        </div>
                      )}
                      {project.status === 'processing' && (
                        <div className="text-right">
                          <div className="h-2 w-16 animate-pulse rounded-full bg-yellow-200" />
                          <p className="mt-1 text-xs text-gray-500">Analyzing...</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick action cards – same as before */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/upload" className="rounded-lg border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 font-medium text-gray-700">Upload CV</p>
              <p className="text-sm text-gray-500">Get AI analysis</p>
            </Link>
            <Link to="/projects" className="rounded-lg border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <FileText className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 font-medium text-gray-700">My Resumes</p>
              <p className="text-sm text-gray-500">View all versions</p>
            </Link>
            <Link to="/jobs" className="rounded-lg border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 font-medium text-gray-700">Job Matches</p>
              <p className="text-sm text-gray-500">Find your fit</p>
            </Link>
            <Link to="/interview" className="rounded-lg border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <User className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 font-medium text-gray-700">AI Coach</p>
              <p className="text-sm text-gray-500">Practice interviews</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard