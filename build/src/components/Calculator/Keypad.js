"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Keypad_module_scss_1 = __importDefault(require("./Keypad.module.scss"));
const Button_1 = __importDefault(require("./Keypad/Button"));
const BUTTON_NAMES = [
    ['7', '8', '9', '+'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '='],
    ['C', '0'],
];
function Keypad({ onClick }) {
    const handleKeypadClick = (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            onClick(target.textContent);
        }
    };
    return (react_1.default.createElement("div", { className: Keypad_module_scss_1.default.keypad, onClick: handleKeypadClick }, BUTTON_NAMES.map((buttonRow, index) => (react_1.default.createElement("div", { key: index }, buttonRow.map(name => react_1.default.createElement(Button_1.default, { key: name, name: name })))))));
}
exports.default = Keypad;
//# sourceMappingURL=Keypad.js.map