"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SarcasticStockGenerator = void 0;
// stockDataGenerator.ts - The main generator class
var SarcasticStockGenerator = /** @class */ (function () {
    function SarcasticStockGenerator() {
    }
    SarcasticStockGenerator.generateStockData = function (days, stockSymbol, includeNewsEvents, newsEventFrequency // 10% chance per day
    ) {
        if (includeNewsEvents === void 0) { includeNewsEvents = true; }
        if (newsEventFrequency === void 0) { newsEventFrequency = 0.1; }
        // Select stock parameters
        var parameters = stockSymbol
            ? this.RIDICULOUS_COMPANIES.find(function (s) { return s.symbol === stockSymbol; }) || this.RIDICULOUS_COMPANIES[0]
            : this.RIDICULOUS_COMPANIES[Math.floor(Math.random() * this.RIDICULOUS_COMPANIES.length)];
        var data = [];
        var newsEvents = [];
        var currentPrice = parameters.basePrice;
        var previousClose = currentPrice;
        var momentum = 0;
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        for (var i = 0; i < days; i++) {
            var date = new Date(startDate);
            date.setDate(date.getDate() + i);
            var dateString = date.toISOString().split('T')[0];
            // Check for news events
            var newsMultiplier = 1;
            if (includeNewsEvents && Math.random() < newsEventFrequency) {
                var newsTemplate = this.RIDICULOUS_NEWS_EVENTS[Math.floor(Math.random() * this.RIDICULOUS_NEWS_EVENTS.length)];
                var newsEvent = __assign(__assign({}, newsTemplate), { date: dateString });
                newsEvents.push(newsEvent);
                newsMultiplier = 1 + (newsEvent.impact / 100);
            }
            // Apply existing news event effects
            for (var _i = 0, newsEvents_1 = newsEvents; _i < newsEvents_1.length; _i++) {
                var event_1 = newsEvents_1[_i];
                var eventDate = new Date(event_1.date);
                var daysSinceEvent = Math.floor((date.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceEvent >= 0 && daysSinceEvent < event_1.duration) {
                    var decayFactor = 1 - (daysSinceEvent / event_1.duration);
                    newsMultiplier *= 1 + ((event_1.impact / 100) * decayFactor * 0.3);
                }
            }
            // Calculate overnight gap
            var openPrice = previousClose;
            if (Math.random() < parameters.gapProbability) {
                var gapDirection = Math.random() < 0.5 ? -1 : 1;
                var gapSize = Math.random() * parameters.maxGapPercent;
                openPrice = previousClose * (1 + (gapDirection * gapSize * newsMultiplier));
            }
            // Update momentum based on trend
            momentum = momentum * 0.8 + (Math.random() - 0.5) * 0.4;
            momentum += parameters.trendBias * 0.1;
            // Calculate base price movement
            var randomWalk = (Math.random() - 0.5) * 2; // -1 to 1
            var volatilityMove = randomWalk * parameters.volatility;
            var momentumMove = momentum * parameters.momentum;
            var trendMove = parameters.trendBias * 0.05;
            // Apply FOMO and panic selling
            var fomoFactor = 1;
            if (volatilityMove > 0.2) {
                fomoFactor = parameters.fomoMultiplier;
            }
            else if (volatilityMove < -0.3) {
                fomoFactor = parameters.panicSellFactor;
            }
            // Meme stock factor for random pumps
            var memeMultiplier = 1;
            if (Math.random() < 0.02) { // 2% chance of meme event
                memeMultiplier = 1 + (Math.random() * parameters.memeStockFactor);
            }
            // Calculate price change
            var totalMove = (volatilityMove + momentumMove + trendMove) * newsMultiplier * fomoFactor * memeMultiplier;
            var priceMultiplier = 1 + totalMove;
            // Calculate OHLC
            var dayOpen = Math.max(0.01, openPrice);
            var dayClose = Math.max(0.01, dayOpen * priceMultiplier);
            // Intraday high/low with extreme swings
            var intradayVolatility = parameters.volatility * 0.5;
            var highMultiplier = 1 + Math.random() * intradayVolatility * 2;
            var lowMultiplier = 1 - Math.random() * intradayVolatility * 2;
            var dayHigh = Math.max(dayOpen, dayClose) * highMultiplier;
            var dayLow = Math.max(0.01, Math.min(dayOpen, dayClose) * lowMultiplier);
            // Bankruptcy check
            if (Math.random() < parameters.bankruptcyRisk) {
                newsEvents.push({
                    date: dateString,
                    type: 'BANKRUPTCY',
                    impact: -99,
                    duration: 1,
                    description: "".concat(parameters.name, " declares bankruptcy after CEO loses password to company bank account")
                });
            }
            // Stock split check
            if (dayClose > 1000 && Math.random() < parameters.splitProbability) {
                var splitRatio = Math.floor(Math.random() * 10) + 2; // 2:1 to 11:1 splits
                newsEvents.push({
                    date: dateString,
                    type: 'PUMP',
                    impact: 5,
                    duration: 1,
                    description: "".concat(splitRatio, ":1 stock split announced")
                });
            }
            // Generate ridiculous volume
            var baseVolume = Math.floor(Math.random() * 10000000) + 100000;
            var volumeMultiplier = Math.abs(totalMove) * 10 + 1;
            var volume = Math.floor(baseVolume * volumeMultiplier * newsMultiplier);
            data.push({
                date: dateString,
                openPrice: Number(dayOpen.toFixed(2)),
                closePrice: Number(dayClose.toFixed(2)),
                highPrice: Number(dayHigh.toFixed(2)),
                lowPrice: Number(dayLow.toFixed(2)),
                volume: volume,
                marketCap: Math.floor(dayClose * volume * (Math.random() * 10 + 1))
            });
            previousClose = dayClose;
            currentPrice = dayClose;
        }
        return { data: data, newsEvents: newsEvents, parameters: parameters };
    };
    SarcasticStockGenerator.generateMultipleStocks = function (days, stockCount, includeNewsEvents) {
        if (stockCount === void 0) { stockCount = 5; }
        if (includeNewsEvents === void 0) { includeNewsEvents = true; }
        var result = {};
        var selectedStocks = __spreadArray([], this.RIDICULOUS_COMPANIES, true).sort(function () { return Math.random() - 0.5; })
            .slice(0, Math.min(stockCount, this.RIDICULOUS_COMPANIES.length));
        for (var _i = 0, selectedStocks_1 = selectedStocks; _i < selectedStocks_1.length; _i++) {
            var stock = selectedStocks_1[_i];
            result[stock.symbol] = this.generateStockData(days, stock.symbol, includeNewsEvents, 0.05 + Math.random() * 0.15 // 5-20% news frequency
            );
        }
        return result;
    };
    SarcasticStockGenerator.exportToJSON = function (data, filename) {
        if (filename === void 0) { filename = 'stock_data.json'; }
        return JSON.stringify(data, null, 2);
    };
    SarcasticStockGenerator.printSummary = function (stockData) {
        var data = stockData.data, newsEvents = stockData.newsEvents, parameters = stockData.parameters;
        var firstDay = data[0];
        var lastDay = data[data.length - 1];
        var totalReturn = ((lastDay.closePrice - firstDay.openPrice) / firstDay.openPrice) * 100;
        console.log("\n\uD83D\uDCCA ".concat(parameters.name, " (").concat(parameters.symbol, ")"));
        console.log("\uD83D\uDCC5 Period: ".concat(data.length, " days"));
        console.log("\uD83D\uDCB0 Start Price: $".concat(firstDay.openPrice.toFixed(2)));
        console.log("\uD83D\uDCB0 End Price: $".concat(lastDay.closePrice.toFixed(2)));
        console.log("\uD83D\uDCC8 Total Return: ".concat(totalReturn.toFixed(2), "%"));
        console.log("\uD83D\uDCF0 News Events: ".concat(newsEvents.length));
        console.log("\uD83C\uDFA2 Max Price: $".concat(Math.max.apply(Math, data.map(function (d) { return d.highPrice; })).toFixed(2)));
        console.log("\uD83D\uDD73\uFE0F  Min Price: $".concat(Math.min.apply(Math, data.map(function (d) { return d.lowPrice; })).toFixed(2)));
        if (newsEvents.length > 0) {
            console.log("\n\uD83D\uDCF0 Recent News Events:");
            newsEvents.slice(-3).forEach(function (event) {
                console.log("  \u2022 ".concat(event.date, ": ").concat(event.description, " (").concat(event.impact > 0 ? '+' : '').concat(event.impact, "%)"));
            });
        }
    };
    SarcasticStockGenerator.RIDICULOUS_COMPANIES = [
        {
            symbol: 'YOLO',
            name: 'You Only Live Once Technologies',
            basePrice: 420.69,
            volatility: 0.85, // 85% daily volatility (absolutely insane)
            trendBias: 0.1,
            momentum: 0.3,
            gapProbability: 0.4,
            maxGapPercent: 2.5, // 250% overnight gaps
            splitProbability: 0.05,
            bankruptcyRisk: 0.001,
            memeStockFactor: 15,
            fomoMultiplier: 3.5,
            panicSellFactor: 0.1 // Can lose 90% in panic
        },
        {
            symbol: 'MOON',
            name: 'To The Moon Aerospace',
            basePrice: 69.42,
            volatility: 1.2, // 120% daily volatility (completely unhinged)
            trendBias: 0.8, // Very bullish
            momentum: 0.5,
            gapProbability: 0.6,
            maxGapPercent: 5.0, // 500% gaps because why not
            splitProbability: 0.08,
            bankruptcyRisk: 0.002,
            memeStockFactor: 25,
            fomoMultiplier: 10,
            panicSellFactor: 0.05 // Can lose 95%
        },
        {
            symbol: 'BRRRR',
            name: 'Money Printer Goes Brrr Corp',
            basePrice: 1337.42,
            volatility: 0.6,
            trendBias: -0.2, // Slightly bearish
            momentum: 0.4,
            gapProbability: 0.3,
            maxGapPercent: 1.8,
            splitProbability: 0.03,
            bankruptcyRisk: 0.0005,
            memeStockFactor: 8,
            fomoMultiplier: 2.5,
            panicSellFactor: 0.25
        },
        {
            symbol: 'HODL',
            name: 'Diamond Hands Investment Group',
            basePrice: 888.88,
            volatility: 0.95,
            trendBias: 0.6,
            momentum: 0.7, // High momentum
            gapProbability: 0.5,
            maxGapPercent: 3.0,
            splitProbability: 0.06,
            bankruptcyRisk: 0.001,
            memeStockFactor: 20,
            fomoMultiplier: 8,
            panicSellFactor: 0.08
        },
        {
            symbol: 'REKT',
            name: 'Get Rekt Financial Services',
            basePrice: 13.37,
            volatility: 2.5, // 250% volatility - absolutely mental
            trendBias: -0.8, // Very bearish
            momentum: 0.2,
            gapProbability: 0.8, // Gaps almost every day
            maxGapPercent: 8.0, // 800% gaps for maximum chaos
            splitProbability: 0.01, // Rarely splits because it keeps crashing
            bankruptcyRisk: 0.01, // 1% chance daily of going broke
            memeStockFactor: 30,
            fomoMultiplier: 1.5,
            panicSellFactor: 0.02 // Can lose 98%
        }
    ];
    SarcasticStockGenerator.ABSURD_NEWS_EVENTS = [
        {
            type: 'ELON_TWEET',
            impact: 5.0,
            duration: 3,
            description: 'Elon Musk tweets a rocket emoji'
        },
        {
            type: 'MEME',
            impact: 15.0,
            duration: 7,
            description: 'Goes viral on WallStreetBets'
        },
        {
            type: 'FDA_APPROVAL',
            impact: 8.0,
            duration: 5,
            description: 'FDA approves their new flavor of energy drink'
        },
        {
            type: 'MERGER',
            impact: 12.0,
            duration: 14,
            description: 'Announces merger with a company that doesn\'t exist'
        },
        {
            type: 'HACK',
            impact: -6.0,
            duration: 10,
            description: 'Gets hacked by teenagers using a calculator'
        },
        {
            type: 'BANKRUPTCY',
            impact: -20.0,
            duration: 30,
            description: 'CEO accidentally spends entire treasury on NFTs'
        },
        {
            type: 'EARNINGS',
            impact: 25.0,
            duration: 2,
            description: 'Reports earnings of $420.69 trillion (typo in press release)'
        },
        {
            type: 'PUMP',
            impact: 50.0,
            duration: 1,
            description: 'Pump and dump scheme by AI trading bots'
        },
        {
            type: 'DUMP',
            impact: -30.0,
            duration: 4,
            description: 'Mass sell-off after CEO says "YEET" during earnings call'
        }
    ];
    return SarcasticStockGenerator;
}());
exports.SarcasticStockGenerator = SarcasticStockGenerator;
// Example usage and CLI interface
if (require.main === module) {
    // Command line usage
    var args = process.argv.slice(2);
    var days = parseInt(args[0]) || 90;
    var symbol = args[1] || undefined;
    var includeNews = args[2] !== 'false';
    console.log('🚀 Generating sarcastically extreme stock data...\n');
    if (symbol) {
        var result = SarcasticStockGenerator.generateStockData(days, symbol, includeNews);
        SarcasticStockGenerator.printSummary(result);
        // Save to file
        var fs = require('fs');
        fs.writeFileSync("".concat(symbol, "_data.json"), SarcasticStockGenerator.exportToJSON(result));
        console.log("\n\uD83D\uDCBE Data saved to ".concat(symbol, "_data.json"));
    }
    else {
        var results = SarcasticStockGenerator.generateMultipleStocks(days, 3, includeNews);
        Object.values(results).forEach(function (result) {
            SarcasticStockGenerator.printSummary(result);
        });
        // Save all data
        var fs = require('fs');
        fs.writeFileSync('all_stocks_data.json', SarcasticStockGenerator.exportToJSON(results));
        console.log("\n\uD83D\uDCBE All data saved to all_stocks_data.json");
    }
}
exports.default = SarcasticStockGenerator;
