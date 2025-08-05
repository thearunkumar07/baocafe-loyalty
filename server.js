import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for loyalty check
app.get("/api/check-loyalty", async (req, res) => {
  const { mobile } = req.query;

  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 10-digit mobile number"
    });
  }

  try {
    const apiUrl = process.env.POSITEASY_API || "https://api.positeasy.in/api/v1/merchant/integration/customer-search";
    const authKey = process.env.AUTH_KEY || "Loy_jEf68871421fUyq3";

    const response = await fetch(`${apiUrl}?contactNumber=${mobile}`, {
      method: "GET",
      headers: {
        "AuthKey": authKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("PositeEasy API Response:", JSON.stringify(data, null, 2));

    if (data?.data?.name && data?.data?.loyaltyPoints !== undefined) {
      return res.json({
        success: true,
        name: data.data.name,
        points: data.data.loyaltyPoints,
        mobile: mobile,
      });
    } else {
      return res.json({
        success: false,
        message: "Customer not found in our loyalty program. Visit your nearest Bao Cafe store to join!",
      });
    }
  } catch (error) {
    console.error("Loyalty check error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to check loyalty points. Please try again later.",
    });
  }
});

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bao Cafe Loyalty Checker running at http://localhost:${PORT}`);
});