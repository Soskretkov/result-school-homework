export default {
  EmailFormat: () => 'Неверный формат email',
  PasswordMismatch: () => 'Пароли не совпадают',
  PasswordMinLength: (uintLen: number) => `Пароль должен содержать более ${uintLen} символов`
};