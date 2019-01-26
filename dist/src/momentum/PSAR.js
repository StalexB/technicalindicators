"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicator_1 = require("../indicator/indicator");
"use strict";
class PSARInput extends indicator_1.IndicatorInput {
}
exports.PSARInput = PSARInput;
;
class PSAR extends indicator_1.Indicator {
    constructor(input) {
        super(input);
        let highs = input.high || [];
        let lows = input.low || [];
        var genFn = function* (step, max) {
            let curr, extreme, sar, furthest;
            let up = true;
            let accel = step;
            let prev = yield;
            while (true) {
                if (curr) {
                    sar = sar + accel * (extreme - sar);
                    if (up) {
                        sar = Math.min(sar, furthest.low, prev.low);
                        if (curr.high > extreme) {
                            extreme = curr.high;
                            accel = Math.min(accel + step, max);
                        }
                        ;
                    }
                    else {
                        sar = Math.max(sar, furthest.high, prev.high);
                        if (curr.low < extreme) {
                            extreme = curr.low;
                            accel = Math.min(accel + step, max);
                        }
                    }
                    if ((up && curr.low < sar) || (!up && curr.high > sar)) {
                        accel = step;
                        sar = extreme;
                        up = !up;
                        extreme = !up ? curr.low : curr.high;
                    }
                }
                else {
                    sar = prev.low;
                    extreme = prev.high;
                }
                furthest = prev;
                if (curr)
                    prev = curr;
                curr = yield sar;
            }
        };
        this.result = [];
        this.generator = genFn(input.step, input.max);
        this.generator.next();
        lows.forEach((tick, index) => {
            var result = this.generator.next({
                high: highs[index],
                low: lows[index],
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
PSAR.calculate = psar;
exports.PSAR = PSAR;
function psar(input) {
    indicator_1.Indicator.reverseInputs(input);
    var result = new PSAR(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    indicator_1.Indicator.reverseInputs(input);
    return result;
}
exports.psar = psar;
;
