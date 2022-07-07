import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  STA_CHEQUE_BY_COMPANY_LIST_FILT_CITY,
  STA_CHEQUE_BY_COMPANY_LIST_FILT_DATE,
  STA_CHEQUE_BY_COMPANY_LIST_FILT_REGION,
  STA_CHEQUE_BY_COMPANY_LIST_FILT_SEARCH,
  STA_CHEQUE_BY_COMPANY_LIST_STAT_BRANCH,
  STA_CHEQUE_BY_COMPANY_LIST_STAT_CHEQUE,
  STA_CHEQUE_BY_COMPANY_LIST_STAT_REVENUE,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import chequesEffector from "app/presentationLayer/effects/cheques";
import { Table, Input, Select, DatePicker, Pagination, Tooltip, Button, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { withSort } from "app/presentationLayer/th-with-sort";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import "./styles.scss";

const dateFormat = 'YYYY-MM-DD';
const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';
const { RangePicker } = DatePicker;
const { Option } = Select;

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from ? moment(filter.from).startOf("day").format(reqDateFormat) : undefined,
    to: filter.to ? moment(filter.to).endOf("day").format(reqDateFormat) : undefined,
  }
};

export const ChequesByCompaniesList = (props) => {
  const $chequesByCompaniesList = useStore(chequesEffector.stores.$chequesByCompaniesList);
  const $chequesByCompaniesListFilter = useStore(chequesEffector.stores.$chequesByCompaniesListFilter);
  const $chequesByCompaniesListSort = useStore(chequesEffector.stores.$chequesByCompaniesListSort);
  const $chequesByCompaniesStats = useStore(chequesEffector.stores.$chequesByCompaniesStats);
  const $regionsItems = useStore(chequesEffector.stores.$regionsItems);
  const $citiesItems = useStore(chequesEffector.stores.$citiesItems);

  const { data: chequesData, loading: chequesLoading, error: chequesError } = $chequesByCompaniesList;

  const {
    content: cheques,
    number: chequesPage,
    size: chequesSize,
    totalElements: chequesTotal
  } = chequesData;

  const [ searchValue, setSearchValue ] = useState($chequesByCompaniesListFilter.search);

  useEffect(() => {
    chequesEffector.effects.fetchRegionsItemsEffect();
    chequesEffector.effects.fetchActivityTypesItemsEffect();
  }, []);

  useEffect(() => {
    chequesEffector.effects.fetchChequesByCompaniesListEffect(formatFilterProps({ ...$chequesByCompaniesListFilter, ...$chequesByCompaniesListSort }));
  }, [ $chequesByCompaniesListFilter, $chequesByCompaniesListSort ]);

  useEffect(() => {
    chequesEffector.effects.fetchChequesByCompaniesStatsEffect(formatFilterProps($chequesByCompaniesListFilter));
  }, [ $chequesByCompaniesListFilter ]);


  const onFilterChange = (fields) => {
    chequesEffector.events.updateChequesByCompaniesListFilter({ ...$chequesByCompaniesListFilter, page: 0, ...fields });
  };

  const onSortChange = (fields) => {
    chequesEffector.events.updateChequesByCompaniesListSort({ ...$chequesByCompaniesListSort, ...fields });
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

  const onRegionChange = (regionId) => {
    const fields: any = { regionId };
    if (regionId) {
      chequesEffector.effects.fetchCitiesItemsEffect(regionId);
    } else {
      chequesEffector.events.resetCitiesItemsEvent();
      fields.cityId = undefined;
    }

    onFilterChange(fields);
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const orderByChange = (fieldName) => {
    if ($chequesByCompaniesListSort.orderBy && fieldName === $chequesByCompaniesListSort.orderBy) {
      onSortChange({ sortOrder: $chequesByCompaniesListSort.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({
        orderBy: fieldName,
        sortOrder: "asc"
      });
    }
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    chequesEffector.events.resetChequesByCompaniesListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$chequesByCompaniesListFilter })
  };

  const columns = [
    {
      title: "",
      dataIndex: 'num',
      width: 50,
    },
    {
      title: withSort("Компания", "companyName", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'companyName',
    },
    {
      title: withSort("Кол-во филиалов", "branchCount", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'branchCount',
    },
    {
      title: withSort("Регион", "regionName", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'regionName',
    },
    {
      title: withSort("Город", "cityName", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'cityName',
    },
    {
      title: withSort("Деятельность", "activityType", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'activityType',
    },
    {
      title: withSort((<div className="w-s-n">Кол-во чеков</div>), "receipts",
        $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'receipts',
    },
    {
      title: withSort("Выручка", "revenue", $chequesByCompaniesListSort.orderBy, $chequesByCompaniesListSort.sortOrder, orderByChange),
      dataIndex: 'revenue',
    },
    {
      title: "Статистика",
      dataIndex: 'links',
    },
  ];

  const data = cheques.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: (<div className="w-s-n">{(chequesSize * chequesPage) + index + 1}</div>),
    companyName: <Link to={`/main/monitoring/companies/details/${item.id}`}>{item.companyName}</Link>,
    branchCount: (<div className="t-a-c">{item.branchCount.toLocaleString("ru")}</div>),
    regionName: item.regionName,
    cityName: item.cityName,
    activityType: item.activityType || "-",
    receipts: (<div className="t-a-c">{item.receipts?.toLocaleString("ru")}</div>),
    revenue: (<div className="t-a-c">{item.revenue?.toLocaleString("ru")}</div>),
    links: (<div>
      {process.env.DEV_SERVER && <Link to={`${location.pathname}/statistics/${item.id}`} className="ant-btn ant-btn-primary">Статистика по компании</Link>}
      {process.env.DEV_SERVER && <div className="btn-margin">
        <Link to={`${location.pathname}/statistics-by-branches/${item.id}`} className="ant-btn">
          Статистика по филиалам
        </Link>
      </div>}
    </div>)
  }));

  return (
    <Card fullHeight={true} className="cheques-by-companies">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Чеки по Компаниям</h1>
            {$chequesByCompaniesStats.data && <>
              <WithPermission
                annotation={STA_CHEQUE_BY_COMPANY_LIST_STAT_BRANCH}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
              <span>
                Кол-во компаний: {$chequesByCompaniesStats.data.companyCount.toLocaleString("ru")}
              </span>
              </WithPermission>
              <WithPermission
                annotation={STA_CHEQUE_BY_COMPANY_LIST_STAT_CHEQUE}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
              <span>
                  Кол-во чеков: {($chequesByCompaniesStats.data.receiptCount || 0).toLocaleString("ru")}
              </span>
              </WithPermission>
              <WithPermission
                annotation={STA_CHEQUE_BY_COMPANY_LIST_STAT_REVENUE}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
              <span>
                Выручка: {$chequesByCompaniesStats.data.revenueCount.toLocaleString("ru")} сум
              </span>
              </WithPermission>
            </>}
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={STA_CHEQUE_BY_COMPANY_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                format={dateFormat}
                value={[ $chequesByCompaniesListFilter.from ? moment($chequesByCompaniesListFilter.from) : null, $chequesByCompaniesListFilter.to ? moment($chequesByCompaniesListFilter.to).endOf("minute") : null ]}
                onChange={(_, dateStrings) => onFilterChange({
                  from: dateStrings[0] ? dateStrings[0] : undefined,
                  to: dateStrings[1] ? dateStrings[1] : undefined
                })}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={STA_CHEQUE_BY_COMPANY_LIST_FILT_SEARCH}
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
          <WithPermission
            annotation={STA_CHEQUE_BY_COMPANY_LIST_FILT_REGION}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Область'
                value={$chequesByCompaniesListFilter.regionId}
                onChange={onRegionChange}
                allowClear
              >
                {$regionsItems.data.map((item) => <Option value={item.id} key={item.id}>{item.nameRu}</Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission
            annotation={STA_CHEQUE_BY_COMPANY_LIST_FILT_CITY}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Регион'
                value={$chequesByCompaniesListFilter.cityId}
                onChange={(cityId) => onFilterChange({ cityId })}
                disabled={!$chequesByCompaniesListFilter.regionId}
                allowClear
              >
                {$citiesItems.data.map((item) => <Option value={item.id} key={item.id}>{item.nameRu}</Option>)}
              </Select>
            </div>
          </WithPermission>
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
