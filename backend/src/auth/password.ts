// Using Web Crypto API (supported in Cloudflare Workers)
// PBKDF2 with SHA-256 - secure and works in any environment

const encoder = new TextEncoder()
const SALT_LENGTH = 32
const KEY_LENGTH = 64
const ITERATIONS = 100000

export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  
  // Derive key using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH * 8
  )
  
  const hash = new Uint8Array(derivedBits)
  
  // Combine salt and hash, then encode as base64
  const combined = new Uint8Array(salt.length + hash.length)
  combined.set(salt, 0)
  combined.set(hash, salt.length)
  
  return btoa(String.fromCharCode(...combined))
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // Decode the stored hash
  const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0))
  
  const salt = combined.slice(0, SALT_LENGTH)
  const originalHash = combined.slice(SALT_LENGTH)
  
  // Derive key with the same salt
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH * 8
  )
  
  const newHash = new Uint8Array(derivedBits)
  
  // Compare in constant time
  if (newHash.length !== originalHash.length) return false
  
  let result = 0
  for (let i = 0; i < newHash.length; i++) {
    result |= newHash[i] ^ originalHash[i]
  }
  return result === 0
}