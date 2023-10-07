// в этом модуле экспериментальный код, чтобы посмотреть идею ниже
// идея#: через класс + useRef можно создать альтернативу множеству useState
// Мотивация#1 хотелось вундервафлю
// Мотивация#2: если идея выше, можно обходиться одним useState и
// испопробовать альтернативный кодинг, без характерных для React замыканий
// Мотивация#3 - сделать из класса структуру языка rust, которая содержит в себе и тип и
// методы в одном объекте и попробовать нотировать этим типом напрямую, типо как тут:
// function onSubmit(formDataInstance: FormData) {

// eslint-disable-next-line
import React, { useState, useRef } from 'react';
import Form from '../../components/Form';
import { UINT_MIN_PASSWORD_LEN, EMAIL_REG_EXP } from '../../shared/constants';
import { FormFields } from '../../shared/types';
import FormErrMsg from '../../shared/form-err-msg';

export default function BaseForm() {
  // создание экземпляра класса и ref для него, чтобы он сохранялся между рендерингами
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


function CreateFieldHandler(
  formDataInstance: FormData,
  render: (_: object) => void) {

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: strName, value: strValue } = event.target;

    formDataInstance
      .setField(strName, strValue)
      .validate();

    // рендерить компонент, не имеет значения что передать в качестве аргумента
    render({});
  }
}


function onSubmit(formDataInstance: FormData) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formDataInstance.isValid()) {
      return; // прервать отправку формы, если она невалидна
    }

    console.log(formDataInstance.values);
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

  // автоматическая генерация создает объект хранения ошибок, идентичный по ключам с this.values,  это удобно, когда в код вносятся именение и пересматриваются поля this.values
  #createInitialErrors(keys: string[]): typeof FormData.prototype.values {
    const errors: { [key: string]: string } = {};
    keys.forEach(key => {
      errors[key] = '';
    });
    return errors as typeof FormData.prototype.values;
  }

  setField = (fieldName: keyof typeof FormData.prototype.values, newValue: string): this => {
    this.values[fieldName] = newValue;
    return this;  // возвращает this для возможности чейнинга
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

  // касательно валидации отдельно от класса - тогда пропадет чейнинг, как выход можно разместить тут компактную обертку над внешним валидатором (не реализовано)
  validate = (): this => {
    const uintPasswordLen = this.values.password.length;

    // проверка email. Минимальные требования: @ и один символ слева и справа
    this.errors.email = EMAIL_REG_EXP.test(this.values.email) ? '' : FormErrMsg.EmailFormat();

    // проверка первого пароля
    const isValidPassword = uintPasswordLen > 0 && uintPasswordLen <= UINT_MIN_PASSWORD_LEN;
    this.errors.password = isValidPassword ? '' : FormErrMsg.PasswordMinLength(UINT_MIN_PASSWORD_LEN);

    // проверка совпадения паролей
    this.errors.password = (this.values.password === this.values.confirmPassword) ? '' : FormErrMsg.PasswordMismatch();

    return this;  // возвращает this для возможности чейнинга
  }
}