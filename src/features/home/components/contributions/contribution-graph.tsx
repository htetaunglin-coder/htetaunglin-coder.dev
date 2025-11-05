"use client";

import dayjs from "dayjs";
import { LoaderIcon } from "lucide-react";

import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/contribution-graph";
import { Tooltip } from "@/components/tooltip-wrapper";

const GithubContributionGraph = ({
  contributions,
}: {
  contributions: Activity[];
}) => (
  <ContributionGraph
    blockMargin={3}
    blockSize={12}
    className="w-full"
    data={contributions}
  >
    <ContributionGraphCalendar className="py-2" title="GitHub Contributions">
      {({ activity, dayIndex, weekIndex }) => (
        <Tooltip
          content={`${activity.count} contribution${activity.count > 1 ? "s" : ""} ${" "}
                on ${dayjs(activity.date).format("DD.MM.YYYY")}`}
          options={{
            side: "top",
          }}
          portal
        >
          <g>
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          </g>
        </Tooltip>
      )}
    </ContributionGraphCalendar>

    <ContributionGraphFooter>
      <ContributionGraphTotalCount>
        {({ totalCount, year }) => (
          <p className="text-fg-tertiary text-sm">
            {totalCount.toLocaleString("en")} contributions in {year}.
          </p>
        )}
      </ContributionGraphTotalCount>

      <ContributionGraphLegend />
    </ContributionGraphFooter>
  </ContributionGraph>
);

const GitHubContributionFallback = () => (
  <div className="flex h-[162px] w-full items-center justify-center">
    <LoaderIcon className="animate-spin text-muted-foreground" />
  </div>
);

export { GitHubContributionFallback, GithubContributionGraph };
