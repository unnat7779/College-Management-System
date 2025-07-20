const crypto = require("crypto")

// Generate a random 256-bit (32 bytes) secret
const generateJWTSecret = () => {
  const secret = crypto.randomBytes(32).toString("hex")
  console.log("Generated JWT Secret:")
  console.log(secret)
  console.log("\nAdd this to your .env file:")
  console.log(`JWT_SECRET=${secret}`)
  return secret
}

// Generate multiple secrets if needed
console.log("=== JWT Secret Generator ===\n")
generateJWTSecret()

// You can also generate base64 encoded secret
console.log("\n=== Base64 Encoded Secret ===")
const base64Secret = crypto.randomBytes(32).toString("base64")
console.log(`JWT_SECRET=${base64Secret}`)

// Or a UUID-based secret
console.log("\n=== UUID-based Secret ===")
const { v4: uuidv4 } = require("crypto")
const uuidSecret = uuidv4() + uuidv4().replace(/-/g, "")
console.log(`JWT_SECRET=${uuidSecret}`)
