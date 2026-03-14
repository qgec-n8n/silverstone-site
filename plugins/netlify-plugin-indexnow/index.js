const path = require("path");
const { submitIndexNow } = require("../../scripts/indexnow-submit");

exports.onSuccess = async () => {
  const repoRoot = path.resolve(__dirname, "..", "..");

  try {
    await submitIndexNow({ repoRoot, logger: console });
  } catch (error) {
    console.warn(`IndexNow warning: ${error.message}`);
  }
};
