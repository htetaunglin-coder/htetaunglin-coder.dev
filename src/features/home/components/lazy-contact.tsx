"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Contact = dynamic(
  () => import("./contact").then((module) => module.Contact),
  {
    ssr: false,
    loading: () => <ContactFallback />,
  }
);

const LazyContact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "480px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return <div ref={ref}>{shouldLoad ? <Contact /> : <ContactFallback />}</div>;
};

const ContactFallback = () => (
  <div className="w-full">
    <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
      Let&apos;s Connect
    </h2>

    <p className="mt-1 w-full text-fg-tertiary text-sm/relaxed sm:max-w-md sm:text-base/relaxed">
      Have a project in mind or just want to say hi? My inbox is always open,
      I&apos;d love to hear from you.
    </p>

    <div className="mt-8 space-y-4">
      <div>
        <div className="mb-2 h-4 w-28 rounded bg-bg-secondary" />
        <div className="h-9 w-full rounded-md border bg-bg-default-alt opacity-80" />
      </div>
      <div>
        <div className="mb-2 h-4 w-24 rounded bg-bg-secondary" />
        <div className="min-h-24 w-full rounded-md border bg-bg-default-alt opacity-80" />
      </div>
      <div className="flex w-full justify-end pt-4">
        <div className="h-9 w-20 rounded-md bg-bg-inverse opacity-80" />
      </div>
    </div>
  </div>
);

export { LazyContact };
