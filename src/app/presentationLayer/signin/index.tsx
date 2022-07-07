import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./signin.module.css";
import Input from "app/presentationLayer/components/input";
import Button from "app/presentationLayer/components/button";
// @ts-ignore
import Logo from "app/assets/img/logo.svg";
import { bindPresenter } from "app/hocs/bindPresenter";
import {
  AuthPresenter,
  AuthStates
} from "app/businessLogicLayer/presenters/AuthPresenter";

export default bindPresenter<AuthStates, AuthPresenter>(
  AuthPresenter,
  (props: { presenter: AuthPresenter; model: AuthStates }) => {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
      props.presenter.checkForm(login, password);
    }, [login, password]);

    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.content}>
            <img src={Logo} alt="logo" />
            <div className={styles.input}>
              <Input
                title="Логин"
                placeholder="Введите логин"
                value={login}
                style={{ height: 50 }}
                onChange={event => {
                  setLogin(event.target.value);
                }}
              />
            </div>
            <div className={styles.mt_15}>
              <Input
                type="password"
                title="Пароль"
                placeholder="Введите пароль"
                value={password}
                style={{ height: 50 }}
                onChange={event => {
                  setPassword(event.target.value);
                }}
              />
            </div>
            <div className={styles.button}>
              <Button
                title="Авторизация"
                disabled={props.model.validForm}
                onClick={() => {
                  props.presenter.signIn(login, password);
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.right_bg} />
      </div>
    );
  }
);
