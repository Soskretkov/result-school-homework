// eslint-disable-next-line
import React, { useState } from 'react';
import BasePage from './Base';
import HookFormPage from './Base';
import styles from './Home.module.scss';


export default function HomePage() {
  // варианты перехода на другие страницы
  enum SubPageEnum {
    BASE,
    HOOK_FORM,
  }

  const [activePage, setActivePage] = React.useState<SubPageEnum | null>(null);

  switch (activePage) {
    case SubPageEnum.BASE:
      return (
        <BasePage />
      );
    case SubPageEnum.HOOK_FORM:
      return (
        <HookFormPage />
      );
    default:
      return (
        <div className={styles.home}>
          < h1 > Выберите: </h1 >
          <button onClick={(_) => setActivePage(SubPageEnum.BASE)}>Первая часть задания на голом React</button>
          <button onClick={(_) => setActivePage(SubPageEnum.HOOK_FORM)}>Вторая часть задания на React Hook Form и Yup</button>
        </div>
      );
  }
}