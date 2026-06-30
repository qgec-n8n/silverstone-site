import { useEffect, useSyncExternalStore } from "react";

function subscribePageVisibility(onStoreChange: () => void) {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  document.addEventListener("visibilitychange", onStoreChange);
  window.addEventListener("pagehide", onStoreChange);
  window.addEventListener("pageshow", onStoreChange);

  return () => {
    document.removeEventListener("visibilitychange", onStoreChange);
    window.removeEventListener("pagehide", onStoreChange);
    window.removeEventListener("pageshow", onStoreChange);
  };
}

function getPageInViewSnapshot() {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState !== "hidden";
}

function getServerPageInViewSnapshot() {
  return true;
}

export function usePageInView() {
  const pageInView = useSyncExternalStore(
    subscribePageVisibility,
    getPageInViewSnapshot,
    getServerPageInViewSnapshot,
  );

  useEffect(() => {
    document.documentElement.toggleAttribute("data-page-hidden", !pageInView);
  }, [pageInView]);

  return pageInView;
}
