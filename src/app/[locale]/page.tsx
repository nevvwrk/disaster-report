import ReportForm from "@/components/reportForm/ReportForm";
import Link from "next/link";
export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  console.log("Locale in page:", locale);
  return (
    <main className="p-6 text-center">
      <ReportForm locale={locale} />
      <Link href={`/${locale}/login`}>Login</Link>
      <Link href={`/${locale}/dashboard`}>Dashboard</Link>
    </main>
  );
}