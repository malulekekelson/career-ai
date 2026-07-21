import { Link } from "react-router-dom"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const Projects = () => {
  // Mock data - will be replaced with real API calls
  const projects = [
    { id: "1", title: "Software Engineer Resume", status: "completed", date: "2026-07-21", score: 92 },
    { id: "2", title: "Full Stack Developer", status: "processing", date: "2026-07-20", score: null },
    { id: "3", title: "Cloud Engineer Application", status: "completed", date: "2026-07-19", score: 87 },
  ]

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

        <div className="mt-6 space-y-3">
          {projects.map((project) => (
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
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500">
                      {project.date}
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
                    </p>
                  </div>
                </div>
                {project.score && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{project.score}%</p>
                    <p className="text-xs text-gray-500">ATS Score</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects