// в этом модуле экспериментальный код, чтобы подтвердить некоторые гипотезы
// гипотеза#: класс + useRef создает альтернативу множеству useState
// Мотивация#1 хотелось вундервафлю
// Мотивация#2: если гипотеза верна, можно обходиться одним useState и
// нужно изыскать альтернативный кодинг, без характерных для React замыканий 
// Мотивация#3 - сделать из класса структуру языка rust, которая содержит в себе и тип и
// методы в одном объекте и попробовать нотировать этим типом напрямую, типо как тут:
// function onSubmit(formDataInstance: FormData) {

import React, { useState, useRef } from 'react';
import Form from '../../components/Form';
import { FormFields } from '../../shared/types';

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
      onSubmit={()=>onSubmit(formDataRef)}
      isValidForm ={formDataRef.isValid()}
    />
  )
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

  // метод создает объект хранения ошибок, идентичный по ключам с this.values,
  // автоматическая генерация объекта удобна тем, что позволяет не думать о хранении
  // ошибок, когда в код вносятся именение и пересматриваются поля у this.values
  #createInitialErrors(keys: string[]): typeof FormData.prototype.values {
    const errors: { [key: string]: string } = {};
    keys.forEach(key => {
      errors[key] = '';
    });
    return errors as typeof FormData.prototype.values;
  }

  setField = (fieldName: keyof typeof FormData.prototype.values, newValue: string): this => {
    this.values[fieldName] = newValue;
    return this;  // возвращает this для возможности создания цепочек вызовов
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

  // валидацию надо вынести отдельно, но пока класс не переиспользуется это допустимо
  validate = (): this => {
    const emailText = this.values.email;
    let strNewEmailErr = '';
    let strNewPasswordErr = '';
    let strNewConfirmPasswordErr = '';

    // требования минимальны: @ и один символ слева и справа
    const emailRegex = /^.+@.+$/;
    if (!emailRegex.test(emailText)) {
      strNewEmailErr = 'Неверный формат email';
    }

    if (this.values.password.length <= 1) {
      strNewPasswordErr = 'Пароль должен содержать более 2 символов';
    }

    if (this.values.confirmPassword) {
      if (this.values.password !== this.values.confirmPassword) {
        strNewConfirmPasswordErr = 'Пароли не совпадают';
      }
    }

    Object.assign(this.errors, {
      email: strNewEmailErr,
      password: strNewPasswordErr,
      confirmPassword: strNewConfirmPasswordErr,
    });

    return this;  // возвращает this для возможности создания цепочек вызовов
  }
}