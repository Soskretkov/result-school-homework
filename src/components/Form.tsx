import React, { useEffect } from 'react';
import { FormFields } from '../shared/types';
import styles from './Form.module.scss';

export type FormProps = {
  errors: FormFields,
  fieldHandler: (_: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (_: React.FormEvent<HTMLFormElement>) => void,
  isValidForm: boolean,
}

export default function Form({ errors, fieldHandler, onSubmit, isValidForm }: FormProps) {
  // useRef ссылается на кнопку отправки
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null);

  useButtonFocusWhenEnabled(submitButtonRef, isValidForm);

  const strButtonStyle = isValidForm ? styles['button--active'] : styles['button--inactive'];

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input name="email"
        type="email"
        placeholder="Почта"
        // валидация поля email намеренно происходит при потере фокуса
        onBlur={fieldHandler}
      />
      <div className={styles.error}>{errors.email}</div>
      <input name="password"
        type="password"
        placeholder="Пароль"
        onChange={fieldHandler}
      />
      <div className={styles.error}>{errors.password}</div>
      <input name="confirmPassword"
        type="password"
        placeholder="Повторите пароль"
        onChange={fieldHandler}
      />
      <div className={styles.error}>{errors.confirmPassword}</div>
      <button
        ref={submitButtonRef}
        disabled={!isValidForm}
        className={strButtonStyle}
        type="submit">
        Зарегистрироваться
      </button>
    </form>
  );
}


function useButtonFocusWhenEnabled(
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>,
  isActive: boolean) {
  // фокус на кнопке с disabled=true не закрепляется, важно ставить
  // его после построения DOM, когда у disabled уже имеется false
  useEffect(() => {
    if (isActive) {
      buttonRef.current?.focus();
    }
  }, [isActive]);
}