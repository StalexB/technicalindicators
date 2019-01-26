"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let config = {};
function setConfig(key, value) {
    config[key] = value;
}
exports.setConfig = setConfig;
function getConfig(key) {
    return config[key];
}
exports.getConfig = getConfig;
