import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // check duplicate
    const existing = await prisma.users.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashed,
        role: "ADMIN", // 👈 you can change later
      },
    });

    return Response.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}