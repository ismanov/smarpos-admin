import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import moment from "moment";
import {
  MON_EMPLOYEE_LIST_FILT_BRANCH,
  MON_EMPLOYEE_LIST_FILT_COMPANY,
  MON_EMPLOYEE_LIST_FILT_SEARCH,
  MON_EMPLOYEE_DELETE_TOKEN,
  MON_EMPLOYEE_EDIT,
  MON_EMPLOYEE_UPDATE_LOGIN,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import staffEffector from "app/presentationLayer/effects/staff";
import commonEffector from "app/presentationLayer/effects/common";
import {
  Table,
  Input,
  Pagination,
  Tooltip,
  Button,
  Alert,
  Popover,
  Popconfirm,
  notification,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import { DotsVerticalSvg } from "../../../../../assets/svg";
import { UpdateLoginModal } from "app/presentationLayer/main/staff/update-login-modal";
import { EditUserModal } from "app/presentationLayer/main/staff/edit-user-modal";
import { getFromDictionary } from "app/dictionary";

const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

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
  //   title: "Дата регистрации",
  //   dataIndex: 'createdDate',
  // },
  {
    title: "Компания",
    dataIndex: "companyName",
  },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Роль",
    dataIndex: "role",
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

export const StaffList = (props) => {
  const $companyItems = useStore(commonEffector.stores.$companyItems);
  const $branchItems = useStore(commonEffector.stores.$branchItems);

  const $staffList = useStore(staffEffector.stores.$staffList);
  const $staffListFilter = useStore(staffEffector.stores.$staffListFilter);
  const $updateUser = useStore(staffEffector.stores.$updateUser);
  const $updateUserLogin = useStore(staffEffector.stores.$updateUserLogin);
  const $expireToken = useStore(staffEffector.stores.$expireToken);

  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = $staffList;

  const {
    content: staff,
    number: staffPage,
    size: staffSize,
    totalElements: staffTotal,
  } = staffData;

  const [editModalProps, setEditModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const [updateLoginModalProps, setUpdateLoginModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const [searchValue, setSearchValue] = useState($staffListFilter.search);
  const [menuPopoverVisibility, setMenuPopoverVisibility] = useState<
    number | null
  >(null);

  useEffect(() => {
    commonEffector.effects.searchCompanyItemsEffect({});

    return () => {
      commonEffector.events.resetCompanyItemsEvent();
      commonEffector.events.resetBranchItemsEvent();
    };
  }, []);

  useEffect(() => {
    staffEffector.effects.fetchStaffListEffect($staffListFilter);
  }, [$staffListFilter]);

  useEffect(() => {
    if ($updateUser.success) {
      staffEffector.effects.fetchStaffListEffect($staffListFilter);
    }

    if ($updateUserLogin.success) {
      staffEffector.effects.fetchStaffListEffect($staffListFilter);
    }

    if ($expireToken.success) {
      notification["success"]({
        message: "Токен удален",
      });
      staffEffector.events.resetExpireToken();
    }
  }, [$updateUser.success, $updateUserLogin.success, $expireToken.success]);

  const onFilterChange = (fields) => {
    staffEffector.events.updateStaffListFilter({
      ...$staffListFilter,
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

  const onCompanySearch = (search) => {
    if (search.length > 2 || search.length == 0) {
      withDebounce(() => {
        commonEffector.effects.searchCompanyItemsEffect({ search, size: 100 });
      });
    }
  };

  const onCompanyChange = (companyId) => {
    const fields: any = { companyId };
    if (companyId) {
      commonEffector.effects.fetchBranchItemsEffect({ companyId });
    } else {
      commonEffector.events.resetBranchItemsEvent();
      fields.branchId = undefined;
    }

    onFilterChange(fields);
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    staffEffector.events.resetStaffListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$staffListFilter });
  };

  const onEditClick = (user) => {
    setEditModalProps({ visible: true, shouldRender: true, user });
  };

  const onUpdateLoginClick = (user) => {
    setUpdateLoginModalProps({ visible: true, shouldRender: true, user });
  };

  const data = staff.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{staffSize * staffPage + index + 1}</div>,
    fullName: item.fullName.name,
    login: item.login,
    createdDate: item.createdDate
      ? moment(item.createdDate).format(dateFormat)
      : "",
    branchName: item.branchName,
    companyName: item.companyName,
    role: item.authorities.map(getFromDictionary).join(", "),
    resetKey: item.resetKey,
    activationKey: item.activationKey,
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
              annotation={MON_EMPLOYEE_EDIT}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Button
                    onClick={() => onEditClick(item)}
                    {...permissionProps}
                  >
                    Редактировать
                  </Button>
                </div>
              )}
            />
            <WithPermission
              annotation={MON_EMPLOYEE_UPDATE_LOGIN}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Button
                    onClick={() => onUpdateLoginClick(item)}
                    {...permissionProps}
                  >
                    Изменить логин
                  </Button>
                </div>
              )}
            />
            <WithPermission
              annotation={MON_EMPLOYEE_DELETE_TOKEN}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Popconfirm
                    placement="topRight"
                    title="Вы действительно хотите удалить токен?"
                    onConfirm={() =>
                      staffEffector.effects.expireTokenEffect(item.id)
                    }
                  >
                    <Button
                      loading={$expireToken.loading}
                      type="primary"
                      danger
                      {...permissionProps}
                    >
                      Удалить токен
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
  }));

  return (
    <Card fullHeight={true} className="staff-by-companies">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <strong>Сотрудники</strong>
            <span> Кол-во: {staffTotal}</span>
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={MON_EMPLOYEE_LIST_FILT_COMPANY}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$staffListFilter.companyId}
                placeholder="Компания"
                onSearch={onCompanySearch}
                onChange={(value) => onCompanyChange(value)}
                filterOption={false}
                defaultActiveFirstOption={false}
                allowClear
              >
                {$companyItems.data.content.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_EMPLOYEE_LIST_FILT_BRANCH}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$branchItems.loading}
                placeholder="Филиал"
                value={$staffListFilter.branchId}
                onChange={(branchId) => onFilterChange({ branchId })}
                disabled={!$staffListFilter.companyId}
                allowClear
              >
                {$branchItems?.data?.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_EMPLOYEE_LIST_FILT_SEARCH}
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
        {staffError && (
          <div className="custom-content__error">
            <Alert message={staffError.message} type="error" />
          </div>
        )}
        <div className="custom-content__table u-fancy-scrollbar">
          <Table
            dataSource={data}
            columns={columns}
            loading={staffLoading}
            pagination={false}
          />
        </div>
        <div className="custom-pagination">
          <Pagination
            total={staffTotal}
            pageSize={staffSize}
            current={staffPage + 1}
            hideOnSinglePage={true}
            pageSizeOptions={["20", "50", "100", "150", "250", "500"]}
            onChange={onChangePagination}
          />
        </div>
      </div>
      {editModalProps.shouldRender && (
        <EditUserModal
          modalProps={editModalProps}
          setModalProps={setEditModalProps}
        />
      )}
      {updateLoginModalProps.shouldRender && (
        <UpdateLoginModal
          modalProps={updateLoginModalProps}
          setModalProps={setUpdateLoginModalProps}
        />
      )}
    </Card>
  );
};
