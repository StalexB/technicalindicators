import { IndicatorInput, Indicator } from '../indicator/indicator';
"use strict";
import LinkedList from '../Utils/FixedSizeLinkedList';
import { SMA } from '../moving_averages/SMA';
export class StochasticInput extends IndicatorInput {
}
;
export class StochasticOutput {
}
;
export class Stochastic extends Indicator {
    constructor(input) {
        super(input);
        let lows = input.low;
        let highs = input.high;
        let closes = input.close;
        let period = input.period;
        let signalPeriod = input.signalPeriod;
        let format = this.format;
        if (!((lows.length === highs.length) && (highs.length === closes.length))) {
            throw ('Inputs(low,high, close) not of equal size');
        }
        this.result = [];
        this.generator = (function* () {
            let index = 1;
            let pastHighPeriods = new LinkedList(period, true, false);
            let pastLowPeriods = new LinkedList(period, false, true);
            let dSma = new SMA({
                period: signalPeriod,
                values: [],
                format: (v) => { return v; }
            });
            let k, d;
            var tick = yield;
            while (true) {
                pastHighPeriods.push(tick.high);
                pastLowPeriods.push(tick.low);
                if (index < period) {
                    index++;
                    tick = yield;
                    continue;
                }
                let periodLow = pastLowPeriods.periodLow;
                k = (tick.close - periodLow) / (pastHighPeriods.periodHigh - periodLow) * 100;
                k = isNaN(k) ? 0 : k;
                d = dSma.nextValue(k);
                tick = yield {
                    k: format(k),
                    d: (d !== undefined) ? format(d) : undefined
                };
            }
        })();
        this.generator.next();
        lows.forEach((tick, index) => {
            var result = this.generator.next({
                high: highs[index],
                low: lows[index],
                close: closes[index]
            });
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    ;
    nextValue(input) {
        let nextResult = this.generator.next(input);
        if (nextResult.value !== undefined)
            return nextResult.value;
    }
    ;
}
Stochastic.calculate = stochastic;
export function stochastic(input) {
    Indicator.reverseInputs(input);
    var result = new Stochastic(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
;
