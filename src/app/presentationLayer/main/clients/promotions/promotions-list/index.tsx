import React, { useEffect, useState } from "react";
import { useStore } from 'effector-react'
import { Link } from "react-router-dom";
import { Select, Table, Input, DatePicker } from "antd";
import moment from "moment";

import Card from "app/presentationLayer/components/card";

import effector from "app/presentationLayer/effects/clients";
import promotionsEffector from "app/presentationLayer/effects/clients/promotions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  MON_COMPANY_DETAILS_PROMOTION_ADD,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import { withDebounce } from "app/utils/utils";
import { ACTIVE, CANCELLED, ENDED, PAUSED, PLANNED } from "app/presentationLayer/main/clients/promotions/constants";

const vatItems = [
  { name: "С НДС", value: "true" },
  { name: "Без НДС", value: "false" },
];

const statusItems = [
  { name: "Активна", code: ACTIVE },
  { name: "Запланирована", code: PLANNED },
  { name: "Завершена", code: ENDED },
  { name: "Приостановлена", code: PAUSED },
  { name: "Отменена", code: CANCELLED },
];

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';
const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: (<div className="w-s-n">Название акции</div>),
    dataIndex: 'name',
  },
  {
    title: (<div className="w-s-n">Сроки проведения</div>),
    dataIndex: 'date',
  },
  {
    title: (<div className="w-s-n">Хиты</div>),
    dataIndex: 'hits',
  },
  {
    title: (<div className="w-s-n">Статус</div>),
    dataIndex: 'status',
  },
  {
    title: '',
    dataIndex: 'actions',
  },
];

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from? moment(filter.from).startOf("day").format(reqDateFormat): undefined,
    to: filter.to? moment(filter.to).endOf("day").format(reqDateFormat): undefined,
  }
};

export const PromotionsList = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $promotionsList = useStore(promotionsEffector.stores.$promotionsList);
  const $promotionsListFilter = useStore(promotionsEffector.stores.$promotionsListFilter);
  const $promotionsStats = useStore(promotionsEffector.stores.$promotionsStats);
  const { data: promotionsData, loading: promotionsLoading } = $promotionsList;

  const {
    content: promotions,
    number: promotionsPage,
    size: promotionsSize,
    totalElements: promotionsTotal
  } = promotionsData;

  const [ searchValue, setSearchValue ] = useState($promotionsListFilter.search);

  useEffect(() => {
    if ($promotionsListFilter.branchId) {
      promotionsEffector.effects.fetchPromotionsListEffect(formatFilterProps({ companyId, ...$promotionsListFilter }));
      promotionsEffector.effects.fetchPromotionsStatsEffect(formatFilterProps({ companyId, ...$promotionsListFilter }));
    } else {
      promotionsEffector.events.resetPromotionsListEvent();
      promotionsEffector.events.resetPromotionsStatsEvent();
    }
  }, [ $promotionsListFilter ]);


  const onFilterChange = (fields) => {
    promotionsEffector.events.updatePromotionsListFilter({ ...$promotionsListFilter, page: 0, ...fields });
  };

  const onBranchChange = (branchId) => {
    onFilterChange({ branchId });
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

  const data = promotions.map((promotion, index) => ({
    id: promotion.id,
    key: promotion.id,
    num: (<div className="w-s-n">{(promotionsSize * promotionsPage) + index + 1}</div>),
    name: <Link to={`${match.url}/${promotion.id}`}>{promotion.name}</Link>,
    date: `с ${moment(promotion.dateFrom).format('DD-MM-YYYY')} до 
      ${promotion.dateTo ? moment(promotion.dateTo).format('DD-MM-YYYY'): "Бессрочно"}
    `,
    hits: promotion.hits.toLocaleString("ru"),
    status: promotion.status,
    actions: ""
  }));

  const dateFromValue = $promotionsListFilter.from ? moment($promotionsListFilter.from) : null;
  const dateToValue = $promotionsListFilter.to ? moment($promotionsListFilter.to) : null;

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Акции клиента</h1>
            {$promotionsStats.data && <>
              <span>
                Активные Акции: <strong>{$promotionsStats.data.activePromotions.toLocaleString("ru")}</strong>
              </span>
                <span>
                Проведённые акции: <strong>{$promotionsStats.data.finishedPromotions.toLocaleString("ru")}</strong>
              </span>
                <span>
                Количество хитов: <strong>{$promotionsStats.data.hitCount.toLocaleString("ru")}</strong>
              </span>
            </>}
          </div>
          <div>
            <WithPermission annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}>
              <Link to={`${match.url}/add`} className="ant-btn ant-btn-primary">Создать акцию</Link>
            </WithPermission>
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder='Выберите филиал'
              value={$promotionsListFilter.branchId}
              onChange={onBranchChange}
            >
              {$branchItems.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
            </Select>
          </div>
          <div className="filter-block__item">
            <DatePicker
              format={dateFormat}
              placeholder="Период про-я - от"
              className="custom-date-picker"
              value={dateFromValue}
              onChange={(_, value) => onFilterChange({ from: value ? value : undefined })}
              disabled={!$promotionsListFilter.branchId}
            />
          </div>
          <div className="filter-block__item">
            <DatePicker
              format={dateFormat}
              placeholder="Период про-я - до"
              className="custom-date-picker"
              value={dateToValue}
              onChange={(_, value) => onFilterChange({ to: value ? value : undefined })}
              disabled={!$promotionsListFilter.branchId}
            />
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
                disabled={!$promotionsListFilter.branchId}
                onChange={onSearchChange}
                allowClear
              />
            </div>
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder='НДС'
              value={$promotionsListFilter.includeVat}
              onChange={(includeVat) => onFilterChange({ includeVat })}
              disabled={!$promotionsListFilter.branchId}
              allowClear
            >
              {vatItems.map((item) => <Option value={item.value} key={item.value}>{item.name}</Option>)}
            </Select>
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder='Статус'
              value={$promotionsListFilter.status}
              onChange={(status) => onFilterChange({ status })}
              disabled={!$promotionsListFilter.branchId}
              allowClear
            >
              {statusItems.map((item) => <Option value={item.code} key={item.code}>{item.name}</Option>)}
            </Select>
          </div>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={promotionsLoading}
            pagination={{
              total: promotionsTotal,
              pageSize: promotionsSize,
              current: promotionsPage + 1,
              hideOnSinglePage: true,
              showSizeChanger: true,
              pageSizeOptions: [ "20", "50", "100", "150", "250", "500" ],
              onChange: onChangePagination,
            }}
          />
        </div>
      </div>
    </Card>
  );
};
