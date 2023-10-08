import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SubmitButton from '../../components/Form/SubmitButton';
import { UINT_MIN_PASSWORD_LEN, EMAIL_REG_EXP } from '../../shared/constants';
import { FormFields } from '../../shared/types';
import { formErrMsg, sendFormData } from '../../shared/form-utils';
import styles from '../../components/Form.module.scss';


//схему валидации yup делаю похожей на ту что в файле BaseForm.tsx
const fieldsSchema: yup.ObjectSchema<FormFields> = yup.object()
  .shape({
    email: yup.string()
      .matches(EMAIL_REG_EXP, formErrMsg.EmailFormat())
      .email(formErrMsg.EmailFormat())
      .required(''),
    password: yup.string()
      .min(UINT_MIN_PASSWORD_LEN, formErrMsg.PasswordMinLength(UINT_MIN_PASSWORD_LEN))
      .required(''),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], formErrMsg.PasswordMismatch())
      .required(''),
  });

export default function HookForm() {
  const { register, handleSubmit, formState: { errors, isValid: isValidForm } } = useForm({
    resolver: yupResolver(fieldsSchema),
    mode: 'all', // этот параметр нужен для того, чтобы formState.isValid обновлялся
  });

  return (
    <form onSubmit={handleSubmit(sendFormData)} className={styles.form}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <div className={styles.error}>{errors.email.message}</div>}
      <input
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <div className={styles.error}>{errors.password.message}</div>}
      <input
        {...register('confirmPassword')}
        type="password"
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword.message}</div>}
      <SubmitButton isValidForm={isValidForm} />
    </form>
  );
}