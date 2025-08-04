"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  type CandlestickData,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
  CrosshairMode,
} from "lightweight-charts";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface CandlestickChartProps {
  stockId: Id<"stock">;
  days?: number;
}

export default function CandlestickChart({
  stockId,
  days = 50,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const theme = useTheme();
  const isMobile = useIsMobile()
  const isDark = theme.theme === "dark";

  const priceHistory = useQuery(api.priceHistory.getStockPriceHistory, {
    stockId,
  });

  useEffect(() => {
    if (!chartContainerRef.current || !priceHistory) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    chartRef.current = createChart(chartContainerRef.current!, {
      layout: {
        textColor: isDark ? "#ffffff" : "#000000",
        background: { color: "transparent" },
      },
      grid: {
        vertLines: { color: isDark ? "#2B2B43" : "#E1E3E6" },
        horzLines: { color: isDark ? "#2B2B43" : "#E1E3E6" },
      },
      timeScale: {
        borderColor: isDark ? "#485c7b" : "#D6DCEB",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 3,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      rightPriceScale: {
        visible: !isMobile,
        borderColor: isDark ? "#485c7b" : "#D6DCEB",
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      autoSize: true,
    });
    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {});

    const chartData = priceHistory
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((data) => ({
        time: (data.timestamp / 1000) as UTCTimestamp,
        open: data.openPrice,
        high: data.highPrice,
        low: data.lowPrice,
        close: data.closePrice,
      })) as CandlestickData[];

    console.log("Chart Data:", chartData);

    seriesRef.current.setData(chartData);

    if (chartData.length > days) {
      chartRef.current.timeScale().setVisibleRange({
        from: chartData[chartData.length - days]!.time,
        to: chartData[chartData.length - 1]!.time,
      });
    } else {
      chartRef.current.timeScale().fitContent();
    }
  }, [priceHistory, isDark, days]);

  return priceHistory ? (
    <div ref={chartContainerRef} className="h-full w-full" />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      Loading...
    </div>
  );
}
