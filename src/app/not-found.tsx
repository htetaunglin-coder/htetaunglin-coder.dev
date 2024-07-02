import Link from "next/link";

export default function NotFoundRoot() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-5 lg:px-6 lg:pb-16 lg:pt-0">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-navy-blue dark:text-light-blue lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-800 dark:text-white md:text-4xl">
            Something&#39;s missing.
          </p>
          <p className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Sorry, we can&#39;t find that page. You&#39;ll find lots to explore
            on the home page.
          </p>
          <Link
            href="/"
            className="mx-auto mt-2 block w-fit rounded border border-dark-pink bg-dark-pink p-1.5 text-sm font-semibold text-gray-300 transition duration-500 hover:bg-transparent hover:text-dark-pink dark:border-pink dark:bg-pink dark:text-zinc-900 dark:hover:bg-transparent dark:hover:text-pink sm:p-3 sm:text-base">
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
