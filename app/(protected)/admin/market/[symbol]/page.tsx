import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriceHistoryGenerator } from "@/components/admin/price-history-generator";
import { TbChartLine } from "react-icons/tb";

export default async function AdminStockDetailsPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  const stock = await fetchQuery(api.stock.getStockBySymbol, { symbol });

  if (!stock || stock === null) {
    return notFound();
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin: {stock.name}</h1>
          <p className="text-muted-foreground">{stock.symbol}</p>
        </div>
        <Badge variant={stock.isActive ? "default" : "secondary"}>
          {stock.isActive ? "Active" : "Inactive"}
        </Badge>
        {stock.isFrozen && <Badge variant="destructive">Frozen</Badge>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stock Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TbChartLine className="h-5 w-5" />
              Stock Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Current Price
              </span>
              <span className="font-mono font-bold">
                ${stock.currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Open Price</span>
              <span className="font-mono">
                ${stock.openPrice?.toFixed(2) ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Previous Close
              </span>
              <span className="font-mono">
                ${stock.previousClosePrice?.toFixed(2) ?? "N/A"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Volume</span>
              <span className="font-mono">
                {stock.volume?.toLocaleString() ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Market Cap</span>
              <span className="font-mono">
                {stock.marketCap
                  ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Price History Generator */}
        <div className="lg:col-span-2">
          <PriceHistoryGenerator stockId={stock._id} stock={stock} />
        </div>
      </div>
    </div>
  );
}
