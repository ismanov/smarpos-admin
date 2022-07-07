import React from "react";
//@ts-ignore
import styles from "./detail.module.css";
import Card from "app/presentationLayer/components/card";
import cn from "classnames";
import { Branch } from "app/businessLogicLayer/models/Branch";

type BranchDetailAboutState = {
  branch: Branch;
};

export default (props: BranchDetailAboutState) => {
  return (
    <div className={styles.about}>
      <Card className={styles.branch_info}>
        <div className={styles.header}>Информация о торговой точке</div>
        <div className={styles.content}>
          <div style={{ marginTop: 10 }}>
            <div className={cn(styles.title)}>Компания</div>
            <div className={cn(styles.value)}>
              {props.branch ? props.branch.companyName : "Неизвестно"}
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <div className={cn(styles.title)}>Адрес</div>
            <div className={cn(styles.value)}>
              {props.branch ? props.branch.address : "Неизвестно"}
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <div className={cn(styles.title)}>Номер телефона:</div>
            <div className={cn(styles.value)}>
              {props.branch ? props.branch.phone : "Неизвестно"}
            </div>
          </div>
        </div>
      </Card>
      <Card className={styles.logs}>
        <div className={styles.header}>История</div>
      </Card>
    </div>
  );
};
