import React, { useEffect, useState } from "react";
import { Select, DatePicker, Table, Input, Button, Tooltip } from "antd";
import moment from "moment";

import ChequeComponent from "app/presentationLayer/components/cheque";
import cn from "classnames";

import { useStore } from 'effector-react'
import effector from "app/presentationLayer/effects/clients";
import chequesEffector from "app/presentationLayer/effects/clients/cheques";

import { STA_CHEQUE_DETAILS } from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faSearch } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import "./styles.scss"


const dateFormat = 'YYYY-MM-DD HH:mm';
const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';
const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: "",
    dataIndex: 'actions',
  },
  {
    title: 'Дата',
    dataIndex: 'date',
  },
  {
    title: 'Сумма',
    dataIndex: 'sum',
  },
  {
    title: 'Филиал',
    dataIndex: 'branch',
  },
  {
    title: 'Способ оплаты',
    dataIndex: 'paymentType',
  },
  {
    title: 'Тип чека',
    dataIndex: 'chequeType',
  }
];

const chequeTypesItems = [
  {
    name: "Фискальный",
    value: "true"
  },
  {
    name: "Не фискальный",
    value: "false"
  }
];

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from? moment(filter.from).startOf("minute").format(reqDateFormat): undefined,
    to: filter.to? moment(filter.to).endOf("minute").format(reqDateFormat): undefined,
  }
};

export default (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $usersItems = useStore(effector.stores.$usersItems);
  const $chequesList = useStore(chequesEffector.stores.$chequesList);
  const $chequesListFilter = useStore(chequesEffector.stores.$chequesListFilter);
  const $chequeDetails = useStore(chequesEffector.stores.$chequeDetails);
  const $chequesStatuses = useStore(chequesEffector.stores.$chequesStatuses);
  const { data: chequesData, loading: chequesLoading } = $chequesList;

  const {
    content: cheques,
    number: chequesPage,
    size: chequesSize,
    totalElements: chequesTotal
  } = chequesData;

  const [ searchValue, setSearchValue ] = useState($chequesListFilter.search);

  useEffect(() => {
    chequesEffector.effects.fetchChequesStatuses({});
  }, []);

  useEffect(() => {
    chequesEffector.effects.fetchChequesListEffect({ companyId, ...formatFilterProps($chequesListFilter) });
  }, [ $chequesListFilter ]);


  const onFilterChange = (fields) => {
    chequesEffector.events.updateChequesListFilter({ ...$chequesListFilter, page: 0, ...fields });
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

  const onBranchChange = (branchId) => {
    if (branchId) {
      effector.effects.fetchUserItemsEffect({ branchId });
    } else {
      effector.events.resetUsersItems();
    }

    onFilterChange({ branchId });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const onShowChequeDetailsClick = (id) => {
    chequesEffector.effects.fetchChequeDetailsEffect(id);
  };

  const onCloseChequeDetailsClick = () => {
    chequesEffector.events.resetChequeDetailsEvent();
  };

  const data = cheques.map((cheque, index) => ({
    id: cheque.id,
    key: cheque.id,
    num: (<div className="w-s-n">{(chequesSize * chequesPage) + index + 1}</div>),
    actions: (<div className="t-a-c">
      <Tooltip placement="right" title="Чек">
        <Button
          shape="circle"
          icon={<FontAwesomeIcon className='svg' icon={faReceipt} />}
          onClick={() => onShowChequeDetailsClick(cheque.id)}
        />
      </Tooltip>
    </div>),
    date: moment(cheque.receiptDateTime).format("DD-MM-YYYY HH:mm:ss"),
    sum: String(cheque.totalCost),
    branch: cheque.branchName || "Неизвестно",
    paymentType: `${cheque.totalCash ? "Наличные " : ""} ${cheque.totalCard ? "Терминал" : ""}`,
    chequeType: cheque.fiscalUrl ? "Фискальный" : "Не фискальный",
  }));

  return (
    <Card>
      <div className="CP__cheques">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Чеки</h1>
            <span>
              Кол-во чеков: <strong>{chequesTotal.toLocaleString("ru")}</strong>
            </span>
          </div>
        </div>
        <div className="CP__cheques__card">
          <WithPermission annotation={STA_CHEQUE_DETAILS} showChecker={false}>
            <div className={cn("cheque-container", $chequeDetails.data ? "cheque-container_opened" : undefined)}>
              <span className="cheque-container__close-button" onClick={onCloseChequeDetailsClick}> X </span>
              <div style={{ position: "absolute", left: 0, top: 0 }}>
                <WithPermission annotation={STA_CHEQUE_DETAILS} placement={{ left: 10, top: 10 }} />
              </div>
              <ChequeComponent
                isLoading={$chequeDetails.loading}
                cheque={$chequeDetails.data}
              />
            </div>
          </WithPermission>
          <div className="filter-block">
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                showTime={{
                  defaultValue: [ moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm') ],
                }}
                format={dateFormat}
                value={[ $chequesListFilter.from ? moment($chequesListFilter.from) : null, $chequesListFilter.to ? moment($chequesListFilter.to).endOf("minute") : null ]}
                onChange={(_, dateStrings) => onFilterChange({
                  from: dateStrings[0] ? dateStrings[0] : undefined,
                  to: dateStrings[1] ? dateStrings[1] : undefined
                })}
              />
            </div>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$branchItems.loading}
                placeholder='Выберите филиал'
                value={$chequesListFilter.branchId}
                onChange={onBranchChange}
                allowClear
              >
                {$branchItems.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
              </Select>
            </div>
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
                  allowClear
                />
              </div>
            </div>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$usersItems.loading}
                placeholder='Выберите сотрудника'
                value={$chequesListFilter.userId}
                onChange={(userId) => onFilterChange({ userId })}
                disabled={!$chequesListFilter.branchId}
                allowClear
              >
                {$usersItems.data.map((item) => <Option value={item.id}
                                                        key={item.id}>{item.fullName ? item.fullName.name : "Неизвестно"}</Option>)}
              </Select>
            </div>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Выберите тип чека'
                value={$chequesListFilter.isFiscal}
                onChange={(isFiscal) => onFilterChange({ isFiscal })}
                allowClear
              >
                {chequeTypesItems.map((item) => <Option value={item.value} key={item.value}>{item.name}</Option>)}
              </Select>
            </div>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$chequesStatuses.loading}
                placeholder='Выберите статус'
                value={$chequesListFilter.status}
                onChange={(status) => onFilterChange({ status })}
                allowClear
              >
                {$chequesStatuses.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
              </Select>
            </div>
          </div>
          <div className="CP__cabinet__table">
            <Table
              dataSource={data}
              columns={columns}
              loading={chequesLoading}
              pagination={{
                total: chequesTotal,
                pageSize: chequesSize,
                current: chequesPage + 1,
                hideOnSinglePage: true,
                pageSizeOptions: [ "50", "100", "150", "250", "500" ],
                onChange: onChangePagination,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
