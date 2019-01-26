"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HangingMan_1 = require("./HangingMan");
class HangingManUnconfirmed extends HangingMan_1.default {
    constructor() {
        super();
        this.name = 'HangingManUnconfirmed';
    }
    logic(data) {
        let isPattern = this.upwardTrend(data, false);
        isPattern = isPattern && this.includesHammer(data, false);
        return isPattern;
    }
}
exports.default = HangingManUnconfirmed;
function hangingmanunconfirmed(data) {
    return new HangingManUnconfirmed().hasPattern(data);
}
exports.hangingmanunconfirmed = hangingmanunconfirmed;
