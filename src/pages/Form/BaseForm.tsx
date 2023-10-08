// в этом модуле экспериментальный код, чтобы посмотреть как через класс + useRef
// можно создать альтернативу множеству useState.
// Мотивация: обходиться одним useState и испопробовать альтернативный кодинг,
// без характерных для React замыканий.
import React, { useState, useRef } from 'react';
import Form from '../../components/Form';
import { UINT_MIN_PASSWORD_LEN, EMAIL_REG_EXP } from '../../shared/constants';
import { FormFields } from '../../shared/types';
import { formErrMsg, sendFormData } from '../../shared/form-utils';


export default function BaseForm() {
  // создание экземпляра класса и ref чтобы сохранялся между рендерингами
  const formDataRef = React.useRef(new FormData()).current;

  // один на весь код useState, который интересен только как способ рендерить
  const [, forceRender] = React.useState({});

  const fieldHandler = CreateFieldHandler(formDataRef, forceRender);

  return (
    <Form
      errors={formDataRef.errors}
      fieldHandler={fieldHandler}
      onSubmit={onSubmit(formDataRef)}
      isValidForm={formDataRef.isValid()}
    />
  );
}


function CreateFieldHandler(formDataInstance: FormData, render: (_: object) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    // ввод пользователя передается в экземпляр класса FormData
    const { name: strName, value: strValue } = event.target;
    formDataInstance.setField(strName, strValue);

    // рендерить компонент, аргумент значения не имеет
    render({});
  }
}


function onSubmit(formDataInstance: FormData) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendFormData(formDataInstance.values);
  };
}


class FormData {
  values: FormFields = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  errors: typeof FormData.prototype.values;

  constructor(prop: Partial<typeof FormData.prototype.values> = {}) {
    // спред-оператор мог бы притащить email:undefined, TS это не нравится, поэтому Object.assign
    this.values = Object.assign(this.values, prop);
    this.errors = this.#createInitialErrors(Object.keys(this.values));
  }

  // автоматическая генерация создает объект хранения ошибок, идентичный по ключам с this.values,
  // это удобно, когда в код вносятся именение и пересматриваются поля this.values
  #createInitialErrors(keys: string[]): typeof FormData.prototype.values {
    const errors: { [key: string]: string } = {};
    keys.forEach(key => {
      errors[key] = '';
    });
    return errors as typeof FormData.prototype.values;
  }

  setField = (fieldName: keyof typeof FormData.prototype.values, newValue: string): void => {
    this.values[fieldName] = newValue;
    this.validate();
  };

  isValid = (): boolean => {
    for (const key in this.values) {
      if (!this.values[key]) {
        return false;  // допущено пустое поле, возвращаем false
      }
    }

    for (const key in this.errors) {
      if (this.errors[key]) {
        return false;  // не пустое сообщение об ошибке, возвращаем false
      }
    }
    return true;  // ошибок не найдено, возвращаем true
  };

  validate = (): void => {
    const values = this.values;
    const errors = this.errors;

    // проверка email. Минимальные требования: @ и один символ слева и справа
    errors.email = EMAIL_REG_EXP.test(values.email) ? '' : formErrMsg.EmailFormat();

    // проверка первого пароля
    const uintPasswordLen = values.password.length;
    const isValidPassword = (uintPasswordLen == 0) || (uintPasswordLen >= UINT_MIN_PASSWORD_LEN);
    errors.password = isValidPassword ? '' : formErrMsg.PasswordMinLength(UINT_MIN_PASSWORD_LEN);

    // проверка совпадения паролей
    const isСonfirmed = (!values.confirmPassword) || (values.password === values.confirmPassword);
    errors.confirmPassword = isСonfirmed ? '' : formErrMsg.PasswordMismatch();
  }
}