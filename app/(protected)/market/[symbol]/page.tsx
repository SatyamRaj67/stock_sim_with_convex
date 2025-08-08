import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  TbTrendingUp,
  TbTrendingDown,
  TbArrowLeft,
  TbHeart,
  TbShoppingCart,
  TbEye,
  TbBuilding,
  TbCalendar,
  TbChartLine,
  TbCurrency,
} from "react-icons/tb";
import CandlestickChart from "@/components/charts/candlestick-chart";

export default async function StockDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  const stock = await fetchQuery(api.stock.getStockBySymbol, { symbol });

  if (!stock || stock === null) {
    return notFound();
  }

  const latestPriceHistory = await fetchQuery(
    api.priceHistory.getLatestPriceHistory,
    {
      stockId: stock._id,
    },
  );

  // Calculate price change (mock data - you can fetch from priceHistory)
  const priceChange = stock.previousClosePrice
    ? stock.currentPrice - stock.previousClosePrice
    : 0;
  const priceChangePercent = stock.previousClosePrice
    ? (priceChange / stock.previousClosePrice) * 100
    : 0;

  const isPositive = priceChange >= 0;

  return (
    <div className="container mx-auto space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link href="/market">
              <TbArrowLeft className="h-4 w-4" />
              Back to Market
            </Link>
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <div className="flex items-center gap-3">
            <Image
              src={stock.logoUrl ?? "/placeholder.svg"}
              alt={`${stock.name} logo`}
              width={40}
              height={40}
              className="rounded-full object-cover sm:h-12 sm:w-12"
            />
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{stock.name}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {stock.symbol}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col gap-2 sm:hidden">
          <Button size="sm" className="w-full">
            <TbShoppingCart className="mr-2 h-4 w-4" />
            Buy Stock
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <TbHeart className="mr-2 h-4 w-4" />
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Price Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {/* Current Price */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <p className="text-muted-foreground mb-1 text-xs sm:text-sm">
                Current Price
              </p>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                <span className="text-2xl font-bold sm:text-3xl">
                  ${stock.currentPrice.toFixed(2)}
                </span>
                <div
                  className={`flex items-center gap-1 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TbTrendingUp className="h-4 w-4" />
                  ) : (
                    <TbTrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium sm:text-sm">
                    {isPositive ? "+" : ""}${priceChange.toFixed(2)} (
                    {isPositive ? "+" : ""}
                    {priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Open Price */}
            <div>
              <p className="text-muted-foreground mb-1 text-xs sm:text-sm">
                Open
              </p>
              <p className="text-lg font-semibold sm:text-xl">
                ${stock.openPrice?.toFixed(2) ?? "N/A"}
              </p>
            </div>

            {/* Previous Close */}
            <div>
              <p className="text-muted-foreground mb-1 text-xs sm:text-sm">
                Previous Close
              </p>
              <p className="text-lg font-semibold sm:text-xl">
                ${stock.previousClosePrice?.toFixed(2) ?? "N/A"}
              </p>
            </div>

            {/* Volume */}
            <div>
              <p className="text-muted-foreground mb-1 text-xs sm:text-sm">
                Volume
              </p>
              <p className="text-lg font-semibold sm:text-xl">
                {stock.volume?.toLocaleString() ?? "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Stock Information */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          {/* Company Overview */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <TbBuilding className="h-4 w-4 md:h-5 md:w-5" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {stock.description && (
                <div>
                  <h4 className="mb-2 text-sm font-medium md:text-base">
                    About
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {stock.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium md:text-base">
                    Sector
                  </h4>
                  <Badge
                    variant="secondary"
                    className="flex w-fit items-center gap-1 text-xs"
                  >
                    <TbChartLine className="h-3 w-3" />
                    {stock.sector ?? "N/A"}
                  </Badge>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium md:text-base">
                    Market Cap
                  </h4>
                  <div className="flex items-center gap-1">
                    <TbCurrency className="text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-mono text-xs sm:text-sm">
                      {stock.marketCap
                        ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <TbChartLine className="h-4 w-4 md:h-5 md:w-5" />
                Price Chart
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-4">
              <div className="h-[300px] w-full sm:h-[400px] md:h-[500px]">
                <CandlestickChart stockId={stock._id} days={90} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Status
                </span>
                <div className="flex gap-2">
                  <Badge
                    variant={stock.isActive ? "default" : "outline"}
                    className="text-xs"
                  >
                    {stock.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {stock.isFrozen && (
                    <Badge variant="destructive" className="text-xs">
                      Frozen
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Symbol
                </span>
                <span className="font-mono text-xs font-medium sm:text-sm">
                  {stock.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Created
                </span>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <TbCalendar className="h-3 w-3" />
                  {new Date(stock._creationTime).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Actions - Hidden on mobile, shown in header */}
          <Card className="hidden sm:block">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">
                Trading Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg">
                <TbShoppingCart className="mr-2 h-4 w-4" />
                Buy Stock
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <TbHeart className="mr-2 h-4 w-4" />
                Add to Watchlist
              </Button>
              <Button variant="ghost" className="w-full" size="lg">
                <TbEye className="mr-2 h-4 w-4" />
                View Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Market Data */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Market Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Open</span>
                  <span className="font-mono">
                    ${latestPriceHistory?.openPrice?.toFixed(2) ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Previous Close</span>
                  <span className="font-mono">
                    ${latestPriceHistory?.closePrice?.toFixed(2) ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-mono">
                    {latestPriceHistory?.volume?.toLocaleString() ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-mono">
                    {stock.marketCap
                      ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
