import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  // convert file → buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // unique filename
  const filename = `${Date.now()}-${file.name}`

  const filePath = path.join(process.cwd(), 'public/uploads', filename)

  await writeFile(filePath, buffer)

  return NextResponse.json({
    url: `/uploads/${filename}`, // 🔥 important
  })
}