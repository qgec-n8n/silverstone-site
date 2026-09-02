/**
 * Display-currency runtime.
 *
 * The chosen currency lives in exactly one place at runtime: the
 * `data-currency` attribute on `<html>`. CSS reads it to show one side of every
 * `[[£|$]]` pair (see styles/currency.css); React reads it through
 * `useCurrency()` for the few places that need the value as data (budget
 * bands). It persists in localStorage across pages and sessions, and in a
 * cookie so an edge function could honor it later without a new contract.
 *
 * The pre-hydration boot script in root.tsx applies the stored value before
 * first paint, so a returning USD reader never sees sterling flash.
 */
import { useCallback, useSyncExternalStore } from "react";

import {
  CURRENCY_ATTRIBUTE,
  CURRENCY_COOKIE_NAME,
  CURRENCY_STORAGE_KEY,
  type Currency,
  DEFAULT_CURRENCY,
  isCurrency,
} from "~/data/currency";

const listeners = new Set<() => void>();

function readAttribute(): Currency {
  if (typeof document === "undefined") {
    return DEFAULT_CURRENCY;
  }
  const value = document.documentElement.getAttribute(CURRENCY_ATTRIBUTE);
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}

export function readStoredCurrency(): Currency | null {
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isCurrency(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getCurrency(): Currency {
  return readAttribute();
}

export function setCurrency(next: Currency): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (root.getAttribute(CURRENCY_ATTRIBUTE) !== next) {
    root.setAttribute(CURRENCY_ATTRIBUTE, next);
  }
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, next);
  } catch {
    // Private mode or blocked storage: the attribute still works for this page.
  }
  try {
    document.cookie = `${CURRENCY_COOKIE_NAME}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Cookies blocked: nothing else depends on it.
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): Currency {
  return DEFAULT_CURRENCY;
}

/**
 * The current display currency, as React state. Server and first client
 * render both report the default so prerendered markup and hydration agree;
 * the boot script has already set the attribute, so the store snapshot
 * corrects any component that actually needs the value on the next tick.
 */
export function useCurrency(): [Currency, (next: Currency) => void] {
  const currency = useSyncExternalStore(subscribe, readAttribute, getServerSnapshot);
  const update = useCallback((next: Currency) => {
    setCurrency(next);
  }, []);
  return [currency, update];
}
