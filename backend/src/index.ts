import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { users } from './db/schema'
import { hashPassword, verifyPassword } from './auth/password'
import { generateToken, verifyToken } from './auth/jwt'
import { eq } from 'drizzle-orm'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend
app.use('/*', cors())

// Health check
app.get('/', (c) => c.text('Career AI API is running!'))

// Register
app.post('/auth/register', async (c) => {
  const { email, password, fullName } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: 'Email and password required' }, 400)
  }

  const db = drizzle(c.env.DB)

  // Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
  if (existingUser) {
    return c.json({ error: 'User already exists' }, 400)
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password)
  const newUser = await db.insert(users).values({
    email,
    passwordHash,
    fullName: fullName || null,
  }).returning().get()

  // Generate JWT
  const token = await generateToken(newUser.id, newUser.email)

  return c.json({
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      credits: newUser.credits,
    },
    token,
  })
})

// Login
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: 'Email and password required' }, 400)
  }

  const db = drizzle(c.env.DB)

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email)).get()
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Generate JWT
  const token = await generateToken(user.id, user.email)

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      credits: user.credits,
    },
    token,
  })
})

// Protected route example
app.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = await verifyToken(token)
    const db = drizzle(c.env.DB)
    const user = await db.select().from(users).where(eq(users.id, payload.userId)).get()
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      credits: user.credits,
    })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

export default app