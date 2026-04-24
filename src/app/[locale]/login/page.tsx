import LoginPageClient from "./LoginClient";
type Props = {
    params: Promise<{locale: string}>
}

export default async function LoginPage({ params }: Props) {

    const { locale } = await params;
  return (
    <>
        <LoginPageClient locale={locale} />
       
    </>
  );
}
