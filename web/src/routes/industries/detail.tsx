/**
 * /industry/:slug — canonical industry detail routes. Shares the unified
 * services/industries detail module: the loader resolves the requested path
 * against the governed route manifest (including legacy /services/<industry>
 * aliases) and renders the industries-v2 experience for industry templates.
 */
export {
  loader,
  clientLoader,
  shouldRevalidate,
  meta,
  default,
} from "~/routes/services/detail";
