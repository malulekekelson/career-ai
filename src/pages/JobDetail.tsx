import { useParams, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, Award, Briefcase, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data – will be replaced with real API calls
const mockJobDetails: Record<string, any> = {
  "0": {
    id: "0",
    title: "Backend Engineer",
    company: "Amazon",
    location: "Cape Town, SA",
    match: 93,
    salary: "R65,000 - R85,000 per month",
    description: "Build and maintain scalable backend services using Node.js and AWS.",
    strengths: [
      "Strong Node.js experience (4+ years)",
      "Good understanding of RESTful APIs",
      "Experience with AWS services (S3, Lambda)",
    ],
    missingSkills: ["Docker", "Kubernetes", "Redis"],
    recommendedActions: [
      "Get Docker Certified",
      "Build a sample project using Redis",
      "Learn Kubernetes basics",
    ],
  },
  "1": {
    id: "1",
    title: "Software Engineer",
    company: "Google",
    location: "Johannesburg, SA",
    match: 90,
    salary: "R70,000 - R90,000 per month",
    description: "Design and develop innovative software solutions across multiple platforms.",
    strengths: [
      "Strong problem-solving skills",
      "Excellent TypeScript knowledge",
      "Experience with cloud infrastructure",
    ],
    missingSkills: ["Go", "GraphQL", "Distributed Systems"],
    recommendedActions: [
      "Learn Go programming language",
      "Study GraphQL fundamentals",
      "Build a distributed system demo",
    ],
  },
  "2": {
    id: "2",
    title: "Cloud Engineer",
    company: "Microsoft",
    location: "Remote (South Africa)",
    match: 84,
    salary: "R60,000 - R80,000 per month",
    description: "Design, implement, and manage cloud infrastructure on Azure.",
    strengths: [
      "Solid understanding of cloud concepts",
      "Experience with serverless technologies",
      "Good scripting skills",
    ],
    missingSkills: ["Azure", "Terraform", "CI/CD Pipelines"],
    recommendedActions: [
      "Get Azure Fundamentals certified",
      "Learn Terraform for IaC",
      "Build a CI/CD pipeline",
    ],
  },
  "3": {
    id: "3",
    title: "Full Stack Developer",
    company: "Spotify",
    location: "Cape Town, SA",
    match: 78,
    salary: "R55,000 - R75,000 per month",
    description: "Build engaging user experiences and robust backend services.",
    strengths: [
      "Good React and Node.js skills",
      "Understanding of databases",
      "Agile methodology experience",
    ],
    missingSkills: ["Next.js", "GraphQL", "Docker", "CI/CD"],
    recommendedActions: [
      "Build a Next.js project",
      "Learn GraphQL with Apollo",
      "Containerize applications with Docker",
    ],
  },
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const job = mockJobDetails[id || "0"]

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">Job not found</p>
          <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to Job Matches
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/jobs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job Matches
        </Link>

        {/* Header */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-lg text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">{job.match}%</p>
              <p className="text-sm text-gray-500">Match Score</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">{job.description}</p>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">{job.salary}</span>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Strengths</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {job.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="mt-1 text-green-500">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Missing Skills</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {job.missingSkills.map((skill: string, index: number) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="mt-1 text-red-500">✗</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recommended Actions</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {job.recommendedActions.map((action: string, index: number) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="mt-1 text-blue-500">{index + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Briefcase className="mr-2 h-4 w-4" />
            Apply Now (Coming Soon)
          </Button>
          <Button variant="outline">
            <Award className="mr-2 h-4 w-4" />
            Generate Optimized Resume
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobDetail