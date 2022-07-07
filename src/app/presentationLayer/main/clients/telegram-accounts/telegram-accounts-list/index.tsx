import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "effector-react";
import { Table, Button, Popover, Popconfirm, notification } from "antd";

import Card from "app/presentationLayer/components/card";
import effector from "app/presentationLayer/effects/clients/telegram-accounts";

import {
  MAN_USER_EDIT,
  MON_COMPANY_DETAILS_PROMOTION_ADD,
  MON_KKM_DELETE,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import { AddEditTelegramAccountModal } from "app/presentationLayer/main/clients/telegram-accounts/add-edit-telegram-account-modal";
import { DotsVerticalSvg } from "../../../../../../assets/svg";
import { SelectAgreementModal } from "app/presentationLayer/main/clients/telegram-accounts/select-agreement-modal";

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: <div className="w-s-n">Имя</div>,
    dataIndex: "name",
  },
  {
    title: <div className="w-s-n">Телефон</div>,
    dataIndex: "phone",
  },
  {
    title: <div className="w-s-n">Подтверждение</div>,
    dataIndex: "confirmed",
  },
  {
    title: <div className="w-s-n">Включен</div>,
    dataIndex: "enabled",
  },
  {
    title: "",
    dataIndex: "actions",
    width: 50,
  },
];

