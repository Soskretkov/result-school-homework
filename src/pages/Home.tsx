// eslint-disable-next-line
import React, { useState } from 'react';
import BaseFormPage from './Form/BaseForm';
import YupFormPage from './Form/YupForm';
import styles from './Home.module.scss';


export default function HomePage() {
  // доступные вебстраницы
  enum WebPagesEnum {
    HOME,
    BASE_FORM,
    YUP_FORM,
  }

  const [activePage, setActivePage] = React.useState(WebPagesEnum.HOME);

  switch (activePage) {
    case WebPagesEnum.BASE_FORM:
      return (
        <BaseFormPage />
      );
    case WebPagesEnum.YUP_FORM:
      return (
        <YupFormPage />
      );
    case WebPagesEnum.HOME:
    default:
      return (
        <div className={styles.home}>
          < h1 > Выберите: </h1 >
          <button onClick={(_) => setActivePage(WebPagesEnum.BASE_FORM)}>Первая часть задания на голом React</button>
          <button onClick={(_) => setActivePage(WebPagesEnum.YUP_FORM)}>Вторая часть задания на React Hook Form и Yup</button>
        </div>
      );
  }
}