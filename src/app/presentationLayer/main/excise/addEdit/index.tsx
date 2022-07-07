import React from "react";
//@ts-ignore
import styles from "./exciseaddedit.module.css";
//@ts-ignore
import BackButtonIcon from "app/assets/img/left.svg";
import Card from "app/presentationLayer/components/card";
import Search from "app/presentationLayer/components/search";
import Input from "app/presentationLayer/components/input";
import DropDown from "app/presentationLayer/components/dropdown";
import Button from "app/presentationLayer/components/button";
import { bindPresenter } from "app/hocs/bindPresenter";
import { ExciseAddEditPresenter } from "app/businessLogicLayer/presenters/ExciseAddEditPresenter";
import {Product} from "app/businessLogicLayer/models/Product";

export type ExciseAddEditViewState = {
  productName?: string;
  productList?: Array<Product>;
  rateTypeList?: Array<{ title: string; value: number }>;
  isValid?: boolean;
  amount?: number;
  isEdit?: boolean;
};

export default bindPresenter<ExciseAddEditViewState, ExciseAddEditPresenter>(
  ExciseAddEditPresenter,
  ({ presenter, model }) => {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <img
            src={BackButtonIcon}
            alt="back"
            style={{ width: 20, height: 20, cursor: "pointer" }}
            onClick={() => {
              presenter.backButtonClicked();
            }}
          />
          <div style={{ marginLeft: 10 }}>Добавить/Редактировать Акциз</div>
        </div>
        <div className={styles.content}>
          <Card className={styles.card}>
            <div>
              <div className={styles.title}>Товар</div>
              <Search
                style={{ height: 50, marginTop: 6 }}
                placeholder="Поиск продука"
                onSearch={searchKey => {
                  presenter.searchProduct(searchKey);
                }}
                items={
                  model.productList
                    ? model.productList.map(item => ({
                        label: item.name || "",
                        value: item.id
                      }))
                    : undefined
                }
                onItemClicked={id => {
                  presenter.selectProduct(id);
                }}
                value={model.productName}
              />
            </div>
            <div className={styles.options}>
              <div style={{ flexGrow: 1, paddingRight: 10 }}>
                <Input
                  placeholder="Введите ставку для товара"
                  onChange={event => {
                    let amount = event.target.value;
                    presenter.setAmount(
                      isNaN(Number(amount)) ? 0 : Number(amount)
                    );
                  }}
                  value={model.amount}
                  style={{ height: 48 }}
                />
              </div>
              <div style={{ flexGrow: 2, paddingTop: 4 }}>
                <DropDown
                  className={styles.test}
                  onSelect={v => {
                    presenter.setRateType(v);
                  }}
                  data={
                    model.rateTypeList
                      ? model.rateTypeList.map(item => ({
                          title: item.title,
                          value: item.value
                        }))
                      : []
                  }
                  style={{
                    height: 48
                  }}
                  noDataTitle="Не выбрано - Ставка"
                />
              </div>
            </div>
            <div style={{ flexGrow: 1 }} />
            <div className={styles.bottom}>
              <Button
                title="Отмена"
                className={styles.cancel}
                onClick={() => {
                  presenter.backButtonClicked();
                }}
              />
              <div style={{ width: 12 }} />
              <Button
                title={model.isEdit ? "Обновить" : "Сохранить"}
                disabled={!model.isValid}
                onClick={() => {
                  presenter.createExcise();
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }
);
