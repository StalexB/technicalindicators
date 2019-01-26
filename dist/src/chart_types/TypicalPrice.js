"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indicator_1 = require("../indicator/indicator");
class TypicalPriceInput extends indicator_1.IndicatorInput {
}
exports.TypicalPriceInput = TypicalPriceInput;
class TypicalPrice extends indicator_1.Indicator {
    constructor(input) {
        super(input);
        this.result = [];
        this.generator = (function* () {
            let priceInput = yield;
            while (true) {
                priceInput = yield (priceInput.high + priceInput.low + priceInput.close) / 3;
            }
        })();
        this.generator.next();
        input.low.forEach((tick, index) => {
            var result = this.generator.next({
                high: input.high[index],
                low: input.low[index],
                close: input.close[index],
            });
            this.result.push(result.value);
        });
    }
    nextValue(price) {
        var result = this.generator.next(price).value;
        return result;
    }
    ;
}
TypicalPrice.calculate = typicalprice;
exports.TypicalPrice = TypicalPrice;
function typicalprice(input) {
    indicator_1.Indicator.reverseInputs(input);
    var result = new TypicalPrice(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    indicator_1.Indicator.reverseInputs(input);
    return result;
}
exports.typicalprice = typicalprice;
;
