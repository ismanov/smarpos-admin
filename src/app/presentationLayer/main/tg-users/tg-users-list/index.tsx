import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
// import moment from "moment";
import {
  MON_TG_USERS_LIST_FILT_BRANCH,
  MON_TG_USERS_LIST_FILT_COMPANY,
  MON_TG_USERS_LIST_FILT_SEARCH,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import tgUsersEffector from "app/presentationLayer/effects/tg-users";
import commonEffector from "app/presentationLayer/effects/common";
import { Table, Input, Pagination, Tooltip, Button, Alert, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";

// const dateFormat = 'YYYY-MM-DD';
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
    title: "ТГ Логин",
    dataIndex: "telegramLogin",
  },
  {
    title: "ТГ Имя",
    dataIndex: "telegramName",
  },
  // {
  //   title: "Дата регистрации",
  //   dataIndex: 'createdDate',
  // },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Компания",
    dataIndex: "companyName",
  },
];

export const TgUsersList = (props) => {
  const $companyItems = useStore(commonEffector.stores.$companyItems);
  const $branchItems = useStore(commonEffector.stores.$branchItems);

  const $tgUsersList = useStore(tgUsersEffector.stores.$tgUsersList);
  const $tgUsersListFilter = useStore(
    tgUsersEffector.stores.$tgUsersListFilter
  );

  const {
    data: tgUsersData,
    loading: tgUsersLoading,
    error: tgUsersError,
  } = $tgUsersList;

  const {
    content: tgUsers,
    number: tgUsersPage,
    size: tgUsersSize,
    totalElements: tgUsersTotal,
  } = tgUsersData;

  const [searchValue, setSearchValue] = useState($tgUsersListFilter.search);

  useEffect(() => {
    commonEffector.effects.searchCompanyItemsEffect({});

    return () => {
      commonEffector.events.resetCompanyItemsEvent();
      commonEffector.events.resetBranchItemsEvent();
    };
  }, []);

  useEffect(() => {
    tgUsersEffector.effects.fetchTgUsersListEffect($tgUsersListFilter);
  }, [$tgUsersListFilter]);

  const onFilterChange = (fields) => {
    tgUsersEffector.events.updateTgUsersListFilter({
      ...$tgUsersListFilter,
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
    tgUsersEffector.events.resetTgUsersListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$tgUsersListFilter });
  };

  const data = tgUsers.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{tgUsersSize * tgUsersPage + index + 1}</div>,
    fullName: item.fullName.name,
    telegramLogin: item.telegramLogin,
    telegramName: item.telegramName ? (
      <a href={`https://t.me/${item.telegramName}`} target="_blank">
        {item.telegramName}
      </a>
    ) : (
      ""
    ),
    // createdDate: item.createdDate ? moment(item.createdDate).format(dateFormat): "",
    branchName: item.branchName,
    companyName: item.companyName,
  }));

  return (
    <Card fullHeight={true} className="tgUsers-by-companies">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Пользователи телеграм</h1>
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={MON_TG_USERS_LIST_FILT_COMPANY}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$tgUsersListFilter.companyId}
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
            annotation={MON_TG_USERS_LIST_FILT_BRANCH}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$branchItems?.loading}
                placeholder="Филиал"
                value={$tgUsersListFilter?.branchId}
                onChange={(branchId) => onFilterChange({ branchId })}
                disabled={!$tgUsersListFilter?.companyId}
                allowClear
              >
                {$branchItems.data.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_TG_USERS_LIST_FILT_SEARCH}
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
        {tgUsersError && (
          <div className="custom-content__error">
            <Alert message={tgUsersError.message} type="error" />
          </div>
        )}
        <div className="custom-content__table u-fancy-scrollbar">
          <Table
            dataSource={data}
            columns={columns}
            loading={tgUsersLoading}
            pagination={false}
          />
        </div>
        <div className="custom-pagination">
          <Pagination
            total={tgUsersTotal}
            pageSize={tgUsersSize}
            current={tgUsersPage + 1}
            hideOnSinglePage={true}
            pageSizeOptions={["20", "50", "100", "150", "250", "500"]}
            onChange={onChangePagination}
          />
        </div>
      </div>
    </Card>
  );
};
