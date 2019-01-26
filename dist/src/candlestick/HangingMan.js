"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CandlestickFinder_1 = require("./CandlestickFinder");
const AverageLoss_1 = require("../Utils/AverageLoss");
const AverageGain_1 = require("../Utils/AverageGain");
const BearishHammerStick_1 = require("./BearishHammerStick");
const BullishHammerStick_1 = require("./BullishHammerStick");
class HangingMan extends CandlestickFinder_1.default {
    constructor() {
        super();
        this.name = 'HangingMan';
        this.requiredCount = 5;
    }
    logic(data) {
        let isPattern = this.upwardTrend(data);
        isPattern = isPattern && this.includesHammer(data);
        isPattern = isPattern && this.hasConfirmation(data);
        return isPattern;
    }
    upwardTrend(data, confirm = true) {
        let end = confirm ? 3 : 4;
        let gains = AverageGain_1.averagegain({ values: data.close.slice(0, end), period: end - 1 });
        let losses = AverageLoss_1.averageloss({ values: data.close.slice(0, end), period: end - 1 });
        return gains > losses;
    }
    includesHammer(data, confirm = true) {
        let start = confirm ? 3 : 4;
        let end = confirm ? 4 : undefined;
        let possibleHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };
        let isPattern = BearishHammerStick_1.bearishhammerstick(possibleHammerData);
        isPattern = isPattern || BullishHammerStick_1.bullishhammerstick(possibleHammerData);
        return isPattern;
    }
    hasConfirmation(data) {
        let possibleHammer = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        };
        let possibleConfirmation = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        };
        let isPattern = possibleConfirmation.open > possibleConfirmation.close;
        return isPattern && possibleHammer.close > possibleConfirmation.close;
    }
}
exports.default = HangingMan;
function hangingman(data) {
    return new HangingMan().hasPattern(data);
}
exports.hangingman = hangingman;
