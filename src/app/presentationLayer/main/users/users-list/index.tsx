import React, { useEffect, useState, useMemo } from "react";
import { useStore } from "effector-react";
import moment from "moment";
import {
  MAN_USER_ADD,
  MAN_USER_EDIT,
  MAN_USER_LIST_FILT_SEARCH,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import usersEffector from "app/presentationLayer/effects/users";
import mainEffector from "app/presentationLayer/effects/main";
import permissionsEffector from "app/presentationLayer/effects/permissions";
import {
  Table,
  Input,
  Pagination,
  Tooltip,
  Button,
  Alert,
  Popover,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import { AddEditUserModal } from "app/presentationLayer/main/users/add-edit-user-modal";
import { DotsVerticalSvg } from "../../../../../assets/svg";
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

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
  {
    title: "Дата регистрации",
    dataIndex: "createdDate",
  },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Компания",
    dataIndex: "companyName",
  },
  {
    title: "Роль",
    dataIndex: "roles",
  },
  {
    title: "Код активации",
    dataIndex: "activationKey",
  },
  {
    title: "Код восстановления",
    dataIndex: "resetKey",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];

export const UsersList = (props) => {
  const $usersList = useStore(usersEffector.stores.$usersList);
  const $usersListFilter = useStore(usersEffector.stores.$usersListFilter);
  const $createUser = useStore(usersEffector.stores.$createUser);
  const $updateUser = useStore(usersEffector.stores.$updateUser);

  const $currentUser = useStore(mainEffector.stores.$currentUser);
  const $permissionsMode = useStore(
    permissionsEffector.stores.$permissionsMode
  );

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = $usersList;

  const {
    content: users,
    number: usersPage,
    size: usersSize,
    totalElements: usersTotal,
  } = usersData;

  const { data: currentUser } = $currentUser;

  const [searchValue, setSearchValue] = useState($usersListFilter.search);
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const [addUserModalProps, setAddUserModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
    userId: null,
  });

  const [menuPopoverVisibility, setMenuPopoverVisibility] = useState<
    number | null
  >(null);

  const usersFiltered = useMemo(
    () =>
      users.filter(
        (item) =>
          !roleFilter || item.authorities.find((role) => role === roleFilter)
      ),
    [users, roleFilter]
  );

  useEffect(() => {
    usersEffector.effects.fetchUsersListEffect($usersListFilter);
  }, [$usersListFilter]);

  useEffect(() => {
    if ($createUser.success) {
      usersEffector.effects.fetchUsersListEffect($usersListFilter);
    }

    if ($updateUser.success) {
      usersEffector.effects.fetchUsersListEffect($usersListFilter);
    }
  }, [$createUser.success, $updateUser.success]);

  const onFilterChange = (fields) => {
    usersEffector.events.updateUsersListFilter({
      ...$usersListFilter,
      page: 0,
      ...fields,
    });
  };

  const onSearchChange = (e) => {
    const search = e.target.value;
    setSearchValue(search);

    withDebounce(() => {
      onFilterChange({
        search,
      });
    });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    setRoleFilter(undefined);
    usersEffector.events.resetUsersListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$usersListFilter });
  };

  const onAddUserClick = () => {
    setAddUserModalProps({ visible: true, shouldRender: true, userId: null });
  };

  const onUpdateUserClick = (userId) => {
    setAddUserModalProps({ visible: true, shouldRender: true, userId });
  };

  const onEnablePermissionClick = (user) => {
    setMenuPopoverVisibility(null);
    permissionsEffector.events.enablePermissionsMode(user);
  };

  const data = usersFiltered.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{usersSize * usersPage + index + 1}</div>,
    fullName: item.fullName.name,
    login: item.login,
    createdDate: item.createdDate
      ? moment(item.createdDate).format(dateFormat)
      : "",
    branchName: item.branchName,
    companyName: item.companyName,
    roles: item.authorities.reduce(
      (acc, item) => `${acc}${acc ? ", " : ""}${getRoleName(item)}`,
      ""
    ),
    activationKey: item.activationKey,
    resetKey: item.resetKey,
    actions: (
      <Popover
        overlayClassName="custom__popover"
        placement="bottomRight"
        trigger="click"
        visible={menuPopoverVisibility === item.id}
        onVisibleChange={(visible) =>
          setMenuPopoverVisibility(visible ? item.id : null)
        }
        content={
          <div>
            <WithPermission
              annotation={MAN_USER_EDIT}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Button
                    onClick={() => onUpdateUserClick(item.id)}
                    {...permissionProps}
                  >
                    Редактировать
                  </Button>
                </div>
              )}
            />
            {currentUser && currentUser.superAdmin && !$permissionsMode.user && (
              <div className="custom__popover__item">
                <Button onClick={() => onEnablePermissionClick(item)}>
                  Установить права
                </Button>
              </div>
            )}
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
    <Card fullHeight={true} className="users-by-companies">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <strong>Пользователи</strong>
            <span> Кол-во: {usersTotal}</span>
          </div>
          <div>
            <WithPermission
              annotation={MAN_USER_ADD}
              placement="left"
              render={(permissionProps) => (
                <Button
                  type="primary"
                  onClick={onAddUserClick}
                  {...permissionProps}
                >
                  Добавить
                </Button>
              )}
            />
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <div className="filter-block__search">
              <Select
                placeholder="Выберите роль"
                key="key"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e);
                }}
                style={{ width: "100%" }}
              >
                {roles.map((item) => (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <WithPermission
            annotation={MAN_USER_LIST_FILT_SEARCH}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <div className="filter-block__search">
                <div className="filter-block__search__icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <Input
                  className="custom-input"
                  placeholder="Поиск"
                  value={searchValue}
                  onChange={onSearchChange}
                />
              </div>
            </div>
          </WithPermission>
          <div className="filter-block__item filter-block__buttons">
            <Tooltip placement="bottom" title="Сбросить фильтр">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className="svg" icon={faTimes} />}
                onClick={onResetFilterProps}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Повторный запрос">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className="svg" icon={faUndo} />}
                onClick={onRefreshFilterProps}
              />
            </Tooltip>
          </div>
        </div>
        {usersError && (
          <div className="custom-content__error">
            <Alert message={usersError.message} type="error" />
          </div>
        )}
        <div className="custom-content__table u-fancy-scrollbar">
          <Table
            dataSource={data}
            columns={columns}
            loading={usersLoading}
            pagination={false}
          />
        </div>
        <div className="custom-pagination">
          <Pagination
            total={usersTotal}
            pageSize={usersSize}
            current={usersPage + 1}
            hideOnSinglePage={true}
            pageSizeOptions={["20", "50", "100", "150", "250", "500"]}
            onChange={onChangePagination}
          />
        </div>
      </div>
      {addUserModalProps.shouldRender && (
        <AddEditUserModal
          modalProps={addUserModalProps}
          setModalProps={setAddUserModalProps}
          {...props}
        />
      )}
    </Card>
  );
};

const getRoleName = (role_key) => {
  switch (role_key) {
    case "ROLE_OWNER":
      return "Владелец";
    case "ROLE_OPERATOR":
      return "Оператор";
    case "ROLE_ADMIN":
      return "Админ";
    case "ROLE_SUPER_ADMIN":
      return "Супер админ";
    default:
      return role_key;
  }
};

const roles = [
  {
    key: "ROLE_ADMIN",
    value: "Админ",
  },
  {
    key: "ROLE_OPERATOR",
    value: "Оператор",
  },
  {
    key: "ROLE_SUPER_ADMIN",
    value: "Супер админ",
  },
];
