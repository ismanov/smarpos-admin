import React, { useEffect, useState } from 'react';

import { useStore } from "effector-react";
import moment from "moment";
import {
  STA_CHEQUE_LIST_FILT_BRANCH,
  STA_CHEQUE_LIST_FILT_COMPANY,
  STA_CHEQUE_LIST_FILT_DATE,
  STA_CHEQUE_LIST_FILT_EMPLOYEE,
  STA_CHEQUE_LIST_FILT_CHEQUE_TYPE,
  STA_CHEQUE_LIST_FILT_SEARCH,
  STA_CHEQUE_DETAILS,
  STA_CHEQUE_LIST_FILT_PRICE,
  STA_CHEQUE_LIST_STAT_RECEIPTS,
  STA_CHEQUE_LIST_STAT_NDS,
  STA_CHEQUE_LIST_STAT_POSITIONS_IN_RECEIPTS,
  STA_CHEQUE_LIST_STAT_REVENUE,
  STA_CHEQUE_LIST_STAT_DISCOUNT,
  STA_CHEQUE_LIST_STAT_CASH,
  STA_CHEQUE_LIST_STAT_CARD,
  STA_CHEQUE_LIST_STAT_CARD_UZCARD,
  STA_CHEQUE_LIST_STAT_CARD_HUMO, STA_CHEQUE_LIST_STAT_CARD_LOYALTY, STA_CHEQUE_LIST_STAT_CARD_OTHER,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import chequesEffector from "app/presentationLayer/effects/cheques";
import {
  Table,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Pagination,
  Button,
  Tooltip,
  InputNumber,
  Switch,
  Alert,
  Spin
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faSearch, faUndo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { withSort } from "app/presentationLayer/th-with-sort";
import ChequeComponent from "app/presentationLayer/components/cheque";
import cn from "classnames";
import { formatNumber, withDebounce } from "app/utils/utils";
import Card from "app/presentationLayer/components/card";

const onlyDateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';



const { RangePicker } = DatePicker;
const { RangePicker: RangeTimePicker } = TimePicker;
const { Option } = Select;

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
    totalCostFrom: filter.totalCostFrom ? filter.totalCostFrom : undefined,
    totalCostTo: filter.totalCostTo ? filter.totalCostTo : undefined,
    from: filter.from ? moment(filter.from).startOf("minute").format(reqDateFormat) : undefined,
    to: filter.to ? moment(filter.to).endOf("minute").format(reqDateFormat) : undefined,
  }
};

const getPaymentTypeTitleForKeyword = (paymentType) => {
  switch (paymentType) {
    case "CASH":
      return "Наличные";
    case "CARD":
      return "Карта";
    case "UZCARD":
      return "UZCARD";
    case "HUMO":
      return "HUMO";
    case "LOYALTY_CARD":
      return "Карта лояльности";
    case "OTHER":
      return "Другое";
    default:
      return "Другое";
  }
};

