import { SignJWT, jwtVerify } from 'jose'

export async function generateToken(userId: string, email: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this')
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string }> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this')
  try {
    const { payload } = await jwtVerify(token, secret)
    return { userId: payload.userId as string, email: payload.email as string }
  } catch {
    throw new Error('Invalid token')
  }
}