"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hypergaruda-advanced-animation";

type MotionMode = "on" | "off";

function applyMotionMode(mode: MotionMode) {
  document.documentElement.dataset.advancedMotion = mode;
}

export default function AnimationModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let saved = false;

    try {
      saved = window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      // Keep the default OFF if browser storage is unavailable.
    }

    setEnabled(saved);
    applyMotionMode(saved ? "on" : "off");
  }, []);

  function toggleAnimation() {
    const next = !enabled;
    setEnabled(next);
    applyMotionMode(next ? "on" : "off");

    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      // The toggle still works for this page if storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      className={`motion-toggle${enabled ? " is-enabled" : ""}`}
      onClick={toggleAnimation}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "Disable advanced animations"
          : "Enable advanced animations; may cause lag on slower devices"
      }
      title={
        enabled
          ? "Turn off Advanced FX"
          : "Turn on Advanced FX — may cause lag"
      }
    >
      <span className="motion-toggle-spark" aria-hidden="true">
        ✦
      </span>
      <span className="motion-toggle-label">
        {enabled ? "LAG MODE: ON" : "ADV FX: OFF"}
      </span>
      <span className="motion-toggle-indicator" aria-hidden="true" />
    </button>
  );
}
