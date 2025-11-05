"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Media query strings for different screen sizes.
 */
export const SCREEN_SIZES = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
};

/**
 * Hook to determine if the screen size is mobile.
 *
 * @returns True if the screen size is mobile, false otherwise.
 */
export const useIsMobile = (): boolean =>
  useMediaQuery(SCREEN_SIZES.mobile, { initializeWithValue: false });

/**
 * Hook to determine if the screen size is tablet.
 *
 * @returns True if the screen size is tablet, false otherwise.
 */
export const useIsTablet = (): boolean =>
  useMediaQuery(SCREEN_SIZES.tablet, { initializeWithValue: false });

/**
 * Hook to determine if the screen size is desktop.
 *
 * @returns True if the screen size is desktop, false otherwise.
 */
export const useIsDesktop = (): boolean =>
  useMediaQuery(SCREEN_SIZES.desktop, { initializeWithValue: false });

/**
 * Combined hook to get the screen size states.
 *
 * @returns An object containing the screen size states.
 * @property isMobile - True if the screen size is mobile.
 * @property isTablet - True if the screen size is tablet.
 * @property isDesktop - True if the screen size is desktop.
 */
export const useScreenSizes = (): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return { isMobile, isTablet, isDesktop };
};
