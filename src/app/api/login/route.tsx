import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const users = await prisma.users.findUnique({ where: { email }, include: { userAreas: true } })

  if (!users) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, users.password)

  if (!valid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign(
    { id: users.id, role: users.role, area: users.userAreas  },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )

  const res = Response.json({ success: true })

  res.headers.set(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=86400`
  )

  return res
}

export async function PUT(req: Request) {
  const { id, status } = await req.json()

  const report = await prisma.reports.update({
    where: { id },
    data: { status },
  })

  return Response.json(report)
}
