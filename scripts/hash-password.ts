import bcrypt from 'bcryptjs'

const password = process.argv[2]
if (!password) {
  console.error('Usage: pnpm exec tsx scripts/hash-password.ts "mon-mot-de-passe"')
  process.exit(1)
}

bcrypt.hash(password, 10).then((hash) => {
  // Base64-encoded so the "$" characters in a bcrypt hash never get mistaken
  // for shell/dotenv variable interpolation when stored as an env var.
  console.log(Buffer.from(hash, 'utf8').toString('base64'))
})
