"use client";

import React from "react";
import { Button } from "./button";

const ICONS_ROW1 = [
  "https://cdn-icons-png.flaticon.com/512/5968/5968854.png",
  "https://cdn-icons-png.flaticon.com/512/732/732221.png",
  "https://cdn-icons-png.flaticon.com/512/733/733609.png",
  "https://cdn-icons-png.flaticon.com/512/732/732084.png",
  "https://cdn-icons-png.flaticon.com/512/733/733585.png",
  "https://cdn-icons-png.flaticon.com/512/281/281763.png",
  "https://cdn-icons-png.flaticon.com/512/888/888879.png",
];

const ICONS_ROW2 = [
  "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  "https://cdn-icons-png.flaticon.com/512/906/906324.png",
  "https://cdn-icons-png.flaticon.com/512/888/888841.png",
  "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",
  "https://cdn-icons-png.flaticon.com/512/906/906361.png",
  "https://cdn-icons-png.flaticon.com/512/732/732190.png",
  "https://cdn-icons-png.flaticon.com/512/888/888847.png",
];

const repeatedIcons = (icons: string[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative overflow-hidden bg-white py-32 dark:bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-black dark:border-gray-700 dark:bg-black dark:text-white">⚡ Integrations</span>
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">Integrate with favourite tools</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500 dark:text-white">250+ top apps are available to integrate seamlessly with your workflow.</p>
        <Button className="mt-8 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800">Get started</Button>
        <div className="relative mt-12 overflow-hidden pb-2">
          <div className="ss-integration-scroll-left flex gap-10 whitespace-nowrap">
            {repeatedIcons(ICONS_ROW1).map((src, i) => (
              <div key={i} className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-300">
                <img src={src} alt="Integration icon" className="size-10 object-contain" />
              </div>
            ))}
          </div>
          <div className="ss-integration-scroll-right mt-6 flex gap-10 whitespace-nowrap">
            {repeatedIcons(ICONS_ROW2).map((src, i) => (
              <div key={i} className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-300">
                <img src={src} alt="Integration icon" className="size-10 object-contain" />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-black" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-black" />
        </div>
      </div>
    </section>
  );
}
