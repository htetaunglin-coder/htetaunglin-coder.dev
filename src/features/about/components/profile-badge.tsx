"use client";

import { Lanyard } from "@/components/land-yard";
import { useIsDesktop } from "@/hooks/use-screen-size";

const ProfileBadge3D = () => {
  const isDesktop = useIsDesktop();

  if (!isDesktop) return null;

  return (
    <div className="hidden 2xl:block">
      <Lanyard gravity={[0, -40, 0]} position={[0, 0, 17]} />
    </div>
  );
};

export { ProfileBadge3D };
