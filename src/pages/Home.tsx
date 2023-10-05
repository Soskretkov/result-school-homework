// eslint-disable-next-line
import React, { useState } from 'react';
import BasePage from './Base';
import HookFormPage from './HookForm';
import styles from './Home.module.scss';


export default function HomePage() {
  // доступные вебстраницы
  enum WebPagesEnum {
    HOME,
    BASE,
    HOOK_FORM,
  }

  const [activePage, setActivePage] = React.useState(WebPagesEnum.HOME);

  switch (activePage) {
    case WebPagesEnum.BASE:
      return (
        <BasePage />
      );
    case WebPagesEnum.HOOK_FORM:
      return (
        <HookFormPage />
      );
    case WebPagesEnum.HOME:
    default:
      return (
        <div className={styles.home}>
          < h1 > Выберите: </h1 >
          <button onClick={(_) => setActivePage(WebPagesEnum.BASE)}>Первая часть задания на голом React</button>
          <button onClick={(_) => setActivePage(WebPagesEnum.HOOK_FORM)}>Вторая часть задания на React Hook Form и Yup</button>
        </div>
      );
  }
}