// services/githubService.js
const { Octokit } = require("@octokit/rest");

// Load these from your .env file
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Uploads an image buffer to a specified folder in your GitHub repo.
 * @param {Buffer} imageBuffer - The raw image data.
 * @param {string} originalFilename - The original name of the uploaded file.
 * @returns {Promise<string>} - The jsDelivr URL of the uploaded image.
 */
async function uploadImageToGitHub(imageBuffer, originalFilename) {
  // Create a clean filename for the repo
  const timestamp = Date.now();
  const safeFilename = originalFilename.replace(/\s/g, "_");
  const filePath = `exercises/${timestamp}-${safeFilename}`; // Store in 'exercises' folder

  // GitHub API requires file content as base64
  const base64Content = imageBuffer.toString("base64");

  try {
    // Use the Octokit method to create or update the file[reference:3]
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Upload image ${safeFilename} via API`,
      content: base64Content,
      branch: GITHUB_BRANCH,
    });

    // Construct the jsDelivr CDN URL
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH}/${filePath}`;
    return cdnUrl;
  } catch (error) {
    console.error("GitHub upload error:", error);
    throw new Error("Failed to upload image to GitHub repository.");
  }
}

module.exports = { uploadImageToGitHub };
