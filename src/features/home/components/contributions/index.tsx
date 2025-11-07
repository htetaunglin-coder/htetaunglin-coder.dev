import { FadeAnimation } from "@/components/animations/fade-animation";
import { NavLink } from "@/components/ui/nav-link";
import { getGitHubContributions } from "../../api/contribution";
import { GithubContributionGraph } from "./contribution-graph";

const Contributions = async () => {
  const contribution = await getGitHubContributions();

  return (
    <div className="w-full">
      <FadeAnimation
        as="h2"
        className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold"
        direction="up"
      >
        Contributions
      </FadeAnimation>

      <FadeAnimation
        as="div"
        className="mt-4 w-full border-b border-b-outline-secondary pb-6 text-fg-tertiary/80 sm:mt-8"
        delay={0.25}
        direction="up"
      >
        <GithubContributionGraph contributions={contribution} />
      </FadeAnimation>

      <FadeAnimation
        as="p"
        className="mt-4 text-fg-tertiary text-sm sm:text-base/relaxed"
        delay={0.25}
        direction="up"
      >
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
      </FadeAnimation>
    </div>
  );
};

export { Contributions };

/* -------------------------------------------------------------------------- */
