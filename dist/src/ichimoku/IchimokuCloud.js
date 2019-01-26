"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicator_1 = require("../indicator/indicator");
const FixedSizeLinkedList_1 = require("../Utils/FixedSizeLinkedList");
class IchimokuCloudInput extends indicator_1.IndicatorInput {
    constructor() {
        super(...arguments);
        this.conversionPeriod = 9;
        this.basePeriod = 26;
        this.spanPeriod = 52;
        this.displacement = 26;
    }
}
exports.IchimokuCloudInput = IchimokuCloudInput;
class IchimokuCloudOutput {
}
exports.IchimokuCloudOutput = IchimokuCloudOutput;
class IchimokuCloud extends indicator_1.Indicator {
    constructor(input) {
        super(input);
        this.result = [];
        var defaults = {
            conversionPeriod: 9,
            basePeriod: 26,
            spanPeriod: 52,
            displacement: 26
        };
        var params = Object.assign({}, defaults, input);
        var currentConversionData = new FixedSizeLinkedList_1.default(params.conversionPeriod * 2, true, true, false);
        var currentBaseData = new FixedSizeLinkedList_1.default(params.basePeriod * 2, true, true, false);
        var currenSpanData = new FixedSizeLinkedList_1.default(params.spanPeriod * 2, true, true, false);
        this.generator = (function* () {
            let result;
            let tick;
            let period = Math.max(params.conversionPeriod, params.basePeriod, params.spanPeriod, params.displacement);
            let periodCounter = 1;
            tick = yield;
            while (true) {
                currentConversionData.push(tick.high);
                currentConversionData.push(tick.low);
                currentBaseData.push(tick.high);
                currentBaseData.push(tick.low);
                currenSpanData.push(tick.high);
                currenSpanData.push(tick.low);
                if (periodCounter < period) {
                    periodCounter++;
                }
                else {
                    let conversionLine = (currentConversionData.periodHigh + currentConversionData.periodLow) / 2;
                    let baseLine = (currentBaseData.periodHigh + currentBaseData.periodLow) / 2;
                    let spanA = (conversionLine + baseLine) / 2;
                    let spanB = (currenSpanData.periodHigh + currenSpanData.periodLow) / 2;
                    result = {
                        conversion: conversionLine,
                        base: baseLine,
                        spanA: spanA,
                        spanB: spanB
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        input.low.forEach((tick, index) => {
            var result = this.generator.next({
                high: input.high[index],
                low: input.low[index],
            });
            if (result.value) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        return this.generator.next(price).value;
    }
}
IchimokuCloud.calculate = ichimokucloud;
exports.IchimokuCloud = IchimokuCloud;
function ichimokucloud(input) {
    indicator_1.Indicator.reverseInputs(input);
    var result = new IchimokuCloud(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    indicator_1.Indicator.reverseInputs(input);
    return result;
}
exports.ichimokucloud = ichimokucloud;
;
