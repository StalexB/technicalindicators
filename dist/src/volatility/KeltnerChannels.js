"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicator_1 = require("../indicator/indicator");
const SMA_1 = require("../moving_averages/SMA");
const EMA_1 = require("../moving_averages/EMA");
const ATR_1 = require("../directionalmovement/ATR");
class KeltnerChannelsInput extends indicator_1.IndicatorInput {
    constructor() {
        super(...arguments);
        this.maPeriod = 20;
        this.atrPeriod = 10;
        this.useSMA = false;
        this.multiplier = 1;
    }
}
exports.KeltnerChannelsInput = KeltnerChannelsInput;
class KeltnerChannelsOutput extends indicator_1.IndicatorInput {
}
exports.KeltnerChannelsOutput = KeltnerChannelsOutput;
;
class KeltnerChannels extends indicator_1.Indicator {
    constructor(input) {
        super(input);
        var maType = input.useSMA ? SMA_1.SMA : EMA_1.EMA;
        var maProducer = new maType({ period: input.maPeriod, values: [], format: (v) => { return v; } });
        var atrProducer = new ATR_1.ATR({ period: input.atrPeriod, high: [], low: [], close: [], format: (v) => { return v; } });
        var tick;
        this.result = [];
        this.generator = (function* () {
            var KeltnerChannelsOutput;
            var result;
            tick = yield;
            while (true) {
                var { close } = tick;
                var ma = maProducer.nextValue(close);
                var atr = atrProducer.nextValue(tick);
                if (ma != undefined && atr != undefined) {
                    result = {
                        middle: ma,
                        upper: ma + (input.multiplier * (atr)),
                        lower: ma - (input.multiplier * (atr))
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        var highs = input.high;
        highs.forEach((tickHigh, index) => {
            var tickInput = {
                high: tickHigh,
                low: input.low[index],
                close: input.close[index],
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
KeltnerChannels.calculate = keltnerchannels;
exports.KeltnerChannels = KeltnerChannels;
function keltnerchannels(input) {
    indicator_1.Indicator.reverseInputs(input);
    var result = new KeltnerChannels(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    indicator_1.Indicator.reverseInputs(input);
    return result;
}
exports.keltnerchannels = keltnerchannels;
;
