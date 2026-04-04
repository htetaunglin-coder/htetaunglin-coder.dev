"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ChatAgent, ChatAgentId } from "../lib/agents";

type AgentSwitcherProps = {
  agents: readonly ChatAgent[];
  selectedAgentId: ChatAgentId;
  onChange: (agentId: ChatAgentId) => void;
  disabled?: boolean;
  className?: string;
};

const AgentSwitcher = ({
  agents,
  selectedAgentId,
  onChange,
  disabled = false,
  className,
}: AgentSwitcherProps) => {
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  return (
    <div className={cn("w-fit", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 justify-between gap-2 rounded-lg px-3 text-xs"
            disabled={disabled}
            size="sm"
            type="button"
            variant="outlined"
          >
            <span>{selectedAgent?.label ?? "Choose agent"}</span>
            <ChevronDownIcon className="size-4 text-fg-secondary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-56">
          {agents.map((agent) => {
            const isActive = selectedAgentId === agent.id;

            return (
              <DropdownMenuItem
                className="h-auto min-h-9 gap-2 px-2 py-2 focus:bg-bg-accent"
                key={agent.id}
                onSelect={() => onChange(agent.id)}
              >
                <span
                  className={cn(
                    "inline-flex size-4 items-center justify-center text-fg-brand",
                    !isActive && "opacity-0"
                  )}
                >
                  <CheckIcon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium text-xs leading-none">
                    {agent.label}
                  </span>
                  <span className="mt-1 truncate text-fg-secondary text-xs leading-tight">
                    {agent.description}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { AgentSwitcher };
