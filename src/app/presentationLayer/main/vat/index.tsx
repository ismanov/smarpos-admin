import React, { useState } from "react";
import { Vat } from "app/businessLogicLayer/models/Vat";
import { bindPresenter } from "app/hocs/bindPresenter";
import VatPresenter from "app/businessLogicLayer/presenters/VatPresenter";
// @ts-ignore
import styles from "./vat.module.css";
import Card from "app/presentationLayer/components/card";
import Input from "app/presentationLayer/components/input";
// @ts-ignore
import Edit from "app/assets/img/excise_edit.svg";
// @ts-ignore
import Delete from "app/assets/img/delete.svg";
import Dialog from "app/presentationLayer/components/dialog";
import {
  MAN_VAT_ADD,
  MAN_VAT_DELETE,
  MAN_VAT_EDIT
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

export type VatState = {
  list?: Array<Vat>;
  isLoading?: boolean;
};

export default bindPresenter<VatState, VatPresenter>(VatPresenter,
  ({ presenter, model }) => {
    
    const [name, setName] = useState<string | undefined>(undefined);
    const [percent, setPercent] = useState<number | undefined>(undefined);
    const [editingVat, setEditingVat] = useState<Vat | undefined>(undefined);
    const [deletingVat, setDeletingVat] = useState<Vat | undefined>(undefined);
    const [deletingDialog, setDeletingDialog] = useState<boolean>(false);

    return (
      <div className={styles.wrapper}>
        <Dialog
          title="Удалить"
          text="Вы действительно хотите удалить ставку?"
          isOpen={deletingDialog}
          onClose={() => {
            setDeletingDialog(false);
            setDeletingVat(undefined);
          }}
          onNegativeButtonClicked={() => {
            setDeletingDialog(false);
          }}
          onPositiveButtonClicked={() => {
            presenter.deleteVat(
              deletingVat && deletingVat.id !== undefined ? deletingVat.id : -1,
              () => {
                setDeletingDialog(false);
              }
            );
          }}
        />
        <div className={styles.header}>Ставки НДС</div>
        <Card className={styles.content}>
          <div className={styles.add_container}>
            <div className={styles.item}>
              <Input
                style={{ height: 30 }}
                placeholder="Название"
                value={name || ""}
                onChange={event => {
                  setName(event.target.value);
                }}
                onEnterKey={() => {
                  if (name && percent !== undefined) {
                    // @ts-ignore
                    presenter.createVat({ name, percent }, () => {
                      setName(undefined);
                      setPercent(undefined);
                    });
                  }
                }}
              />
            </div>
            <div className={styles.item}>
              <Input
                style={{ height: 30 }}
                placeholder="Процент"
                value={(percent || 0) >= 0 ? percent : ""}
                onChange={event => {
                  let v = Number(event.target.value);
                  if (isNaN(v)) {
                    v = 0;
                  } else {
                    if (v < 0) {
                      v = 0;
                    }
                    if (v > 100) {
                      v = 100;
                    }
                  }
                  setPercent(v);
                }}
                onEnterKey={() => {
                  if (name && percent !== undefined) {
                    // @ts-ignore
                    presenter.createVat({ name, percent }, () => {
                      setName(undefined);
                      setPercent(undefined);
                    });
                  }
                }}
              />
            </div>
            <div className={styles.item}>
              <WithPermission
                annotation={MAN_VAT_ADD}
                placement="left"
                render={(permissionProps) => (
                  <button
                    className={styles.add_button}
                    disabled={!name || percent === undefined || model.isLoading}
                    onClick={() => {
                      // @ts-ignore
                      presenter.createVat({ name, percent }, () => {
                        setName(undefined);
                        setPercent(undefined);
                      });
                    }}
                    {...permissionProps}
                  >
                    Добавить
                  </button>
              )} />
            </div>
          </div>
          <div className={styles.table_container}>
            <table className={styles.table}>
              <thead>
                <th className={styles.head}>№</th>
                <th className={styles.head}>Название</th>
                <th className={styles.head}>Процент</th>
                <th className={styles.head}>Операции</th>
              </thead>
              <tbody>
                {model.list && model.list.length > 0
                  ? model.list.map((vat, index) => (
                      <tr>
                        <td className={styles.row_item}>{index + 1}</td>
                        <td className={styles.row_item}>
                          {editingVat && editingVat.id === vat.id ? (
                            <Input
                              value={editingVat.name}
                              style={{
                                width: 200,
                                height: 30
                              }}
                              onChange={event => {
                                setEditingVat({
                                  ...editingVat,
                                  name: event.target.value
                                });
                              }}
                            />
                          ) : (
                            <div>{vat.name || ""}</div>
                          )}
                        </td>
                        <td className={styles.row_item}>
                          {editingVat && editingVat.id === vat.id ? (
                            <Input
                              value={editingVat.percent}
                              style={{
                                width: 200,
                                height: 30
                              }}
                              onChange={event => {
                                let v = Number(event.target.value);
                                if (isNaN(v)) {
                                  v = 0;
                                } else {
                                  if (v < 0) {
                                    v = 0;
                                  }
                                  if (v > 100) {
                                    v = 100;
                                  }
                                }
                                setEditingVat({ ...editingVat, percent: v });
                              }}
                            />
                          ) : (
                            <div>{vat.percent === undefined ? '' : vat.percent}</div>
                          )}
                        </td>
                        <td className={styles.row_item}>
                          <div className={styles.actions}>
                            <WithPermission
                              annotation={MAN_VAT_EDIT}
                              placement={{ right: -25, top: -2, bottom: 0 }}
                              render={(permissionProps) => (
                                <span
                                  onClick={() => {
                                    if (model.isLoading) {
                                      return;
                                    }
                                    if (editingVat) {
                                      presenter.updateVat(editingVat, () => {
                                        setEditingVat(undefined);
                                      });
                                    } else {
                                      setEditingVat(vat);
                                    }
                                  }}
                                  {...permissionProps}
                                >
                                  <img src={Edit} alt="edit" width={20} height={20} />
                                </span>
                            )} />
                            <WithPermission
                              annotation={MAN_VAT_DELETE}
                              placement={{ right: -25, top: -2, bottom: 0 }}
                              render={(permissionProps) => (
                                <span
                                  onClick={() => {
                                    if (model.isLoading) {
                                      return;
                                    }
                                    setDeletingVat(vat);
                                    setDeletingDialog(true);
                                  }}
                                  {...permissionProps}
                                >
                                  <img
                                    src={Delete}
                                    alt="delete"
                                    width={20}
                                    height={20}
                                    style={{ marginLeft: 20 }}
                                  />
                                </span>
                            )} />
                          </div>
                        </td>
                      </tr>
                    ))
                  : undefined}
              </tbody>
            </table>
            { !model.list || model.list.length === 0 ? (
              <div className={styles.empty_container}>Список пуст!</div>
            ) : undefined }
          </div>
        </Card>
      </div>
    );
  }
);
