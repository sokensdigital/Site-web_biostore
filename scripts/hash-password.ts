import bcrypt from 'bcryptjs'

const password = process.argv[2]
if (!password) {
  console.error('Usage: pnpm exec tsx scripts/hash-password.ts "mon-mot-de-passe"')
  process.exit(1)
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash)
})
