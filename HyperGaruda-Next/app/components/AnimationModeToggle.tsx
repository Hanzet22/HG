"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "hypergaruda-advanced-animation";
type MotionMode = "on" | "off";

let currentMode: MotionMode | null = null;
const listeners = new Set<() => void>();

function applyMotionMode(mode: MotionMode) {
  document.documentElement.dataset.advancedMotion = mode;
}

function subscribe(callback: () => void) {
  const handleStorage = () => {
    currentMode = null;
    callback();
  };

  listeners.add(callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  if (currentMode !== null) return currentMode === "on";

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

function setMotionMode(mode: MotionMode) {
  currentMode = mode;

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // The in-memory mode still works for this page if storage is unavailable.
  }

  listeners.forEach((listener) => listener());
}

export default function AnimationModeToggle() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyMotionMode(enabled ? "on" : "off");
  }, [enabled]);

  function toggleAnimation() {
    setMotionMode(enabled ? "off" : "on");
  }

  return (
    <button
      type="button"
      className={"motion-toggle" + (enabled ? " is-enabled" : "")}
      onClick={toggleAnimation}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "LAG MODE: ON — Disable advanced animations"
          : "ADV FX: OFF — Enable advanced animations; may cause lag on slower devices"
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
