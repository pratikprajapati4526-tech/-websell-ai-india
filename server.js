const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const UPI_ID = "8600056967@slc";
const OFFER_PRICE = 2499;
const UPI_QR_URL = process.env.UPI_QR_URL || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const DAILY_DONE_TARGET = Number(process.env.DAILY_DONE_TARGET || 3);
const AUTO_INTERVAL_MS = Number(process.env.AUTO_INTERVAL_MS || 300000);

let deals = [];

function createLeadDeal() {
  const index = deals.length + 1;
  const deal = {
    id: `LEAD-${index}`,
    offerPrice: OFFER_PRICE,
    upiId: UPI_ID,
    qrConfigured: Boolean(UPI_QR_URL),
    upiQrUrl: UPI_QR_URL,
    status: "PITCHED_AWAITING_SCREENSHOT",
    pitchMessage: `Namaste! Hum ₹${OFFER_PRICE} mein aapke business ke liye ready website bana kar dete hain. Payment ke liye UPI ID: ${UPI_ID} (ya QR scan karein) aur payment ka screenshot bhej dein.`,
    createdAt: new Date().toISOString()
  };
  deals.push(deal);
  return deal;
}

app.get("/", (req, res) => {
  res.json({
    service: "-websell-ai-india",
    offerPrice: OFFER_PRICE,
    upiId: UPI_ID,
    qrConfigured: Boolean(UPI_QR_URL),
    geminiConfigured: Boolean(GEMINI_API_KEY),
    dailyTarget: DAILY_DONE_TARGET,
    autoIntervalMs: AUTO_INTERVAL_MS,
    todayDealsCount: deals.length,
    deals
  });
});

app.get("/next", (req, res) => {
  const deal = createLeadDeal();
  res.json(deal);
});

if (AUTO_INTERVAL_MS > 0) {
  setInterval(() => {
    const doneCount = deals.filter((d) => d.status === "PAID_VERIFIED").length;
    if (doneCount < DAILY_DONE_TARGET) {
      createLeadDeal();
    }
  }, AUTO_INTERVAL_MS);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
