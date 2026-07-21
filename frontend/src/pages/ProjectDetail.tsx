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

// Mock data - will be replaced with real API calls
const mockProjectData = {
  id: "1",
  title: "Software Engineer Resume",
  status: "completed", // "pending" | "processing" | "completed" | "failed"
  createdAt: "2026-07-21T10:30:00Z",
  resume: {
    content: {
      name: "Kelson Maluleke",
      title: "Intermediate Full Stack Developer",
      email: "malulekekelson@gmail.com",
      phone: "+27 82 123 4567",
      location: "Gauteng, South Africa",
      summary: "Results-driven Full Stack Developer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and Cloudflare. Passionate about creating elegant solutions to complex problems.",
      experience: [
        {
          company: "AIE",
          title: "Intermediate Full Stack Developer",
          location: "Gauteng",
          startDate: "2023-01",
          endDate: "Present",
          responsibilities: [
            "Developed and maintained full-stack applications using React and Node.js",
            "Implemented RESTful APIs and integrated third-party services",
            "Collaborated with cross-functional teams in Agile environment",
            "Optimized application performance and improved load times by 40%"
          ]
        },
        {
          company: "Pargo",
          title: "Junior Developer",
          location: "Cape Town",
          startDate: "2021-06",
          endDate: "2022-12",
          responsibilities: [
            "Built responsive web interfaces using React and TypeScript",
            "Integrated analytics dashboard for real-time data visualization",
            "Maintained and improved existing codebase"
          ]
        }
      ],
      education: [
        {
          institution: "University of Johannesburg",
          degree: "BSc Computer Science",
          year: "2021"
        }
      ],
      skills: ["React", "Node.js", "TypeScript", "Cloudflare Workers", "PostgreSQL", "AWS", "Git", "Docker"]
    },
    atsScore: 92,
    grammarScore: 98,
    formattingScore: 88,
    impactScore: 94
  },
  coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Engineer position at your company. With 4+ years of experience in full-stack development and a passion for creating innovative solutions, I am confident in my ability to contribute to your team.\n\nIn my current role at AIE, I have developed and maintained scalable web applications using React and Node.js. I have implemented RESTful APIs, integrated third-party services, and collaborated with cross-functional teams in an Agile environment. My work has resulted in a 40% improvement in application performance and enhanced user satisfaction.\n\nPreviously at Pargo, I built responsive web interfaces and integrated analytics dashboards, gaining valuable experience in data visualization and user-centric design.\n\nI am excited about the opportunity to bring my technical expertise and problem-solving skills to your company. I look forward to discussing how I can contribute to your team's success.\n\nThank you for your consideration.\n\nSincerely,\nKelson Maluleke",
  linkedin: {
    headline: "Intermediate Full Stack Developer | React | Node.js | Cloudflare",
    summary: "Passionate Full Stack Developer with 4+ years of experience building scalable web applications. Specialized in React, Node.js, and Cloudflare Workers. Committed to delivering high-quality, user-centric solutions.",
    experience: [
      {
        title: "Intermediate Full Stack Developer",
        company: "AIE",
        period: "2023 - Present",
        description: "Developing and maintaining full-stack applications using React and Node.js. Implementing RESTful APIs and optimizing performance."
      },
      {
        title: "Junior Developer",
        company: "Pargo",
        period: "2021 - 2022",
        description: "Built responsive web interfaces using React and TypeScript. Integrated analytics dashboard for real-time data visualization."
      }
    ]
  },
  skillGap: {
    currentSkills: ["React", "Node.js", "TypeScript", "Cloudflare Workers", "PostgreSQL", "AWS", "Git", "Docker"],
    recommendedSkills: ["Kubernetes", "Terraform", "Redis", "RabbitMQ", "GraphQL", "Next.js", "Go", "Python"],
    certifications: ["AWS Certified Developer", "Docker Certified Associate", "Kubernetes Administrator"]
  },
  careerReport: {
    strengths: "Strong technical foundation in full-stack development with React and Node.js. Excellent problem-solving skills and ability to work in Agile teams. Good understanding of cloud architecture and serverless technologies.",
    weaknesses: "Limited experience with container orchestration (Kubernetes) and infrastructure as code (Terraform). Could benefit from deeper knowledge of distributed systems and microservices architecture.",
    opportunities: "Growing demand for cloud-native developers in South Africa. Opportunity to transition into DevOps or Solutions Architecture roles. Potential to lead development teams or become a technical mentor.",
    salary: "R55,000 - R75,000 per month (based on South African market rates for Intermediate Full Stack Developers)",
    roadmap: [
      {
        stage: "Junior Developer",
        timeframe: "0-2 years",
        skills: ["Core JavaScript", "HTML/CSS", "Basic React", "Git"]
      },
      {
        stage: "Intermediate Developer",
        timeframe: "2-4 years",
        skills: ["Advanced React", "Node.js", "Database Design", "Cloud Services"]
      },
      {
        stage: "Senior Developer",
        timeframe: "4-6 years",
        skills: ["System Design", "Architecture", "Team Leadership", "DevOps"]
      },
      {
        stage: "Lead/Architect",
        timeframe: "6+ years",
        skills: ["Enterprise Architecture", "Strategic Planning", "Mentoring", "Technical Decision Making"]
      }
    ]
  }
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("resume")

  useEffect(() => {
    // Simulate API call
    const fetchProject = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setProject(mockProjectData)
      } catch (error) {
        console.error("Error fetching project:", error)
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

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <p className="mt-4 text-gray-500">Project not found</p>
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
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{project.title}</h1>
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
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="resume" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center">
              <File className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Cover Letter</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> {/* 🔁 Replaced Linkedin with User */}
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="score" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Score</span>
            </TabsTrigger>
            <TabsTrigger value="skill-gap" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Skill Gap</span>
            </TabsTrigger>
            <TabsTrigger value="career-report" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Career Report</span>
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">AI-Optimized Resume</h2>
                <Button variant="outline" size="sm">
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
                <div>
                  <h4 className="font-medium text-gray-700">Professional Summary</h4>
                  <p className="mt-1 text-sm text-gray-600">{project.resume.content.summary}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Experience</h4>
                  {project.resume.content.experience.map((exp: any, index: number) => (
                    <div key={index} className="mt-3 border-t border-gray-100 pt-3 first:border-t-0">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-gray-600">
                        {exp.responsibilities.map((resp: string, i: number) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
              </div>
            </div>
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value="cover-letter" className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">AI-Generated Cover Letter</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {project.coverLetter}
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Tab */}
          <TabsContent value="linkedin" className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">AI-Optimized LinkedIn Profile</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{project.resume.content.name}</h3>
                  <p className="text-blue-600">{project.linkedin.headline}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">About</h4>
                  <p className="mt-1 text-sm text-gray-600">{project.linkedin.summary}</p>
                </div>
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
              </div>
            </div>
          </TabsContent>

          {/* Score Tab */}
          <TabsContent value="score" className="space-y-4">
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
          </TabsContent>

          {/* Skill Gap Tab */}
          <TabsContent value="skill-gap" className="space-y-4">
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
                    {project.skillGap.recommendedSkills.map((skill: string, index: number) => (
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
              <div className="mt-6">
                <h3 className="font-medium text-gray-700">Recommended Certifications</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-600">
                  {project.skillGap.certifications.map((cert: string, index: number) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Career Report Tab */}
          <TabsContent value="career-report" className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Career Report</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Strengths</h3>
                  <p className="mt-1 text-sm text-gray-600">{project.careerReport.strengths}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Weaknesses</h3>
                  <p className="mt-1 text-sm text-gray-600">{project.careerReport.weaknesses}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Opportunities</h3>
                  <p className="mt-1 text-sm text-gray-600">{project.careerReport.opportunities}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Salary Estimate</h3>
                  <p className="mt-1 text-sm text-gray-600">{project.careerReport.salary}</p>
                </div>
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
                          <p className="text-sm text-gray-600">Skills: {item.skills.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProjectDetail