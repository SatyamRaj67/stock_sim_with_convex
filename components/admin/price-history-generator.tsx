"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { TbDatabase, TbClock, TbTrendingUp, TbRefresh } from "react-icons/tb";
import {
  generatePriceHistory,
  VOLATILITY_PRESETS,
  TREND_PRESETS,
} from "@/lib/price-generator";

interface PriceHistoryGeneratorProps {
  stockId: Id<"stock">;
  stock: Doc<"stock">;
}

export function PriceHistoryGenerator({
  stockId,
  stock,
}: PriceHistoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [days, setDays] = React.useState("30");
  const [volatility, setVolatility] = React.useState("medium");
  const [trend, setTrend] = React.useState("neutral");

  const batchInsertPriceHistory = useMutation(
    api.priceHistory.createPriceHistory,
  );
  const clearPriceHistory = useMutation(api.priceHistory.deletePriceHistory);

  // Get existing price history count
  const existingHistory = useQuery(api.priceHistory.getStockHistoryCount, {
    stockId,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const numDays = parseInt(days);

      // Generate data using pure function (fast!)
      const priceData = generatePriceHistory({
        days: numDays,
        startPrice: stock.currentPrice,
        volatility:
          VOLATILITY_PRESETS[volatility as keyof typeof VOLATILITY_PRESETS],
        trend: TREND_PRESETS[trend as keyof typeof TREND_PRESETS],
        baseVolume: stock.volume ?? 1000000,
      });

      // Insert all data in one batch operation
      await batchInsertPriceHistory({
        stockId,
        priceData,
      });

      toast.success(`Generated ${numDays} days of price history!`);
    } catch (error) {
      console.error("Error generating data:", error);
      toast.error("Failed to generate price history");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearPriceHistory({ stockId });
      toast.success("Price history cleared!");
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear price history");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbDatabase className="h-5 w-5" />
          Price History Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
          <div className="flex items-center gap-2">
            <TbClock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Existing Records:</span>
          </div>
          <span className="font-mono font-bold">
            {existingHistory ?? 0} entries
          </span>
        </div>

        <Separator />

        {/* Generation Settings */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="days">Days to Generate</Label>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volatility">Volatility</Label>
            <Select value={volatility} onValueChange={setVolatility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (2%)</SelectItem>
                <SelectItem value="medium">Medium (5%)</SelectItem>
                <SelectItem value="high">High (10%)</SelectItem>
                <SelectItem value="extreme">Extreme (20%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trend">Market Trend</Label>
            <Select value={trend} onValueChange={setTrend}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bearish">Bearish 📉</SelectItem>
                <SelectItem value="neutral">Neutral ➡️</SelectItem>
                <SelectItem value="bullish">Bullish 📈</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-muted/20 border-primary rounded-lg border-l-4 p-3">
          <p className="text-muted-foreground mb-1 text-sm">Preview:</p>
          <p className="text-sm">
            Generate <strong>{days} days</strong> of OHLC data with{" "}
            <strong>{volatility}</strong> volatility and a{" "}
            <strong>{trend}</strong> trend, starting from{" "}
            <strong>${stock.currentPrice.toFixed(2)}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <TbRefresh className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TbTrendingUp className="mr-2 h-4 w-4" />
                Generate Data
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isGenerating || !existingHistory}
          >
            Clear History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
