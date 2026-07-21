import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, FileText, Loader2 } from "lucide-react"
import { projects as api } from "@/lib/api"

interface Project {
  id: string
  status: string
  createdAt: string
  originalFilename: string
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.list()
        setProjects(res.data)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.error || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">My Projects</h1>
        <p className="mt-1 text-gray-500">View all your AI-optimized resumes and career reports.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {projects.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your first CV to get started.</p>
              <Link to="/upload">
                <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Upload CV
                </button>
              </Link>
            </div>
          ) : (
            projects.map((project) => (
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
                        {project.status === "processing" && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Processing
                          </span>
                        )}
                        {project.status === "completed" && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        )}
                        {project.status === "pending" && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Pending
                          </span>
                        )}
                        {project.status === "failed" && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Failed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {project.status === "completed" && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">--%</p>
                      <p className="text-xs text-gray-500">ATS Score</p>
                    </div>
                  )}
                  {project.status === "processing" && (
                    <div className="text-right">
                      <div className="h-2 w-16 animate-pulse rounded-full bg-yellow-200" />
                      <p className="mt-1 text-xs text-gray-500">Analyzing...</p>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects