"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CandlestickFinder_1 = require("./CandlestickFinder");
class GraveStoneDoji extends CandlestickFinder_1.default {
    constructor() {
        super();
        this.requiredCount = 1;
        this.name = 'GraveStoneDoji';
    }
    logic(data) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];
        let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
        let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
        return (isOpenEqualsClose && isLowEqualsClose && !isHighEqualsOpen);
    }
}
exports.default = GraveStoneDoji;
function gravestonedoji(data) {
    return new GraveStoneDoji().hasPattern(data);
}
exports.gravestonedoji = gravestonedoji;
