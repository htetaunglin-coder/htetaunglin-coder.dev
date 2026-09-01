import type { WorkshopEntry } from "../data";

const STATUS_LABEL: Record<WorkshopEntry["status"], string> = {
  "in-progress": "Working on it",
  published: "Published",
};

export const EntryCard = ({ entry }: { entry: WorkshopEntry }) => (
  <article className="rounded-lg border border-outline-secondary bg-bg-default-alt/40 p-6 sm:p-8">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="font-medium text-fg-default text-xl tracking-tight sm:text-2xl">
        {entry.name}
      </h2>
      <span className="rounded-full border border-outline-secondary px-2.5 py-0.5 text-fg-tertiary text-xs">
        {STATUS_LABEL[entry.status]}
      </span>
    </div>

    <p className="mt-2 font-medium text-base text-fg-secondary">
      {entry.summary}
    </p>

    <p className="mt-4 max-w-2xl text-base/relaxed text-fg-tertiary">
      {entry.body}
    </p>
  </article>
);
