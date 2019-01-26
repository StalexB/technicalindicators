"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicator_1 = require("../indicator/indicator");
const ATR_1 = require("../directionalmovement/ATR");
const FixedSizeLinkedList_1 = require("../Utils/FixedSizeLinkedList");
class ChandelierExitInput extends indicator_1.IndicatorInput {
    constructor() {
        super(...arguments);
        this.period = 22;
        this.multiplier = 3;
    }
}
exports.ChandelierExitInput = ChandelierExitInput;
class ChandelierExitOutput extends indicator_1.IndicatorInput {
}
exports.ChandelierExitOutput = ChandelierExitOutput;
;
class ChandelierExit extends indicator_1.Indicator {
    constructor(input) {
        super(input);
        var highs = input.high;
        var lows = input.low;
        var closes = input.close;
        this.result = [];
        var atrProducer = new ATR_1.ATR({ period: input.period, high: [], low: [], close: [], format: (v) => { return v; } });
        var dataCollector = new FixedSizeLinkedList_1.default(input.period * 2, true, true, false);
        this.generator = (function* () {
            var result;
            var tick = yield;
            var atr;
            while (true) {
                var { high, low } = tick;
                dataCollector.push(high);
                dataCollector.push(low);
                atr = atrProducer.nextValue(tick);
                if ((dataCollector.totalPushed >= (2 * input.period)) && atr != undefined) {
                    result = {
                        exitLong: dataCollector.periodHigh - atr * input.multiplier,
                        exitShort: dataCollector.periodLow + atr * input.multiplier
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        highs.forEach((tickHigh, index) => {
            var tickInput = {
                high: tickHigh,
                low: lows[index],
                close: closes[index],
            };
            var result = this.generator.next(tickInput);
            if (result.value != undefined) {
                this.result.push(result.value);
            }
        });
    }
    ;
    nextValue(price) {
        var result = this.generator.next(price);
        if (result.value != undefined) {
            return result.value;
        }
    }
    ;
}
ChandelierExit.calculate = chandelierexit;
exports.ChandelierExit = ChandelierExit;
function chandelierexit(input) {
    indicator_1.Indicator.reverseInputs(input);
    var result = new ChandelierExit(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    indicator_1.Indicator.reverseInputs(input);
    return result;
}
exports.chandelierexit = chandelierexit;
;