export const TelegramAccountsList = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $telegramAccountsList = useStore(effector.stores.$telegramAccountsList);
  const $telegramAccountsListFilter = useStore(
    effector.stores.$telegramAccountsListFilter
  );
  const $deleteTelegramAccount = useStore(
    effector.stores.$deleteTelegramAccount
  );
  const $disableTelegramAccount = useStore(
    effector.stores.$disableTelegramAccount
  );
  const $enableTelegramAccount = useStore(
    effector.stores.$enableTelegramAccount
  );

  const {
    data: telegramAccounts,
    loading: telegramAccountsLoading,
  } = $telegramAccountsList;

  const [
    addTelegramAccountModalProps,
    setAddTelegramAccountModalProps,
  ] = useState<any>({
    visible: false,
    shouldRender: false,
    telegramAccountId: null,
    companyId,
  });

  const [selectAgreementModalProps, setSelectAgreementModalProps] = useState<
    any
  >({
    visible: false,
    shouldRender: false,
  });

  const [
    fetchAvailableTelegramAgreementsLoading,
    setFetchAvailableTelegramAgreementsLoading,
  ] = useState(false);

  const getList = useCallback(() => {
    effector.effects.fetchTelegramAccountsList({
      companyId,
      ...$telegramAccountsListFilter,
    });
  }, [companyId, $telegramAccountsListFilter]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if ($enableTelegramAccount.success) {
      notification["success"]({
        message: "Телеграм аккаунт включен",
      });
      setSelectAgreementModalProps({
        ...selectAgreementModalProps,
        visible: false,
      });
      getList();
      effector.events.resetEnableTelegramAccount();
    }
  }, [$enableTelegramAccount.success]);

  useEffect(() => {
    if ($disableTelegramAccount.success) {
      notification["success"]({
        message: "Телеграм аккаунт отключен",
      });
      getList();
      effector.events.resetDisableTelegramAccount();
    }
  }, [$disableTelegramAccount.success]);

  useEffect(() => {
    if ($deleteTelegramAccount.success) {
      notification["success"]({
        message: "Телеграм аккаунт удален",
      });
      getList();
      effector.events.resetDeleteTelegramAccount();
    }
  }, [$deleteTelegramAccount.success]);

  const onAddTelegramAccountClick = () => {
    setAddTelegramAccountModalProps({
      ...addTelegramAccountModalProps,
      visible: true,
      shouldRender: true,
      telegramAccountId: null,
    });
  };

  const onEditTelegramAccountClick = (telegramAccountId) => {
    setAddTelegramAccountModalProps({
      ...addTelegramAccountModalProps,
      visible: true,
      shouldRender: true,
      telegramAccountId,
    });
  };

  const onEnableTelegramAccountClick = (telegramAccountId) => {
    setFetchAvailableTelegramAgreementsLoading(true);
    effector.effects.fetchAvailableTelegramAgreements({ companyId }).then(
      (availableTelegramAgreements) => {
        const availableAgreementsLength = availableTelegramAgreements.length;

        if (availableAgreementsLength === 0) {
          notification["info"]({
            message: "Нет свободных слотов",
          });
        } else if (availableAgreementsLength === 1) {
          effector.effects.enableTelegramAccount({
            id: telegramAccountId,
            data: {
              agreementId: availableTelegramAgreements[0].id,
            },
          });
        } else {
          setSelectAgreementModalProps({
            visible: true,
            shouldRender: true,
            availableTelegramAgreements,
            telegramAccountId,
          });
        }

        setFetchAvailableTelegramAgreementsLoading(false);
      },
      () => {
        setFetchAvailableTelegramAgreementsLoading(false);
      }
    );
  };

  const data = telegramAccounts.map((item, index) => {
    return {
      id: item.id,
      key: item.id,
      num: <div className="w-s-n">{index + 1}</div>,
      name: item.name,
      phone: item.phone,
      confirmed: item.confirmed ? (
        <div className="green">Подтвержден</div>
      ) : (
        "Не подтвержден"
      ),
      enabled: item.enabled ? <div className="green">Да</div> : "Нет",
      actions: (
        <Popover
          overlayClassName="custom__popover"
          placement="bottomRight"
          trigger="click"
          content={
            <div>
              <WithPermission
                annotation={MAN_USER_EDIT}
                render={(permissionProps) => (
                  <div className="custom__popover__item">
                    <Button
                      onClick={() => onEditTelegramAccountClick(item.id)}
                      {...permissionProps}
                    >
                      Редактировать
                    </Button>
                  </div>
                )}
              />
              {!item.enabled && (
                <WithPermission
                  annotation={MAN_USER_EDIT}
                  render={(permissionProps) => (
                    <div className="custom__popover__item">
                      <Popconfirm
                        placement="topRight"
                        title="Вы действительно хотите включить аккаунт?"
                        okText="Да"
                        onConfirm={() => onEnableTelegramAccountClick(item.id)}
                      >
                        <Button
                          loading={
                            $enableTelegramAccount.loading ||
                            fetchAvailableTelegramAgreementsLoading
                          }
                          {...permissionProps}
                        >
                          Включить
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                />
              )}
              {item.enabled && (
                <WithPermission
                  annotation={MAN_USER_EDIT}
                  render={(permissionProps) => (
                    <div className="custom__popover__item">
                      <Popconfirm
                        placement="topRight"
                        title="Вы действительно хотите отключить аккаунт?"
                        okText="Да"
                        onConfirm={() =>
                          effector.effects.disableTelegramAccount(item.id)
                        }
                      >
                        <Button
                          loading={$disableTelegramAccount.loading}
                          type="primary"
                          danger
                          {...permissionProps}
                        >
                          Отключить
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                />
              )}
              <WithPermission
                annotation={MON_KKM_DELETE}
                render={(permissionProps) => (
                  <div className="custom__popover__item">
                    <Popconfirm
                      placement="topRight"
                      title="Вы действительно хотите удалить аккаунт?"
                      okText="Да"
                      onConfirm={() =>
                        effector.effects.deleteTelegramAccount(item.id)
                      }
                    >
                      <Button
                        loading={$deleteTelegramAccount.loading}
                        type="primary"
                        danger
                        {...permissionProps}
                      >
                        Удалить
                      </Button>
                    </Popconfirm>
                  </div>
                )}
              />
            </div>
          }
        >
          <Button
            className="custom__popover-btn"
            type="ghost"
            icon={<DotsVerticalSvg />}
          />
        </Popover>
      ),
    };
  });

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Телеграм аккаунты</h1>
          </div>
          <div>
            <WithPermission annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}>
              <Button type="primary" onClick={onAddTelegramAccountClick}>
                Добавить
              </Button>
            </WithPermission>
          </div>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={telegramAccountsLoading}
            pagination={false}
          />
        </div>
      </div>
      {addTelegramAccountModalProps.shouldRender && (
        <AddEditTelegramAccountModal
          modalProps={addTelegramAccountModalProps}
          setModalProps={setAddTelegramAccountModalProps}
          callBack={getList}
          {...props}
        />
      )}
      {selectAgreementModalProps.shouldRender && (
        <SelectAgreementModal
          modalProps={selectAgreementModalProps}
          setModalProps={setSelectAgreementModalProps}
        />
      )}
    </Card>
  );
};
