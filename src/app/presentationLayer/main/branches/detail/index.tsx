import React from "react";
// @ts-ignore
import styles from "./detail.module.css";
// @ts-ignore
import BackButton from "app/assets/img/left.svg";
// @ts-ignore
import Card from "app/presentationLayer/components/card";
import Filter from "./filter";
import InfoTable from "./table";
import About from "./about";
import { Branch } from "app/businessLogicLayer/models/Branch";
import { bindPresenter } from "app/hocs/bindPresenter";
import BranchDetailPresenter from "app/businessLogicLayer/presenters/BranchDetailPresenter";

export type BranchDetailState = {
  branch: Branch;
};

export default bindPresenter<BranchDetailState, BranchDetailPresenter>(
  BranchDetailPresenter,
  ({ model, presenter }) => {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <img
            className={styles.back}
            src={BackButton}
            alt="back"
            onClick={() => {
              presenter.backButtonClicked();
            }}
          />
          <div className={styles.title}>Торговая точка</div>
        </div>
        <Filter onSelectBranch={branchType => {}} />
        <div className={styles.info_content}>
          <div className={styles.table}>
            <InfoTable />
          </div>
          <div className={styles.info}>
            <About branch={model.branch} />
          </div>
        </div>
      </div>
    );
  }
);
