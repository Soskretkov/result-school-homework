const formErrMsg = {
  EmailFormat: () => 'Неверный формат email',
  PasswordMismatch: () => 'Пароли не совпадают',
  PasswordMinLength: (uintLen: number) => `Пароль должен содержать более ${uintLen} символов`
};

export { formErrMsg };


export function sendFormData(formData: any) {
  console.log(formData);
}