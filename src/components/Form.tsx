import React, { useEffect } from 'react';
import { FormFields } from '../shared/types';
import styles from './Form.module.scss';

export type FormProps = {
  errors: FormFields,
  fieldHandler: (_: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: () => void,
  isValidForm: boolean,
}

export default function Form(props: FormProps) {
  const isValid = props.isValidForm;

  // стиль кнопки 
  const strButtonStyle = isValid ? styles['button--active'] : styles['button--inactive'];

  // вернет useRef который используется как ссылка на кнопку отправки
  const submitButtonRef = useButtonFocus(isValid);

  return (
    <form className={styles.form} onSubmit={props.onSubmit}>
      <input name="email"
        type="email"
        placeholder="Почта"
        // валидация поля email намеренно происходит только при потере фокуса
        onBlur={props.fieldHandler}
      />
      <div className={styles.error}>{props.errors.email}</div>
      <input name="password"
        type="password"
        placeholder="Пароль"
        onChange={props.fieldHandler}
      />
      <div className={styles.error}>{props.errors.password}</div>
      <input name="confirmPassword"
        type="password"
        placeholder="Повторите пароль"
        onChange={props.fieldHandler}
      />
      <div className={styles.error}>{props.errors.confirmPassword}</div>
      <button
        ref={submitButtonRef}
        disabled={!isValid}
        className={strButtonStyle}
        type="submit">
        Зарегистрироваться
      </button>
    </form>
  )
}


function useButtonFocus(isActive: boolean) {
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // фокус на кнопке с disabled=true не закрепляется, важно ставить
  // его после построения DOM, когда у disabled уже имеется false
  useEffect(() => {
    if (isActive) {
      submitButtonRef.current && submitButtonRef.current.focus();
    }
  }, [isActive]);

  return submitButtonRef;
}