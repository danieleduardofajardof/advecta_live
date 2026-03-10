import AdvectaWebsite from "@/components/advecta-website";
import { getDictionary } from "@/lib/get-dictionary";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const dictionary = await getDictionary(locale as any);
  
  return <AdvectaWebsite dictionary={dictionary} locale={locale} />;
}

