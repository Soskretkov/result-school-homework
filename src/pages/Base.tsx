// Этот модуль имеет экспериментальный код - не использует хуки, роль useState пересмотрена.
// цель - определить тип и методы в одном объекте и передавать его как пропс, например:
// function Form({ formData }: { formData: FormData }) {}
// класс хранит данные, useState освобождается от этой миссии и нужен только для рендеринга

// eslint-disable-next-line
import React, { useState, useRef } from 'react';
import styles from './Base.module.scss';


export default function CreateForm() {
  const formData = new FormData();
  return (
    <Form formData={formData} />
  );
}


function Form({ formData }: { formData: FormData }) {
  const formDataRef = React.useRef(formData).current;

  // определение ref для кнопки отправки
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // useState интересен только как способ рендерить
  const [, forceRender] = React.useState({});


  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    formDataRef
      .setField(name, value)
      .validate();

    if (formDataRef.isValid()) {
      // перемещение фокуса на кнопку
      submitButtonRef.current && submitButtonRef.current.focus();
    }

    // перерендерит компонент
    forceRender({});
  }


  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formDataRef.isValid()) {
      return; // прервать отправку формы, если она невалидна
    }
    formDataRef.sendFormData();
  }

  // стиль для "неактивной" кнопки (disabled прямо в теге не рабочая идея - из-за него слетит фокус)
  const buttonStyle = formDataRef.isValid() ? styles['button--activeButton'] : styles['button--inactiveButton'];

  return (
    <form className={styles.base} onSubmit={onSubmit}>
      <input name="email"
        type="email"
        placeholder="Почта"
        // валидация поля email намеренно происходит только при потере фокуса
        onBlur={onChange}
      />
      <div className={styles.error}>{formDataRef.errors.email}</div>
      <input name="password"
        type="password"
        placeholder="Пароль"
        onChange={onChange}
      />
      <div className={styles.error}>{formDataRef.errors.password}</div>
      <input name="confirmPassword"
        type="password"
        placeholder="Повторите пароль"
        onChange={onChange}
      />
      <div className={styles.error}>{formDataRef.errors.confirmPassword}</div>
      <button ref={submitButtonRef} className={buttonStyle} type="submit">Зарегистрироваться</button>

    </form>
  )
}


class FormData {
  values: { [key: string]: string } = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  errors: typeof FormData.prototype.values;

  constructor(prop: Partial<typeof FormData.prototype.values> = {}) {
    // спредоператор мог бы притащить email:undefined, TS это не нравится, потому .assign
    this.values = Object.assign(this.values, prop);
    this.errors = this.#createInitialErrors(Object.keys(this.values));
  }

  // метод гибкого создания начальной структуры ошибок, который следует за initialValues
  #createInitialErrors(keys: string[]): typeof FormData.prototype.values {
    const errors: { [key: string]: string } = {};
    keys.forEach(key => {
      errors[key] = '';
    });
    return errors as typeof FormData.prototype.values;
  }

  setField = (fieldName: keyof typeof FormData.prototype.values, newValue: string): this => {
    this.values[fieldName] = newValue;
    return this;  // возвращаем this для возможности создания цепочек вызовов
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

    if (this.values.password.length <= 4) {
      strNewPasswordErr = 'Пароль должен содержать более 4 символов';
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

    return this;  // возвращаем this для возможности создания цепочек вызовов
  }


  sendFormData = () => {
    console.log(this.values);
  };
}