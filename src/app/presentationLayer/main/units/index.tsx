import React from "react";
// @ts-ignore
import styles from "./units.module.css";
import Card from "app/presentationLayer/components/card";
import { Unit } from "app/businessLogicLayer/models/Unit";
import { bindPresenter } from "app/hocs/bindPresenter";
import UnitPresenter from "app/businessLogicLayer/presenters/UnitsPresenter";

export type UnitsState = {
  list?: Array<Unit>;
  totalItems?: number;
  isLoading?: boolean;
};

export default bindPresenter<UnitsState, UnitPresenter>(
  UnitPresenter,
  ({ model, presenter }) => {
    return (
      <div className={styles.wrapper}>
        <p className={styles.title}> Единицы измерения </p>
        <Card className={styles.content}>
          {model.list ? (
            <table className={styles.table}>
              <thead className={styles.header}>
                <th> # </th>
                <th> Счетное </th>
                <th> Название </th>
                <th> Описание </th>
              </thead>
              <tbody>
                {model.list.map((unit, index) => (
                  <tr className={styles.row}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="checkbox"
                        // disabled={model.isLoading}
                        onChange={checked => {
                          unit.countable = !unit.countable;
                          presenter.updateUnit(unit);
                        }}
                        checked={unit.countable || false}
                      />
                    </td>
                    <td>{unit.nameRu || unit.nameUz}</td>
                    <td>{unit.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <table className={styles.table}>
                <thead className={styles.header}>
                  <th> # </th>
                  <th> Счетное </th>
                  <th> Название </th>
                  <th> Описание </th>
                </thead>
              </table>
              <div className={styles.empty_container}>Список пуст!</div>
            </div>
          )}
        </Card>
      </div>
    );
  }
);
