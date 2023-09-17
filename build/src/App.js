"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
function App() {
    const [count, setCount] = (0, react_1.useState)(0);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h1", null, "Vite + React + TS"),
        react_1.default.createElement("div", { className: "card" },
            react_1.default.createElement("button", { onClick: () => setCount((count) => count + 1) },
                "count is ",
                count),
            react_1.default.createElement("p", null,
                "Edit ",
                react_1.default.createElement("code", null, "src/App.tsx"),
                " and save to test HMR")),
        react_1.default.createElement("p", { className: "read-the-docs" }, "Click on the Vite and React logos to learn more")));
}
exports.default = App;
//# sourceMappingURL=App.js.map