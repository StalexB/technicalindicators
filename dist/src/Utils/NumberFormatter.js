"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
function format(v) {
    let precision = config_1.getConfig('precision');
    if (precision) {
        return parseFloat(v.toPrecision(precision));
    }
    return v;
}
exports.format = format;
