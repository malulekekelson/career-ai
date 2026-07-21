import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  FileText,
  File,
  User,
  Award,
  TrendingUp,
  Briefcase,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import { projects } from "@/lib/api"

type ProjectData = {
  id: string
  status: string
  createdAt: string
  originalFilename: string
  resume?: {
    content: any
    atsScore: number
    grammarScore: number
    formattingScore: number
    impactScore: number
  }
  coverLetter?: {
    content: string
    fileKey?: string
  }
  linkedin?: {
    headline: string
    summary: string
    experience: any[]
  }
  skillGap?: {
    currentSkills: string[]
    recommendedSkills: string[]
    certifications: string[]
  }
  careerReport?: {
    strengths: string
    weaknesses: string
    opportunities: string
    salary: string
    roadmap: any[]
  }
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("resume")

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await projects.get(id)
        setProject(res.data)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.error || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-500">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <p className="mt-4 text-gray-500">{error || 'Project not found'}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Go back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (project.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusText = () => {
    switch (project.status) {
      case "completed":
        return "Completed"
      case "processing":
        return "Processing..."
      case "failed":
        return "Failed"
      default:
        return "Pending"
    }
  }

  const getStatusColor = () => {
    switch (project.status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Helper to check if data exists
  const hasData = (section: string) => {
    switch (section) {
      case 'resume': return project.resume && project.resume.content
      case 'coverLetter': return project.coverLetter && project.coverLetter.content
      case 'linkedin': return project.linkedin && project.linkedin.headline
      case 'score': return project.resume && project.resume.atsScore !== undefined
      case 'skillGap': return project.skillGap && project.skillGap.currentSkills?.length > 0
      case 'careerReport': return project.careerReport && project.careerReport.strengths
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{project.originalFilename}</h1>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </span>
              <span className="text-sm text-gray-500">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="resume" className="flex items-center" disabled={!hasData('resume')}>
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center" disabled={!hasData('coverLetter')}>
              <File className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Cover Letter</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center" disabled={!hasData('linkedin')}>
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="score" className="flex items-center" disabled={!hasData('score')}>
              <Award className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Score</span>
            </TabsTrigger>
            <TabsTrigger value="skill-gap" className="flex items-center" disabled={!hasData('skillGap')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Skill Gap</span>
            </TabsTrigger>
            <TabsTrigger value="career-report" className="flex items-center" disabled={!hasData('careerReport')}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Career Report</span>
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-4">
            {project.resume && project.resume.content ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">AI-Optimized Resume</h2>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.resume.content.name}</h3>
                    <p className="text-blue-600">{project.resume.content.title}</p>
                    <p className="text-sm text-gray-500">
                      {project.resume.content.email} • {project.resume.content.phone}
                    </p>
                    <p className="text-sm text-gray-500">{project.resume.content.location}</p>
                  </div>
                  {project.resume.content.summary && (
                    <div>
                      <h4 className="font-medium text-gray-700">Professional Summary</h4>
                      <p className="mt-1 text-sm text-gray-600">{project.resume.content.summary}</p>
                    </div>
                  )}
                  {project.resume.content.experience && project.resume.content.experience.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700">Experience</h4>
                      {project.resume.content.experience.map((exp: any, index: number) => (
                        <div key={index} className="mt-3 border-t border-gray-100 pt-3 first:border-t-0">
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                          <p className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</p>
                          {exp.responsibilities && (
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-gray-600">
                              {exp.responsibilities.map((resp: string, i: number) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {project.resume.content.education && project.resume.content.education.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700">Education</h4>
                      {project.resume.content.education.map((edu: any, index: number) => (
                        <div key={index}>
                          <p className="font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-600">{edu.degree}</p>
                          <p className="text-xs text-gray-400">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {project.resume.content.skills && project.resume.content.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700">Skills</h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {project.resume.content.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">Resume not available yet. Processing may still be in progress.</p>
              </div>
            )}
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value="cover-letter" className="space-y-4">
            {project.coverLetter && project.coverLetter.content ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">AI-Generated Cover Letter</h2>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {project.coverLetter.content}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">Cover letter not available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* LinkedIn Tab */}
          <TabsContent value="linkedin" className="space-y-4">
            {project.linkedin && project.linkedin.headline ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">AI-Optimized LinkedIn Profile</h2>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.resume?.content?.name || 'User'}</h3>
                    <p className="text-blue-600">{project.linkedin.headline}</p>
                  </div>
                  {project.linkedin.summary && (
                    <div>
                      <h4 className="font-medium text-gray-700">About</h4>
                      <p className="mt-1 text-sm text-gray-600">{project.linkedin.summary}</p>
                    </div>
                  )}
                  {project.linkedin.experience && project.linkedin.experience.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700">Experience</h4>
                      {project.linkedin.experience.map((exp: any, index: number) => (
                        <div key={index} className="mt-3 border-t border-gray-100 pt-3 first:border-t-0">
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-400">{exp.period}</p>
                          <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">LinkedIn profile not available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Score Tab */}
          <TabsContent value="score" className="space-y-4">
            {project.resume && project.resume.atsScore !== undefined ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Resume Score</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{project.resume.atsScore}%</p>
                    <p className="text-sm text-gray-600">Overall</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{project.resume.grammarScore}%</p>
                    <p className="text-sm text-gray-600">Grammar</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">{project.resume.formattingScore}%</p>
                    <p className="text-sm text-gray-600">Formatting</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">{project.resume.impactScore}%</p>
                    <p className="text-sm text-gray-600">Impact</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">Scores not available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Skill Gap Tab */}
          <TabsContent value="skill-gap" className="space-y-4">
            {project.skillGap && project.skillGap.currentSkills?.length > 0 ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Current Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.skillGap.currentSkills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Recommended Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.skillGap.recommendedSkills?.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {project.skillGap.certifications && project.skillGap.certifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700">Recommended Certifications</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-600">
                      {project.skillGap.certifications.map((cert: string, index: number) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">Skill gap analysis not available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Career Report Tab */}
          <TabsContent value="career-report" className="space-y-4">
            {project.careerReport && project.careerReport.strengths ? (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Career Report</h2>
                <div className="mt-4 space-y-4">
                  {project.careerReport.strengths && (
                    <div>
                      <h3 className="font-medium text-gray-700">Strengths</h3>
                      <p className="mt-1 text-sm text-gray-600">{project.careerReport.strengths}</p>
                    </div>
                  )}
                  {project.careerReport.weaknesses && (
                    <div>
                      <h3 className="font-medium text-gray-700">Weaknesses</h3>
                      <p className="mt-1 text-sm text-gray-600">{project.careerReport.weaknesses}</p>
                    </div>
                  )}
                  {project.careerReport.opportunities && (
                    <div>
                      <h3 className="font-medium text-gray-700">Opportunities</h3>
                      <p className="mt-1 text-sm text-gray-600">{project.careerReport.opportunities}</p>
                    </div>
                  )}
                  {project.careerReport.salary && (
                    <div>
                      <h3 className="font-medium text-gray-700">Salary Estimate</h3>
                      <p className="mt-1 text-sm text-gray-600">{project.careerReport.salary}</p>
                    </div>
                  )}
                  {project.careerReport.roadmap && project.careerReport.roadmap.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700">Career Roadmap</h3>
                      <div className="mt-2 space-y-2">
                        {project.careerReport.roadmap.map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.stage}</p>
                              <p className="text-sm text-gray-500">{item.timeframe}</p>
                              {item.skills && <p className="text-sm text-gray-600">Skills: {item.skills.join(", ")}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">Career report not available yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProjectDetail