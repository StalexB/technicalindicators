"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CandlestickFinder_1 = require("./CandlestickFinder");
const AverageLoss_1 = require("../Utils/AverageLoss");
const AverageGain_1 = require("../Utils/AverageGain");
class TweezerBottom extends CandlestickFinder_1.default {
    constructor() {
        super();
        this.name = 'TweezerBottom';
        this.requiredCount = 5;
    }
    logic(data) {
        return this.downwardTrend(data) && data.low[3] == data.low[4];
    }
    downwardTrend(data) {
        let gains = AverageGain_1.averagegain({ values: data.close.slice(0, 3), period: 2 });
        let losses = AverageLoss_1.averageloss({ values: data.close.slice(0, 3), period: 2 });
        return losses > gains;
    }
}
exports.default = TweezerBottom;
function tweezerbottom(data) {
    return new TweezerBottom().hasPattern(data);
}
exports.tweezerbottom = tweezerbottom;