export const Cheques = (props) => {
  const $chequesList = useStore(chequesEffector.stores.$chequesList);
  const $chequesListFilter = useStore(chequesEffector.stores.$chequesListFilter);
  const $chequesListSort = useStore(chequesEffector.stores.$chequesListSort);
  const $chequesStats = useStore(chequesEffector.stores.$chequesStats);
  const $companyItems = useStore(chequesEffector.stores.$companyItems);
  const $branchItems = useStore(chequesEffector.stores.$branchItems);
  const $usersItems = useStore(chequesEffector.stores.$usersItems);
  const $chequeDetails = useStore(chequesEffector.stores.$chequeDetails);
  const $paymentTypes = useStore(chequesEffector.stores.$paymentTypes);

  const { data: chequesData, loading: chequesLoading, error: chequesError } = $chequesList;

  const {
    content: cheques,
    number: chequesPage,
    size: chequesSize,
    totalElements: chequesTotal
  } = chequesData;

  const { data: chequesStats, loading: chequesStatsLoading } = $chequesStats;
  const [ searchValue, setSearchValue ] = useState($chequesListFilter.search);

  useEffect(() => {
    chequesEffector.effects.searchCompanyItemsEffect({});
    chequesEffector.effects.fetchRegionsItemsEffect();
    chequesEffector.effects.fetchActivityTypesItemsEffect();
    chequesEffector.effects.fetchPaymentTypesEffect();

    return () => {
      chequesEffector.events.resetChequeDetailsEvent();
    }
  }, []);

  useEffect(() => {
    chequesEffector.effects.fetchChequesListEffect(formatFilterProps({ ...$chequesListFilter, ...$chequesListSort }));
  }, [ $chequesListFilter, $chequesListSort ]);

  useEffect(() => {
    chequesEffector.effects.fetchChequesStatsEffect(formatFilterProps($chequesListFilter));
  }, [$chequesListFilter]);

  const onFilterChange = (fields) => {
    chequesEffector.events.updateChequesListFilter({ ...$chequesListFilter, page: 0, ...fields });
  };

  // const onPaymentTypeChange = (field) => {
  //   chequesEffector.events.updateChequesListFilter({...$chequesListFilter, page: 0, paymentTypes: field })
  // };

  const onSortChange = (fields) => {
    chequesEffector.events.updateChequesListSort({ ...$chequesListSort, ...fields });
  };

  const onDateChange = (prop, dateStrings) => {
    const timeFrom = $chequesListFilter.from ? moment($chequesListFilter.from): moment().startOf("day");
    const timeTo = $chequesListFilter.to ? moment($chequesListFilter.to): moment().endOf("day");

    const from = dateStrings[0] ? `${dateStrings[0]}T${timeFrom.format(timeFormat)}`: undefined;
    const to = dateStrings[1] ? `${dateStrings[1]}T${timeTo.format(timeFormat)}`: undefined;

    onFilterChange({ from, to });
  };

  const onTimeChange = (prop, timeStrings) => {
    const timeFrom = timeStrings[0] ? timeStrings[0]: moment().startOf("day").format(timeFormat);
    const timeTo = timeStrings[1] ? timeStrings[1]: moment().endOf("day").format(timeFormat);

    const from = `${moment($chequesListFilter.from).format(onlyDateFormat)}T${timeFrom}`;
    const to = `${moment($chequesListFilter.to).format(onlyDateFormat)}T${timeTo}`;

    onFilterChange({ from, to });
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

  const onPriceChange = (field, value) => {
    withDebounce(() => {
      onFilterChange({
        [field]: value,
      });
    });
  };

  const onCostFromChange = (field, value) => {
    if (!value) {
      onPriceChange(field, value);
    } else {
      const from = $chequesListFilter.totalCostFrom || 0;

      if (value >= from) {
        onPriceChange(field, value);
      }
    }
  };

  const onCompanySearch = (search) => {
    if (search.length > 2 || search.length == 0) {
      withDebounce(() => {
        chequesEffector.effects.searchCompanyItemsEffect({ search, size: 100 });
      });
    }
  };

  const onCompanyChange = (companyId) => {
    const fields: any = { companyId };
    if (companyId) {
      chequesEffector.effects.fetchBranchItemsEffect({ companyId });
    } else {
      chequesEffector.events.resetBranchItemsEvent();
      fields.branchId = undefined;

      chequesEffector.events.resetUsersItemsEvent();
      fields.userId = undefined;
    }

    onFilterChange(fields);
  };

  const onBranchChange = (branchId) => {
    const fields: any = { branchId };
    if (branchId) {
      // @ts-ignore
      chequesEffector.effects.fetchUsersItemsEffect({ companyId: $chequesListFilter.companyId, branchId });
    } else {
      chequesEffector.events.resetUsersItemsEvent();
      fields.userId = undefined;
    }

    onFilterChange(fields);
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ ...$chequesListFilter, page: page - 1, size });
  };

  const orderByChange = (fieldName) => {
    if ($chequesListSort.orderBy && fieldName === $chequesListSort.orderBy) {
      onSortChange({ sortOrder: $chequesListSort.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({
        orderBy: fieldName,
        sortOrder: "asc"
      });
    }
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    chequesEffector.events.resetChequesListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$chequesListFilter })
  };

  const onShowChequeDetailsClick = (id) => {
    chequesEffector.effects.fetchChequeDetailsEffect(id);
  };

  const onCloseChequeDetailsClick = () => {
    chequesEffector.events.resetChequeDetailsEvent();
  };

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
      title: withSort("Дата", "receiptDateTime", $chequesListSort.orderBy, $chequesListSort.sortOrder, orderByChange),
      dataIndex: 'date',
    },
    {
      title: withSort("Сумма", "totalCost", $chequesListSort.orderBy, $chequesListSort.sortOrder, orderByChange),
      dataIndex: 'totalCost',
    },
    {
      title: "Компания",
      dataIndex: 'companyName',
    },
    {
      title: "Филиал",
      dataIndex: 'branchName',
    },
    {
      title: "Способ оплаты",
      dataIndex: 'paymentType',
    },
    {
      title: "Тип чека",
      dataIndex: 'chequeType',
    },
  ];

  const data = cheques.map((cheque, index) => ({
    id: cheque.id,
    key: cheque.id,
    num: (<div className="w-s-n">{(chequesSize * chequesPage) + index + 1}</div>),
    actions: (<div>
      <WithPermission annotation={STA_CHEQUE_DETAILS} placement={"left"} render={(permissionProps) => (
        <Tooltip placement="right" title="Чек">
          <Button
            shape="circle"
            icon={<FontAwesomeIcon className='svg' icon={faReceipt} />}
            onClick={() => onShowChequeDetailsClick(cheque.id)}
            {...permissionProps}
          />
        </Tooltip>
      )} />
    </div>),
    date: cheque.receiptDateTime ? moment(cheque.receiptDateTime).format("DD-MM-YYYY HH:mm:ss"): "-",
    totalCost: cheque.totalCost ? cheque.totalCost.toLocaleString("ru"): "-",
    companyName: cheque.companyName || "Неизвестно",
    branchName: cheque.branchName || "Неизвестно",
    paymentType: `${cheque.totalCash ? "Наличные " : ""} ${cheque.totalCard ? "Терминал" : ""}`,
    chequeType: cheque.fiscalUrl ? "Фискальный" : "Не фискальный",
  }));

  return (
    <Card className="cheques" fullHeight={true}>
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Чеки</h1>
          </div>
        </div>
        <div className="custom-content__stats with-loader">
          {chequesStats && <>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_RECEIPTS}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Кол-во чеков: <strong>{(chequesStats.receipts || 0).toLocaleString("ru")}</strong>
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_NDS}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Ндс: <strong>{chequesStats.nds.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_POSITIONS_IN_RECEIPTS}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Позиций в чеках: <strong>{chequesStats.positionsInReceipts.toLocaleString("ru")}</strong>
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_REVENUE}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Выручка: <strong>{chequesStats.revenue.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_DISCOUNT}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Скидка: <strong>{chequesStats.discount.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CASH}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Наличные: <strong>{chequesStats.cash.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CARD}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                По карте: <strong>{chequesStats.card.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CARD_UZCARD}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Uzcard: <strong>{chequesStats.cardUzCard.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CARD_HUMO}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Humo: <strong>{chequesStats.cardHumo.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>

            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CARD_LOYALTY}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Лояльность: <strong>{chequesStats.cardLoyalty.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
            <WithPermission
              annotation={STA_CHEQUE_LIST_STAT_CARD_OTHER}
              placement={{ right: -10, top: 0, bottom: 0 }}
            >
              <div className="custom-content__stats__item">
                Другие: <strong>{chequesStats.cardOther.toLocaleString("ru")}</strong> сум
              </div>
            </WithPermission>
          </>}
          {chequesStatsLoading && <div className="abs-loader">
            <Spin />
          </div>}
        </div>

        <div className="filter-block">
          <WithPermission
            annotation={STA_CHEQUE_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                format={onlyDateFormat}
                value={[ $chequesListFilter.from ? moment($chequesListFilter.from) : null, $chequesListFilter.to ? moment($chequesListFilter.to).endOf("minute") : null ]}
                onChange={onDateChange}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={STA_CHEQUE_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangeTimePicker
                // defaultValue={moment('13:30:56', 'HH:mm:ss')}
                format={timeFormat}
                value={[ $chequesListFilter.from ? moment($chequesListFilter.from) : null, $chequesListFilter.to ? moment($chequesListFilter.to).endOf("minute") : null ]}
                onChange={onTimeChange}
                disabled={!$chequesListFilter.from || !$chequesListFilter.to}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={STA_CHEQUE_LIST_FILT_SEARCH}
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
                  allowClear
                />
              </div>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_COMPANY} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$chequesListFilter.companyId}
                placeholder='Компания'
                onSearch={onCompanySearch}
                onChange={(value) => onCompanyChange(value)}
                filterOption={false}
                defaultActiveFirstOption={false}
                allowClear
              >
                {$companyItems.data.content.map((item) => <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_BRANCH} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Филиал'
                value={$chequesListFilter.branchId}
                onChange={(value) => onBranchChange(value)}
                disabled={!$chequesListFilter.companyId}
                allowClear
              >
                {$branchItems.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_EMPLOYEE}
                          placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Сотрудник'
                value={$chequesListFilter.userId}
                onChange={(userId) => onFilterChange({ userId })}
                disabled={!$chequesListFilter.branchId}
                allowClear
              >
                {$usersItems.data.content.map((item) => <Option value={item.id} key={item.id}>
                  {item.fullName ? item.fullName.name : "-"}
                </Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_CHEQUE_TYPE} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Тип чека'
                value={$chequesListFilter.isFiscal}
                onChange={(isFiscal) => onFilterChange({ isFiscal })}
                allowClear
              >
                {chequeTypesItems.map((item) => <Option value={item.value} key={item.value}>{item.name}</Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_PRICE} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <InputNumber
                className="custom-input"
                placeholder="Цена от"
                min={0}
                onChange={(value) => onPriceChange("totalCostFrom", value)}
                formatter={formatNumber}
              />
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_LIST_FILT_PRICE} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <InputNumber
                className="custom-input"
                placeholder="Цена до"
                min={$chequesListFilter.totalCostFrom}
                onChange={(value) => onCostFromChange("totalCostTo", value)}
                formatter={formatNumber}
              />
            </div>
          </WithPermission>
          <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Способы оплаты'
                value={$chequesListFilter.paymentTypes}
                onChange={(paymentTypes) => { onFilterChange({ paymentTypes }) }}
                allowClear
              >
                {$paymentTypes.map((item) => <Option value={item} key={item}>{getPaymentTypeTitleForKeyword(item)}</Option>)}
              </Select>
            </div>
          <div className="filter-block__item no-width">
            <label className="filter-block__item-switch">
              <Switch checked={$chequesListFilter.es} onChange={(checked) => onFilterChange({ es: checked ? true : undefined })} />
              <div className="filter-block__item-switch__text">
                Быстрый поиск
              </div>
            </label>
          </div>
          <div className="filter-block__item filter-block__buttons">
            <Tooltip placement="bottom" title="Сбросить фильтр">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className='svg' icon={faTimes} />}
                onClick={onResetFilterProps}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Повторный запрос">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className='svg' icon={faUndo} />}
                onClick={onRefreshFilterProps}
              />
            </Tooltip>
          </div>
        </div>
        {chequesError && <div className="custom-content__error">
          <Alert message={chequesError.message} type="error" />
        </div>}
        <div className="custom-content__table u-fancy-scrollbar">
          <WithPermission annotation={STA_CHEQUE_DETAILS} showChecker={false}>
            <div className={cn("cheque-container", $chequeDetails.data ? "cheque-container_opened" : undefined)}>
              <span className="cheque-container__close-button" onClick={onCloseChequeDetailsClick}> X </span>
              <ChequeComponent
                isLoading={$chequeDetails.loading}
                cheque={$chequeDetails.data}
              />
            </div>
          </WithPermission>
          <Table
            dataSource={data}
            columns={columns}
            loading={chequesLoading}
            pagination={false}
          />
        </div>
        <div className="custom-pagination">
          <Pagination
            total={chequesTotal}
            pageSize={chequesSize}
            current={chequesPage + 1}
            hideOnSinglePage={true}
            pageSizeOptions={[ "20", "50", "100", "150", "250", "500" ]}
            onChange={onChangePagination}
          />
        </div>
      </div>
    </Card>
  );
};
