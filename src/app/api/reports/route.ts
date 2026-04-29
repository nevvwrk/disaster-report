import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { reportSchema } from '../../../lib/validators';

export async function GET() {
  const reports = await prisma.reports.findMany({
    where: { isDelete: false},
    orderBy: { createdAt: 'desc'},
  });
  return NextResponse.json(reports);
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
    const parsed = reportSchema.parse(body);
    const report = await prisma.reports.create({
      data: {
        title: parsed.title,
        description: parsed.description || "",
        disasterType: parsed.disasterType,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        area: parsed.area || "",
        imageUrl: parsed.imageUrl ?? [],
        severity: parsed.severity,
        tel: parsed.tel || "",
        email: parsed.email || "",
      }
    });
    return NextResponse.json(report)
  } catch(error) {
    console.error("Prisma full error", error);
    return NextResponse.json(
      { error: "Invalid data", details: error},
      { status: 400}
    )
  }
}

export async function PUT(req: Request) {
  const { id, status } = await req.json();

  const report = await prisma.reports.update({
    where: { id },
    data: { status },
  });

  return Response.json(report);
}