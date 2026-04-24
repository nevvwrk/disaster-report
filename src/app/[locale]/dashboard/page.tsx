import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return <div>Please login</div>;
  }

  let user: any;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return <div>Invalid token</div>;
  }

  const reports = await prisma.reports.findMany({
    orderBy: { createdAt: "desc" },
  });


  return (
    <DashboardClient
      reports={reports}
      locale={locale}
      dict={dict}
      user={user}
    />
  );
}