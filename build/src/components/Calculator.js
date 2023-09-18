"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Keypad_1 = __importDefault(require("./Calculator/Keypad"));
const Display_1 = __importDefault(require("./Calculator/Display"));
const Calculator_module_scss_1 = __importDefault(require("./Calculator.module.scss"));
function handleButtonClick(name) {
    console.log(name);
}
function Calculator() {
    return (react_1.default.createElement("div", { className: Calculator_module_scss_1.default.calculator },
        react_1.default.createElement(Display_1.default, { value: '0', isResult: false }),
        react_1.default.createElement(Keypad_1.default, { onClick: handleButtonClick })));
}
exports.default = Calculator;
//# sourceMappingURL=Calculator.js.map