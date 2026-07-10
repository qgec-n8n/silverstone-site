/**
 * Type stub for `@bpinternal/shared`, substituted via tsconfig `paths`.
 *
 * The real package ships raw TypeScript source (`"main": "src/index.ts"`)
 * with no build output, so `@botpress/webchat`'s declaration file drags that
 * source into our compilation, where it fails this project's stricter
 * compiler options (`verbatimModuleSyntax`, `noUnusedLocals`) and its `luxon`
 * dependency has no bundled types. `skipLibCheck` only skips `.d.ts` files,
 * not `.ts` source, so the escape hatch is this stub covering the handful of
 * names the webchat declarations import — all peripheral config/event types
 * the site's bespoke Sam console never touches. Runtime bundling is
 * unaffected: Vite resolves the real package.
 */
export type ConversationStarter = {
  label?: string;
  prompt?: string;
  icon?: string;
  [k: string]: unknown;
};

export type ConversationStarterDisplayStyle = string;

export type EventEmitter<TEvents extends Record<string, unknown>> = {
  on: <K extends keyof TEvents>(
    event: K | "*",
    handler: (payload: TEvents[K]) => void,
  ) => () => void;
  emit: <K extends keyof TEvents>(event: K, payload: TEvents[K]) => void;
};

export declare function createEventEmitter<
  TEvents extends Record<string, unknown>,
>(): EventEmitter<TEvents>;

export type LatestWebchatConfig = Record<string, unknown>;

export type LatestWebchatTheme = Record<string, unknown>;
