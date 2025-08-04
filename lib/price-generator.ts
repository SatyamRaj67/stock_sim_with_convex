export interface PriceDataPoint {
  timestamp: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

export interface GeneratorOptions {
  days: number;
  startPrice: number;
  volatility: number; // 0.02 = 2%, 0.05 = 5%, etc.
  trend: number; // -0.001 = bearish, 0 = neutral, 0.001 = bullish
  baseVolume?: number;
}

export function generatePriceHistory(
  options: GeneratorOptions,
): PriceDataPoint[] {
  const { days, startPrice, volatility, trend, baseVolume = 1000000 } = options;

  const data: PriceDataPoint[] = [];
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  let currentPrice = startPrice;

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - i * oneDayMs;

    // Generate price movement
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendChange = trend;
    const totalChange = randomChange + trendChange;

    const openPrice = currentPrice;
    const closePrice = Math.max(0.01, currentPrice * (1 + totalChange));

    // Generate realistic high/low
    const dayVolatility = volatility * (0.5 + Math.random() * 0.5);
    const maxPrice = Math.max(openPrice, closePrice);
    const minPrice = Math.min(openPrice, closePrice);

    const highPrice = maxPrice * (1 + dayVolatility * Math.random());
    const lowPrice = minPrice * (1 - dayVolatility * Math.random());

    // Generate volume with some randomness
    const volumeMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x base volume
    const volume = Math.floor(baseVolume * volumeMultiplier);

    data.push({
      timestamp,
      openPrice,
      highPrice,
      lowPrice,
      closePrice,
      volume,
    });

    currentPrice = closePrice;
  }

  return data;
}

// Helper function for quick presets
export const VOLATILITY_PRESETS = {
  low: 0.02, // 2%
  medium: 0.05, // 5%
  high: 0.1, // 10%
  extreme: 0.2, // 20%
} as const;

export const TREND_PRESETS = {
  bearish: -0.002, // -0.2% daily trend
  neutral: 0, // no trend
  bullish: 0.002, // +0.2% daily trend
} as const;
