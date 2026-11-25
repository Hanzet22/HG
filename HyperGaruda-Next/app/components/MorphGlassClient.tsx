"use client";

import { useEffect } from "react";
import { mountMorphGlass } from "../../../shared/morphglass";

export default function MorphGlassClient() {
  useEffect(() => {
    const controller = mountMorphGlass(document, {
      quality: "medium",
      pointerTracking: true,
    });

    return () => controller.destroy();
  }, []);

  return null;
}
