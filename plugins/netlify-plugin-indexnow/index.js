const path = require("path");
const {
  collectChangedIndexNowUrls,
  submitIndexNow,
} = require("../../scripts/indexnow-submit");

exports.onSuccess = async ({ constants = {} }) => {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const siteRoot = constants.PUBLISH_DIR || repoRoot;

  try {
    const selection = collectChangedIndexNowUrls({ repoRoot, siteRoot });

    if (selection.mode === "skip") {
      console.log(`IndexNow skipped: ${selection.reason}`);
      return;
    }

    console.log(
      `IndexNow ${selection.mode} submission queued for ${selection.urls.length} URLs. ${selection.reason}`
    );

    await submitIndexNow({ siteRoot, urls: selection.urls, logger: console });
  } catch (error) {
    console.warn(`IndexNow warning: ${error.message}`);
  }
};
