import { FadeStaggeredAnimation } from "@/components/animations/fade-animation";
import { NavLink } from "@/components/ui/nav-link";
import { getGitHubContributions } from "../../api/contribution";
import { GithubContributionGraph } from "./contribution-graph";

const Contributions = async () => {
  const contribution = await getGitHubContributions();

  return (
    <FadeStaggeredAnimation className="w-full" direction="up">
      <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Contributions
      </h2>

      <div className="mt-4 w-full border-b border-b-outline-secondary pb-6 text-fg-tertiary/80 sm:mt-8">
        <GithubContributionGraph contributions={contribution} />
      </div>

      <p className="mt-4 text-fg-tertiary text-sm sm:text-base/relaxed">
        {" "}
        I code almost every day, some projects make it here, some don&apos;t.
        You can check the{" "}
        <NavLink
          className="font-medium text-fg-brand underline"
          href={"/about"}
        >
          {" "}
          About page
        </NavLink>{" "}
        if you want to know a bit more about me.{" "}
      </p>
    </FadeStaggeredAnimation>
  );
};

export { Contributions };

/* -------------------------------------------------------------------------- */
