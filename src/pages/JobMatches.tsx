import { Link } from "react-router-dom"
import { ArrowLeft, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

const JobMatches = () => {
  // Mock data – will be replaced with real API calls
  const matches = [
    { id: "0", title: "Backend Engineer", company: "Amazon", match: 93 },
    { id: "1", title: "Software Engineer", company: "Google", match: 90 },
    { id: "2", title: "Cloud Engineer", company: "Microsoft", match: 84 },
    { id: "3", title: "Full Stack Developer", company: "Spotify", match: 78 },
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

        <h1 className="mt-4 text-3xl font-bold text-gray-900">Job Matches</h1>
        <p className="mt-1 text-gray-500">
          AI-powered job recommendations based on your resume.
        </p>

        <div className="mt-6 space-y-4">
          {matches.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-green-600">
                  {job.match}% match
                </span>
                <Link to={`/job/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobMatches