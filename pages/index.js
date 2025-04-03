// pages/index.js
import { useState } from "react";

export default function Home() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const fetchPrice = async () => {
    setLoading(true);
    const res = await fetch(inputUrl ? `/api/price?url=${encodeURIComponent(inputUrl)}` : "/api/price");
    const data = await res.json();
    setPriceData(data);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPrice();
  };

  return (
    <div>
      <h1>Price Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter URL (optional)"
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Scraping..." : "Scrape Price"}
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {priceData && (
        <div>
          {priceData.error ? (
            <p>Error: {priceData.error} ({priceData.details})</p>
          ) : (
            <p>
              Price: {priceData.price} (from {priceData.url})
            </p>
          )}
        </div>
      )}
    </div>
  );
}