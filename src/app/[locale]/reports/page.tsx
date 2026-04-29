import ReportsList from "@/components/Reports/ReportList";
import { prisma } from "@/lib/prisma"
type Props = { 
  params: Promise<{ locale: string}>
}
export default async function Page({params} : Props) {
    const { locale } = await params;

    const reports = await prisma.reports.findMany({
        where: {
            isDelete: false,
        },
        select: {
            id: true,
            title: true,
            description: true,
            disasterType: true,
            area: true,
            imageUrl: true,
            severity: true,
            status: true,
        }
    })

    return (
      <>
        
        {reports && <ReportsList reports={reports} locale={locale} />}
      </>
    )


}