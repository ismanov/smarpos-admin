import React, { useEffect, useState } from "react";
import { Button, notification, Popconfirm, Popover, Table } from "antd";
import moment from "moment";

import { useStore } from "effector-react";
import effector from "app/presentationLayer/effects/clients/users";
import staffEffector from "app/presentationLayer/effects/staff";

import Card from "app/presentationLayer/components/card";
import { UpdateLoginModal } from "app/presentationLayer/main/staff/update-login-modal";
import { DotsVerticalSvg } from "../../../../../assets/svg";
import { getFromDictionary } from "app/dictionary";
import ModalItems from "./ModalItems";
import { EditUserModal } from "./edit-user-modal";

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "ФИО",
    dataIndex: "fullName",
  },
  {
    title: "Логин",
    dataIndex: "login",
  },
  // {
  //   title: 'Дата регистрации',
  //   dataIndex: 'createdDate',
  // },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Роль",
    dataIndex: "role",
  },
  {
    title: "Код восстановления",
    dataIndex: "resetKey",
  },
  {
    title: "Код активации",
    dataIndex: "activationKey",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];

export const Users = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $usersList = useStore(effector.stores.$usersList);
  const $createUser = useStore(effector.stores.$createUser);
  const $roleList = useStore(effector.stores.$authoritiesList);
  const $usersFilter = useStore(effector.stores.$usersFilter);

  const $updateUserLogin = useStore(staffEffector.stores.$updateUserLogin);
  const $expireToken = useStore(staffEffector.stores.$expireToken);

  const { data: usersData, loading: usersLoading } = $usersList;

  const {
    content: users,
    number: usersPage,
    size: usersSize,
    totalElements: usersTotal,
  } = usersData;
  const [visibleModalAdd, setVisibleModalAdd] = useState(false);
  const [editModalProps, setEditModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const [updateLoginModalProps, setUpdateLoginModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    effector.effects.fetchUsersListEffect({ companyId, ...$usersFilter });
  }, [companyId, $usersFilter]);

  useEffect(() => {
    $createUser.success &&
      effector.effects.fetchUsersListEffect({ companyId, ...$usersFilter });
  }, [$createUser.success]);

  useEffect(() => {
    if ($updateUserLogin.success) {
      effector.effects.fetchUsersListEffect({ companyId });
    }
    if ($expireToken.success) {
      notification["success"]({
        message: "Токен удален",
      });
      staffEffector.events.resetExpireToken();
    }
  }, [$updateUserLogin.success, $expireToken.success]);

  const onFilterChange = (fields) => {
    effector.events.updateUsersFilter({ ...$usersFilter, page: 0, ...fields });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ ...$usersFilter, page: page - 1, size });
  };

  const onEditClick = (user) => {
    !$roleList?.length &&
      effector.effects.fetchAuthoritiesListEffects(undefined);
    setEditModalProps({ visible: true, shouldRender: true, user });
  };

  const onUpdateLoginClick = (user) => {
    setUpdateLoginModalProps({ visible: true, shouldRender: true, user });
  };

  const data = users.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{usersSize * usersPage + index + 1}</div>,
    fullName: item.fullName.name,
    login: item.login,
    createdDate: item.createdDate
      ? moment(item.createdDate).format("DD-MM-YYYY")
      : "-",
    branchName: item.branchName,
    role: item.authorities.map(getFromDictionary).join(", "),
    resetKey: item.resetKey || "-",
    activationKey: item.activationKey || "-",
    actions: (
      <Popover
        overlayClassName="custom__popover"
        placement="bottomRight"
        trigger="click"
        content={
          <div>
            <div className="custom__popover__item">
              <Button onClick={() => onEditClick(item)}>Изменить роль</Button>
            </div>
            <div className="custom__popover__item">
              <Button onClick={() => onUpdateLoginClick(item)}>
                Изменить логин
              </Button>
            </div>
            <div className="custom__popover__item">
              <Popconfirm
                placement="topRight"
                title="Вы действительно хотите удалить токен?"
                onConfirm={() =>
                  staffEffector.effects.expireTokenEffect(item.id)
                }
              >
                <Button loading={$expireToken.loading} type="primary" danger>
                  Удалить токен
                </Button>
              </Popconfirm>
            </div>
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
  }));

  return (
    <Card>
      <ModalItems
        {...props}
        {...{
          visibleModalAdd,
          setVisibleModalAdd,
          companyId,
          authoritiesList: $roleList,
        }}
      />
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <strong>Сотрудники</strong>
            <span> Кол-во: {usersTotal}</span>
          </div>
          <Button
            onClick={() => {
              !$roleList?.length &&
                effector.effects.fetchAuthoritiesListEffects(undefined);
              setVisibleModalAdd(true);
            }}
            type="primary"
          >
            Добавить
          </Button>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={usersLoading}
            pagination={{
              total: usersTotal,
              pageSize: usersSize,
              current: usersPage + 1,
              hideOnSinglePage: true,
              showSizeChanger: true,
              pageSizeOptions: ["20", "50", "100", "150", "250", "500"],
              onChange: onChangePagination,
            }}
          />
        </div>
      </div>
      {editModalProps.shouldRender && (
        <EditUserModal
          roleList={$roleList}
          modalProps={editModalProps}
          setModalProps={setEditModalProps}
          {...props}
        />
      )}
      {updateLoginModalProps.shouldRender && (
        <UpdateLoginModal
          modalProps={updateLoginModalProps}
          setModalProps={setUpdateLoginModalProps}
          {...props}
        />
      )}
    </Card>
  );
};
