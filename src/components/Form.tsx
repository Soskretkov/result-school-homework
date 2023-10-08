import React from 'react';
import SubmitButton from './Form/SubmitButton';
import { FormFields } from '../shared/types';
import styles from './Form.module.scss';

export type FormProps = {
  errors: FormFields,
  fieldHandler: (_: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (_: React.FormEvent<HTMLFormElement>) => void,
  isValidForm: boolean,
}

export default function Form({ errors, fieldHandler, onSubmit, isValidForm }: FormProps) {
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
      <SubmitButton isValidForm={isValidForm} />
    </form>
  );
}