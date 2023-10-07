import React, { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from '../../components/Form';
import { UINT_MIN_PASSWORD_LEN, EMAIL_REG_EXP } from '../../shared/constants';
import { FormFields } from '../../shared/types';
import FormErrMsg from '../../shared/form-err-msg';


//схему валидации yup делаю похожей на ту что в файле BaseForm.tsx
const fieldsSchema: yup.ObjectSchema<FormFields> = yup.object()
  .shape({
    email: yup.string()
      .matches(EMAIL_REG_EXP, FormErrMsg.EmailFormat())
      .email(FormErrMsg.EmailFormat())
      .required(''),
    password: yup.string()
      .min(UINT_MIN_PASSWORD_LEN, FormErrMsg.PasswordMinLength(UINT_MIN_PASSWORD_LEN))
      .required(''),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], FormErrMsg.PasswordMismatch())
      .required(''),
  });

export default function HookForm() {
  return (
    <></>
  );
}