import React, { useState, useRef } from 'react';
import styles from './Form.module.scss';

// в порядке эксперимента класс FormData предполагается одновременно использоваться и как "тип" и как "хук"
// мотивация: хук не может разместить в себе type, а хук + внешний type !== консистентноcть
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
    let strNewConfirmPasswordErr = '';

    if (!/^[\w_@]*$/.test(emailText)) {
      strNewEmailErr = 'Неверный логин. Допустимые символы: буквы, цифры, нижнее подчёркивание и @';
    } else if (emailText.length > 20) {
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

    return this;  // возвращаем this для возможности создания цепочек вызовов
  }

  sendFormData = () => {
    console.log(this.values);
  };
}


export default function Form() {
  // создаем экземпляр класса
  const formData = new FormData();
  const formDataRef = useRef(formData).current;

  // Определение ref для кнопки отправки
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // кажется, мой код является уникальным подходом к управлению данными формы 
  // useState интересен только как способ рендерить, но хранит все екземпляр класса
  const [, forceRender] = useState(null);
  // const [loginError, setLoginError] = useState(null);


  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    formDataRef
      .setField(name, value)
      .validate();
      console.log(formDataRef.errors);  // добавлено для отладки
      // console.log(formDataRef.values);  // добавлено для отладки

    forceRender(null);
  }


  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formDataRef.isValid()) {
      formDataRef.sendFormData();
      // Перемещение фокуса на кнопку
      submitButtonRef.current && submitButtonRef.current.focus();
    } else {
      forceRender(null);  // Заставить компонент перерендериться, чтобы отобразить ошибки
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input name="email"
        type="email"
        placeholder="Почта"
        onChange={onChange}
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
      <button ref={submitButtonRef} disabled={!formDataRef.isValid()} type="submit">Зарегистрироваться</button>
    </form>
  )
}