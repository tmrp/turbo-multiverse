"use client";

import { useEffect } from "react";

import { hydrateApiDemo } from "@repo/site-config";

/** Fills the API demo widget after hydration. */
export function NavHydrator() {
  useEffect(() => {
    hydrateApiDemo();
  }, []);

  return null;
}
