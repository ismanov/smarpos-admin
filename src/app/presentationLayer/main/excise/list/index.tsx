// @ts-ignore
import React from "react";
// @ts-ignore
import styles from "./excise.module.css";
import { bindPresenter } from "app/hocs/bindPresenter";
import { ExcisePresenter } from "app/businessLogicLayer/presenters/ExcisePresenter";
// @ts-ignore
import Card from "app/presentationLayer/components/card";
import Pagination, { PageSizeType } from "app/presentationLayer/components/pagination";
import Search from "app/presentationLayer/components/search";
import Table from "app/presentationLayer/components/table";
import { Excise } from "app/businessLogicLayer/models/Excise";
import moment from "moment";
// @ts-ignore
import Edit from "app/assets/img/excise_edit.svg";
import {
  MAN_EXCISE_ADD, MAN_EXCISE_EDIT, MAN_EXCISE_LIST_FILT_SEARCH,
  STATIC_TYPE
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

export type ExciseState = {
  page?: number;
  list?: Array<Excise>;
  totalPages?: number;
  isLoading?: boolean;
  search?: string;
  size?: number;
};

export default bindPresenter<ExciseState, ExcisePresenter>(
  ExcisePresenter,
  ({ presenter, model }) => {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>Акциз</div>
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.filter_row}>
              <div className={styles.filter}>
                <WithPermission annotation={MAN_EXCISE_LIST_FILT_SEARCH} placement={{ right: -5, top: 0, bottom: 0 }}>
                  <Search
                    placeholder="Поиск..."
                    style={{
                      width: 300
                    }}
                    value={model.search}
                    onSearch={(searchKey) => {
                      let filter = {
                        page: model.page,
                        size: model.size,
                        search: searchKey
                      };
                      presenter.fetchExcises(filter);
                    }}
                  />
                </WithPermission>
              </div>
              <div>
                <WithPermission
                  annotation={MAN_EXCISE_ADD}
                  placement="left"
                  render={(permissionProps) => (
                    <div
                      className={styles.add_button}
                      onClick={() => {
                        presenter.openAddEditPage();
                      }}
                      {...permissionProps}
                    >
                      +
                    </div>
                  )} />
              </div>
            </div>
            <div className={styles.table}>
              <Table
                showOrderNo={true}
                selectable={false}
                header={[
                  "Наименование товара",
                  "Дата",
                  "Ставка",
                  "Ед. изм.",
                  "Оператор",
                  "Действия"
                ]}
                isLoading={model.isLoading}
                data={
                  model.list &&
                  model.list.map(excise => ({
                    id: excise.id,
                    name: excise.name || "",
                    date: moment(excise.lastModifiedDate).format("DD-MM-YYYY"),
                    exciseAmount: String(excise.newPrice || 0),
                    unit: excise.unitName || "",
                    operator: excise.lastModifiedBy,
                    menu: (<div className="table__action-menu">
                      <WithPermission
                        annotation={MAN_EXCISE_EDIT}
                        type={STATIC_TYPE}
                        placement="space-between"
                        render={(permissionProps) => (
                          <span
                            className="table__action-menu__item"
                            onClick={() => {
                              presenter && presenter.openAddEditPage(excise.id);
                            }}
                            {...permissionProps}
                          >
                            <img src={Edit} alt="edit" />
                          </span>
                        )} />
                    </div>),
                  }))
                }
              />
            </div>
          </Card>
        </div>
        <div className={styles.pagination}>
          <Pagination
            page={model.page}
            total={model.totalPages || 0}
            onPageSelected={page => {
              presenter.fetchExcises({
                page,
                search: model.search
              });
            }}
            sizeType={PageSizeType.normal}
            size={model.size}
            onSizeChange={async size => {
              presenter.fetchExcises({ size });
            }}
          />
        </div>
      </div>
    );
  }
);
