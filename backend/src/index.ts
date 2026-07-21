import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import { users, projects, resumes, coverLetters, linkedinProfiles, skillGaps, careerReports } from './db/schema'
import { hashPassword, verifyPassword } from './auth/password'
import { generateToken, verifyToken } from './auth/jwt'

type Bindings = {
  DB: D1Database
  BUCKET: R2Bucket
  JWT_SECRET: string
  N8N_WEBHOOK_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend
app.use('/*', cors())

// Health check
app.get('/', (c) => c.text('Career AI API is running!'))

// ============= AUTH =============

app.post('/auth/register', async (c) => {
  const { email, password, fullName } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  const db = drizzle(c.env.DB)
  const existing = await db.select().from(users).where(eq(users.email, email)).get()
  if (existing) return c.json({ error: 'User already exists' }, 400)

  const passwordHash = await hashPassword(password)
  const newUser = await db.insert(users).values({
    email,
    passwordHash,
    fullName: fullName || null,
  }).returning().get()

  const token = await generateToken(newUser.id, newUser.email)
  return c.json({
    user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName, credits: newUser.credits },
    token,
  })
})

app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  const db = drizzle(c.env.DB)
  const user = await db.select().from(users).where(eq(users.email, email)).get()
  if (!user) return c.json({ error: 'Invalid credentials' }, 401)

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) return c.json({ error: 'Invalid credentials' }, 401)

  const token = await generateToken(user.id, user.email)
  return c.json({
    user: { id: user.id, email: user.email, fullName: user.fullName, credits: user.credits },
    token,
  })
})

// Protected route: get current user
app.get('/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.split(' ')[1]
  try {
    const payload = await verifyToken(token)
    const db = drizzle(c.env.DB)
    const user = await db.select().from(users).where(eq(users.id, payload.userId)).get()
    if (!user) return c.json({ error: 'User not found' }, 404)
    return c.json({ id: user.id, email: user.email, fullName: user.fullName, credits: user.credits })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// ============= PROJECTS =============

// Upload CV
app.post('/projects/upload', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.split(' ')[1]
  let userId: string
  try {
    const payload = await verifyToken(token)
    userId = payload.userId
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const formData = await c.req.formData()
  const file = formData.get('file') as File
  if (!file) return c.json({ error: 'No file provided' }, 400)

  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!validTypes.includes(file.type)) return c.json({ error: 'Only PDF and DOCX allowed' }, 400)
  if (file.size > 10 * 1024 * 1024) return c.json({ error: 'File must be <10MB' }, 400)

  const ext = file.name.split('.').pop()
  const key = `uploads/${crypto.randomUUID()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  await c.env.BUCKET.put(key, arrayBuffer, { httpMetadata: { contentType: file.type } })

  const db = drizzle(c.env.DB)
  const project = await db.insert(projects).values({
    userId,
    status: 'pending',
    originalFilename: file.name,
    originalFileKey: key,
  }).returning().get()

  // Trigger n8n (fire and forget)
  const n8nUrl = c.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project.id,
        fileKey: key,
        userId: userId,
        // We'll send the file URL; n8n can fetch the file from R2 (public or signed)
        fileUrl: `${c.env.R2_PUBLIC_URL}/${key}`,
        userEmail: (await db.select().from(users).where(eq(users.id, userId)).get())?.email,
      })
    }).catch(err => console.error('n8n trigger failed:', err))
    // Update status to processing
    await db.update(projects).set({ status: 'processing' }).where(eq(projects.id, project.id))
  }

  return c.json({ projectId: project.id, message: 'File uploaded, processing started' })
})

// List user's projects
app.get('/projects', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.split(' ')[1]
  let userId: string
  try {
    const payload = await verifyToken(token)
    userId = payload.userId
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const db = drizzle(c.env.DB)
  const userProjects = await db.select().from(projects).where(eq(projects.userId, userId)).all()
  return c.json(userProjects)
})

// Get single project with all data
app.get('/projects/:id', async (c) => {
  const { id } = c.req.param()
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.split(' ')[1]
  let userId: string
  try {
    const payload = await verifyToken(token)
    userId = payload.userId
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const db = drizzle(c.env.DB)
  const project = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId))).get()
  if (!project) return c.json({ error: 'Project not found' }, 404)

  // Fetch related data
  const resume = await db.select().from(resumes).where(eq(resumes.projectId, id)).get()
  const coverLetter = await db.select().from(coverLetters).where(eq(coverLetters.projectId, id)).get()
  const linkedin = await db.select().from(linkedinProfiles).where(eq(linkedinProfiles.projectId, id)).get()
  const skillGap = await db.select().from(skillGaps).where(eq(skillGaps.projectId, id)).get()
  const careerReport = await db.select().from(careerReports).where(eq(careerReports.projectId, id)).get()

  return c.json({
    ...project,
    resume,
    coverLetter,
    linkedin,
    skillGap,
    careerReport,
  })
})

// ============= WEBHOOK FOR n8n =============

app.post('/webhooks/n8n/results', async (c) => {
  // Verify secret
  const secret = c.req.header('x-webhook-secret')
  if (secret !== c.env.N8N_WEBHOOK_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json()
  const { projectId, resume, coverLetter, linkedin, skillGap, careerReport, resumePdfKey, coverLetterPdfKey, linkedinPdfKey } = body

  if (!projectId) return c.json({ error: 'projectId required' }, 400)

  const db = drizzle(c.env.DB)

  // Update project status to completed
  await db.update(projects).set({ status: 'completed' }).where(eq(projects.id, projectId))

  // Insert resume data
  if (resume) {
    await db.insert(resumes).values({
      projectId,
      content: resume.content,
      atsScore: resume.atsScore,
      grammarScore: resume.grammarScore,
      formattingScore: resume.formattingScore,
      impactScore: resume.impactScore,
    })
  }

  // Insert cover letter
  if (coverLetter) {
    await db.insert(coverLetters).values({
      projectId,
      content: coverLetter.text,
      fileKey: coverLetterPdfKey || null,
    })
  }

  // Insert LinkedIn profile
  if (linkedin) {
    await db.insert(linkedinProfiles).values({
      projectId,
      headline: linkedin.headline,
      summary: linkedin.summary,
      experience: linkedin.experience,
    })
  }

  // Insert skill gap
  if (skillGap) {
    await db.insert(skillGaps).values({
      projectId,
      currentSkills: skillGap.currentSkills,
      recommendedSkills: skillGap.recommendedSkills,
      certifications: skillGap.certifications,
    })
  }

  // Insert career report
  if (careerReport) {
    await db.insert(careerReports).values({
      projectId,
      strengths: careerReport.strengths,
      weaknesses: careerReport.weaknesses,
      opportunities: careerReport.opportunities,
      salary: careerReport.salary,
      roadmap: careerReport.roadmap,
    })
  }

  return c.json({ success: true })
})

export default app