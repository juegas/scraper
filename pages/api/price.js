// pages/api/price.js
import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  // Extract URL from query parameter (e.g., /api/price?url=https://example.com)
  const { url } = req.query;

  // Default URL if none provided
  const defaultUrl = "https://www.etrailer.com/Vehicle-Suspension/Air-Lift/AL60844.html";
  const scrapeUrl = url || defaultUrl;

  // Validate URL
  if (!scrapeUrl || !scrapeUrl.startsWith("http")) {
    return res.status(400).json({
      error: "Invalid or missing URL",
      details: "Please provide a valid URL starting with http:// or https://"
    });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  try {
    const { data } = await axios.get(scrapeUrl, { headers });
    const $ = cheerio.load(data);
    const priceElement = $("span.price"); // Update this selector after inspecting
    const price = priceElement.text().trim();

    if (!price) {
      return res.status(404).json({
        error: "Price not found",
        details: "No price element found with the specified selector"
      });
    }

    // Return JSON response
    res.status(200).json({
      price,
      url: scrapeUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: "Failed to fetch or parse page",
      details: error.message,
      status: statusCode
    });
  }
}