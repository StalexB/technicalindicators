"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockData {
    constructor(open, high, low, close, reversedInput) {
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.reversedInput = reversedInput;
    }
}
exports.default = StockData;
class CandleData {
}
exports.CandleData = CandleData;
class CandleList {
    constructor() {
        this.open = [];
        this.high = [];
        this.low = [];
        this.close = [];
        this.volume = [];
        this.timestamp = [];
    }
}
exports.CandleList = CandleList;
