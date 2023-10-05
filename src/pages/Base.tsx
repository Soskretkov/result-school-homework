// в этом модуле экспериментальный код - использую класс вместо можества useState
// в прод я бы так не писал)
// в этом коде useState вообще создается только один раз для возможности рендеринга
// возможность useState хранить состояние намеренно не используется.
// Цель1 - посмотреть улучшит ли это код, в частности React-код злоупотребляет замыканиями
// Цель2 - сделать из класса структуру из rust, которая содержит в себе и тип и его методы
// в одном объекте и попробовать нотировать этим типом напрямую, как я это сделал тут:
// function Form({ formData }: { formData: FormData }) {}


// eslint-disable-next-line
import React, { useState, useRef, useEffect } from 'react';
import styles from './Base.module.scss';


export default function CreateForm() {
  const formData = new FormData();
  return (
    <Form formData={formData} />
  );
}


function Form({ formData }: { formData: FormData }) {
  // определение ref для переданного экземпляра класса
  const formDataRef = React.useRef(formData).current;

  // определение ref для кнопки отправки
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // класс имеет метод, который подскажет валиден ли ввод
  const isValidFormData = formDataRef.isValid();

  // фокус на кнопке с disabled=true не закрепляется, важно ставить
  // его после построения DOM, когда у disabled уже имеется false
  React.useEffect(() => {
    if (isValidFormData) {
      submitButtonRef.current && submitButtonRef.current.focus();
    }
  }, [isValidFormData]);

  // стиль кнопки 
  const strButtonStyle = isValidFormData ? styles['button--active'] : styles['button--inactive'];

  // один на весь код useState, который интересен только как способ рендерить
  const [, forceRender] = React.useState({});

  const onChange = CreateOnChangeHandler(formDataRef, forceRender);

  return (
    <form className={styles.base} onSubmit={onSubmit(formDataRef)}>
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
      <button ref={submitButtonRef} disabled={!isValidFormData} className={strButtonStyle} type="submit">Зарегистрироваться</button>

    </form>
  )
}


function CreateOnChangeHandler(
  formDataInstance: FormData,
  render: (_: object) => void) {

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: strName, value: strValue } = event.target;

    formDataInstance
      .setField(strName, strValue)
      .validate();

    // перерендерит компонент
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
  values: { [key: string]: string } = {
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