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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FormData_instances, _a, _FormData_createInitialErrors;
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Form_module_scss_1 = __importDefault(require("./Form.module.scss"));
// в порядке эксперимента класс FormData предполагается одновременно использоваться и как "тип" и как "хук"
// мотивация: хук не может разместить в себе type, а хук + внешний type !== консистентноcть
class FormData {
    constructor(prop = {}) {
        _FormData_instances.add(this);
        this.values = {
            email: '',
            password: '',
            confirmPassword: '',
        };
        this.setField = (fieldName, newValue) => {
            this.values[fieldName] = newValue;
            return this; // возвращаем this для возможности создания цепочек вызовов
        };
        this.isValid = () => {
            for (const key in this.values) {
                if (!this.values[key]) {
                    return false; // допущено пустое поле, возвращаем false
                }
            }
            for (const key in this.errors) {
                if (this.errors[key]) {
                    return false; // не пустое сообщение об ошибке, возвращаем false
                }
            }
            return true; // ошибок не найдено, возвращаем true
        };
        this.validate = () => {
            const emailText = this.values.email;
            let strNewEmailErr = '';
            let strNewConfirmPasswordErr = '';
            if (!/^[\w_@]*$/.test(emailText)) {
                strNewEmailErr = 'Неверный логин. Допустимые символы: буквы, цифры, нижнее подчёркивание и @';
            }
            else if (emailText.length > 20) {
                strNewEmailErr = 'Неверный логин. Должно быть не больше 20 символов';
            }
            if (this.values.password) {
                if (this.values.password !== this.values.confirmPassword) {
                    strNewConfirmPasswordErr = 'Пароли не совпадают';
                }
            }
            Object.assign(this.errors, {
                email: strNewEmailErr,
                confirmPassword: strNewConfirmPasswordErr,
            });
            return this; // возвращаем this для возможности создания цепочек вызовов
        };
        this.sendFormData = () => {
            console.log(this.values);
        };
        // спредоператор мог бы притащить email:undefined, TS это не нравится, потому .assign
        this.values = Object.assign(this.values, prop);
        this.errors = __classPrivateFieldGet(this, _FormData_instances, "m", _FormData_createInitialErrors).call(this, Object.keys(this.values));
    }
}
_a = FormData, _FormData_instances = new WeakSet(), _FormData_createInitialErrors = function _FormData_createInitialErrors(keys) {
    const errors = {};
    keys.forEach(key => {
        errors[key] = '';
    });
    return errors;
};
function Form() {
    // создаем экземпляр класса
    const formData = new FormData();
    const formDataRef = (0, react_1.useRef)(formData).current;
    // Определение ref для кнопки отправки
    const submitButtonRef = (0, react_1.useRef)(null);
    // кажется, мой код является уникальным подходом к управлению данными формы 
    // useState интересен только как способ рендерить, но хранит все екземпляр класса
    const [, forceRender] = (0, react_1.useState)(null);
    // const [loginError, setLoginError] = useState(null);
    function onChange(event) {
        const { name, value } = event.target;
        formDataRef
            .setField(name, value)
            .validate();
        console.log(formDataRef.errors); // добавлено для отладки
        // console.log(formDataRef.values);  // добавлено для отладки
        forceRender(null);
    }
    function onSubmit(event) {
        event.preventDefault();
        if (formDataRef.isValid()) {
            formDataRef.sendFormData();
            // Перемещение фокуса на кнопку
            submitButtonRef.current && submitButtonRef.current.focus();
        }
        else {
            forceRender(null); // Заставить компонент перерендериться, чтобы отобразить ошибки
        }
    }
    return (react_1.default.createElement("form", { className: Form_module_scss_1.default.form, onSubmit: onSubmit },
        react_1.default.createElement("input", { name: "email", type: "email", placeholder: "\u041F\u043E\u0447\u0442\u0430", onChange: onChange }),
        react_1.default.createElement("div", { className: Form_module_scss_1.default.error }, formDataRef.errors.email),
        react_1.default.createElement("input", { name: "password", type: "password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", onChange: onChange }),
        react_1.default.createElement("div", { className: Form_module_scss_1.default.error }, formDataRef.errors.password),
        react_1.default.createElement("input", { name: "confirmPassword", type: "password", placeholder: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C", onChange: onChange }),
        react_1.default.createElement("div", { className: Form_module_scss_1.default.error }, formDataRef.errors.confirmPassword),
        react_1.default.createElement("button", { ref: submitButtonRef, disabled: !formDataRef.isValid(), type: "submit" }, "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F")));
}
exports.default = Form;
//# sourceMappingURL=Form.js.map