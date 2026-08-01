import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { indexMetadata } from "@/features/blog/lib/blog-metadata";

export const metadata = indexMetadata("en");

export default async function Blog(props: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await props.searchParams;

  return <BlogIndexView category={category} locale="en" />;
}
