import { notFound } from "next/navigation";
import TrainingApp from "../../components/TrainingApp";
import { routes } from "../../lib/content";

const valid = new Set(routes.map(([slug]) => slug));

export async function generateStaticParams() {
  return routes.map(([slug]) => ({ slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!valid.has(slug as (typeof routes)[number][0])) notFound();
  return <TrainingApp initialSection={slug} />;
}
