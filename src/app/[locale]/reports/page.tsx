import { getDictionary } from "@/lib/i18n"
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
    const { locale } = await params;

    const dict = getDictionary(locale);


    return (
        <div>
            <h1>Reports</h1>
        </div>
    )
}