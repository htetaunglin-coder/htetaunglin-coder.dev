import { ArrowRight, Dot } from "lucide-react";
import Link from "next/link";
import { CloudinaryImage } from "@/components/cloudinary-image";
import type { blogSource } from "@/lib/source";
import { formatDate } from "@/lib/utils";

const BlogPostShowcase = ({
  post,
}: {
  post: ReturnType<typeof blogSource.getPages>[number];
}) => (
  <article className="flex flex-col-reverse items-center gap-6 sm:flex-row md:gap-12">
    <div className="w-full space-y-2 md:space-y-4">
      {(post.data.tags || post.data.series) && (
        <div className="hidden space-y-2 text-xs md:block md:text-sm">
          {post.data.tags && (
            <div className="flex items-center gap-4">
              {post.data.tags.map((tag) => (
                <span className="text-fg-tertiary/80 uppercase" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.data.series && (
            <div className="flex items-center gap-4">
              <span className="text-fg-tertiary/80 uppercase">
                {post.data.series}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-1 md:space-y-2">
        <h2>
          <Link
            className="block font-medium text-fg-secondary/90 text-lg hover:underline md:text-2xl"
            href={post.url}
          >
            {post.data.title}
          </Link>
        </h2>

        {post.data.description && (
          <p className="line-clamp-2 text-fg-tertiary text-sm md:line-clamp-none md:text-base">
            {post.data.description}
          </p>
        )}
      </div>

      {(post.data.author || post.data.date) && (
        <div className="flex items-center text-fg-tertiary/80 text-xs md:text-sm">
          {post.data.author && <span>{post.data.author}</span>}
          {post.data.author && post.data.date && <Dot className="text-3xl" />}
          {post.data.date && <span>{formatDate(post.data.date)}</span>}
        </div>
      )}

      <Link
        className="inline-flex items-center gap-2 text-fg-brand text-sm underline hover:brightness-80 md:text-base"
        href={post.url}
      >
        Read More <ArrowRight />
      </Link>
    </div>

    <Link
      className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-none grayscale-25 sm:w-44 sm:rounded-lg md:w-2/5 md:rounded-xl dark:brightness-90"
      href={post.url}
    >
      <CloudinaryImage
        alt={post.data.title}
        className="object-cover object-bottom"
        fill
        src={post.data.image}
      />
    </Link>
  </article>
);

export { BlogPostShowcase };
