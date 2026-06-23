import type { ComponentType } from "react";

export type LazyVisualModule = {
  default: ComponentType;
};

export type LazyVisualImporter = () => Promise<LazyVisualModule>;
