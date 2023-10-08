import React, { useRef, useEffect } from 'react';
import styles from './SubmitButton.module.scss';

type SubmitButtonProps = {
  isValidForm: boolean;
}

export default function SubmitButton({ isValidForm }: SubmitButtonProps) {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isValidForm) {
      submitButtonRef.current?.focus();
    }
  }, [isValidForm]);

  const strStyleModify = isValidForm ? styles['button--active'] : styles['button--inactive'];

  return (
    <button
      ref={submitButtonRef}
      disabled={!isValidForm}
      className={`${styles.button} ${strStyleModify}`}
      type="submit">
      Зарегистрироваться
    </button>
  );
}