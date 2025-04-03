// pages/api/price.js
import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { url } = req.query;
  const defaultUrl = "https://www.etrailer.com/Vehicle-Suspension/Air-Lift/AL60844.html";
  const scrapeUrl = url || defaultUrl;

  if (!scrapeUrl || !scrapeUrl.startsWith("http")) {
    return res.status(400).json({
      error: "Invalid or missing URL",
      details: "Please provide a valid URL starting with http:// or https://"
    });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://www.etrailer.com/"
  };

  try {
    const { data } = await axios.get(scrapeUrl, { headers });
    const $ = cheerio.load(data);
    const priceElement = $("span.price"); // Update after inspecting
    const price = priceElement.text().trim();

    if (!price) {
      return res.status(404).json({
        error: "Price not found",
        details: "No price element found with the specified selector"
      });
    }

    res.status(200).json({
      price,
      url: scrapeUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    // Log the response for debugging
    console.log("Error Response:", {
      status: statusCode,
      data: error.response?.data || "No response data"
    });
    res.status(statusCode).json({
      error: "Failed to fetch or parse page",
      details: error.message,
      status: statusCode,
      responseSnippet: error.response?.data?.substring(0, 200) // First 200 chars
    });
  }
}