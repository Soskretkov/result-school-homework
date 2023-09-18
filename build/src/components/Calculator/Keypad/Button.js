"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_module_scss_1 = __importDefault(require("./Button.module.scss"));
function Button({ name }) {
    return (react_1.default.createElement("button", { className: Button_module_scss_1.default.button }, name));
}
exports.default = Button;
//# sourceMappingURL=Button.js.map