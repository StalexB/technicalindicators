"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CandlestickFinder_1 = require("./CandlestickFinder");
const AverageLoss_1 = require("../Utils/AverageLoss");
const AverageGain_1 = require("../Utils/AverageGain");
class TweezerTop extends CandlestickFinder_1.default {
    constructor() {
        super();
        this.name = 'TweezerTop';
        this.requiredCount = 5;
    }
    logic(data) {
        return this.upwardTrend(data) && data.high[3] == data.high[4];
    }
    upwardTrend(data) {
        let gains = AverageGain_1.averagegain({ values: data.close.slice(0, 3), period: 2 });
        let losses = AverageLoss_1.averageloss({ values: data.close.slice(0, 3), period: 2 });
        return gains > losses;
    }
}
exports.default = TweezerTop;
function tweezertop(data) {
    return new TweezerTop().hasPattern(data);
}
exports.tweezertop = tweezertop;
