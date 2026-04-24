import RegisterClient from "./RegisterClient";
import { getDictionary } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return <RegisterClient dict={dict} locale={params.locale} />;
}