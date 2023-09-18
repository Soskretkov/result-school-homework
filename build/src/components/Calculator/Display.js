"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Display_module_scss_1 = __importDefault(require("./Display.module.scss"));
function Display({ value = 'ERROR', isResult }) {
    const displayClass = isResult ? Display_module_scss_1.default.result : Display_module_scss_1.default.input;
    return (react_1.default.createElement("div", { className: `${displayClass} ${Display_module_scss_1.default.display}` }, value));
}
exports.default = Display;
//# sourceMappingURL=Display.js.map