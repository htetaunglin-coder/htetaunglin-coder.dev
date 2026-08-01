import { BlogIndexView } from "@/features/blog/components/blog-index-view";
import { indexMetadata } from "@/features/blog/lib/blog-metadata";

export const metadata = indexMetadata("my");

// Request-time rendered, same as `/blog`, because it reads `searchParams` for
// the category filter. That predates i18n and is not caused by it.
export default async function BurmeseBlog(props: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await props.searchParams;

  return <BlogIndexView category={category} locale="my" />;
}
