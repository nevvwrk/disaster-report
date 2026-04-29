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
    <main className="px-6 text-center">
      <nav className="relative w-auto p-1 flex gap-2 mb-3">
          <Link href={`/${locale}/reports`} className="bg-cyan-700 rounded p-2 text-white mr-4">All Reports</Link>
          <Link href={`/${locale}/login`} className="bg-cyan-400 rounded p-2 text-white">Login</Link>
          <Link href={`/${locale}/dashboard`} className="bg-cyan-600 rounded p-2 text-white">Dashboard</Link>
      </nav>
      <ReportForm locale={locale} />
    </main>
  );
}