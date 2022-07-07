import React, { useEffect, useState } from 'react';

import { useStore } from "effector-react";
import moment from "moment";
import {
  STA_CHEQUE_BY_BRANCH_LIST_FILT_ACTIVITY,
  STA_CHEQUE_BY_BRANCH_LIST_FILT_CITY,
  STA_CHEQUE_BY_BRANCH_LIST_FILT_COMPANY,
  STA_CHEQUE_BY_BRANCH_LIST_FILT_DATE,
  STA_CHEQUE_BY_BRANCH_LIST_FILT_REGION,
  STA_CHEQUE_BY_BRANCH_LIST_FILT_SEARCH,
  STA_CHEQUE_BY_BRANCH_LIST_STAT_BRANCH,
  STA_CHEQUE_BY_BRANCH_LIST_STAT_CHEQUE,
  STA_CHEQUE_BY_BRANCH_LIST_STAT_REVENUE,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import chequesEffector from "app/presentationLayer/effects/cheques";
import { Table, Input, Select, DatePicker, Pagination, Tooltip, Button, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { withSort } from "app/presentationLayer/th-with-sort";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";

const dateFormat = 'YYYY-MM-DD';
const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';
const { RangePicker } = DatePicker;
const { Option } = Select;

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from? moment(filter.from).startOf("day").format(reqDateFormat): undefined,
    to: filter.to? moment(filter.to).endOf("day").format(reqDateFormat): undefined,
  }
};

const ChequesByBranch = (props) => {
  const $chequesByBranchList = useStore(chequesEffector.stores.$chequesByBranchList);
  const $chequesByBranchListFilter = useStore(chequesEffector.stores.$chequesByBranchListFilter);
  const $chequesByBranchListSort = useStore(chequesEffector.stores.$chequesByBranchListSort);
  const $chequesByBranchStats = useStore(chequesEffector.stores.$chequesByBranchStats);
  const $companyItems = useStore(chequesEffector.stores.$companyItems);
  const $regionsItems = useStore(chequesEffector.stores.$regionsItems);
  const $citiesItems = useStore(chequesEffector.stores.$citiesItems);
  const $activityTypesItems = useStore(chequesEffector.stores.$activityTypesItems);

  const { data: chequesData, loading: chequesLoading, error: chequesError } = $chequesByBranchList;

  const {
    content: cheques,
    number: chequesPage,
    size: chequesSize,
    totalElements: chequesTotal
  } = chequesData;

  const [ searchValue, setSearchValue ] = useState($chequesByBranchListFilter.search);

  useEffect(() => {
    chequesEffector.effects.searchCompanyItemsEffect({});
    chequesEffector.effects.fetchRegionsItemsEffect();
    chequesEffector.effects.fetchActivityTypesItemsEffect();
  }, []);

  useEffect(() => {
    chequesEffector.effects.fetchChequesByBranchListEffect(formatFilterProps({ ...$chequesByBranchListFilter, ...$chequesByBranchListSort }));
  }, [$chequesByBranchListFilter, $chequesByBranchListSort]);

  useEffect(() => {
    chequesEffector.effects.fetchChequesByBranchStatsEffect(formatFilterProps($chequesByBranchListFilter));
  }, [$chequesByBranchListFilter]);

  const onFilterChange = (fields) => {
    chequesEffector.events.updateChequesByBranchListFilter({ ...$chequesByBranchListFilter, page: 0, ...fields });
  };

  const onSortChange = (fields) => {
    chequesEffector.events.updateChequesByBranchListSort({ ...$chequesByBranchListSort, ...fields });
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
        chequesEffector.effects.searchCompanyItemsEffect({ search, size: 100 });
      });
    }
  };

  const onCompanyChange = (companyId) => {
    onFilterChange({ companyId });
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
    if ($chequesByBranchListSort.orderBy && fieldName === $chequesByBranchListSort.orderBy) {
      onSortChange({ sortOrder: $chequesByBranchListSort.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({
        orderBy: fieldName,
        sortOrder: "asc"
      });
    }
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    chequesEffector.events.resetChequesByBranchListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$chequesByBranchListFilter })
  };

  const columns = [
    {
      title: "",
      dataIndex: 'num',
      width: 50,
    },
    {
      title: withSort("Компания", "companyName", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'companyName',
    },
    {
      title: withSort("Филиал", "branchName", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'branchName',
    },
    {
      title: withSort("Регион", "regionName", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'regionName',
    },
    {
      title: withSort("Город", "cityName", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'cityName',
    },
    {
      title: withSort("Деятельность", "activityType", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'activityType',
    },
    {
      title: withSort("Тип", "businessType", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'businessType',
    },
    {
      title: withSort((<div className="w-s-n">Кол-во чеков</div>), "receipts", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'receipts',
    },
    {
      title: withSort("Выручка", "revenue", $chequesByBranchListSort.orderBy, $chequesByBranchListSort.sortOrder, orderByChange),
      dataIndex: 'revenue',
    },
  ];

  const data = cheques.map((cheque, index) => ({
    id: cheque.id,
    key: cheque.id,
    num: (<div className="w-s-n">{(chequesSize * chequesPage) + index + 1}</div>),
    companyName: cheque.companyName,
    branchName: cheque.branchName,
    regionName: cheque.regionName,
    cityName: cheque.cityName,
    activityType: cheque.activityType || "-",
    businessType: cheque.businessType && cheque.businessType.nameRu ? cheque.businessType.nameRu : "-",
    receipts: (<div className="t-a-c">{cheque.receipts?.toLocaleString("ru")}</div>),
    revenue: (<div className="t-a-c">{cheque.revenue?.toLocaleString("ru")}</div>)
  }));

  return (
    <Card fullHeight={true}>
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Чеки по филиалам</h1>
            {$chequesByBranchStats.data && <>
              <WithPermission
                annotation={STA_CHEQUE_BY_BRANCH_LIST_STAT_BRANCH}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
                <span>
                  Кол-во филиалов: {$chequesByBranchStats.data.branchCount.toLocaleString("ru")}
                </span>
              </WithPermission>
              <WithPermission
                annotation={STA_CHEQUE_BY_BRANCH_LIST_STAT_CHEQUE}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
                <span>
                  Кол-во чеков: {($chequesByBranchStats.data.receiptCount || 0).toLocaleString("ru")}
                </span>
              </WithPermission>
              <WithPermission
                annotation={STA_CHEQUE_BY_BRANCH_LIST_STAT_REVENUE}
                placement={{ right: -10, top: 0, bottom: 0 }}
              >
                <span>
                  Выручка: {$chequesByBranchStats.data.revenueCount.toLocaleString("ru")} сум
                </span>
              </WithPermission>
            </>}
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                format={dateFormat}
                value={[ $chequesByBranchListFilter.from ? moment($chequesByBranchListFilter.from) : null, $chequesByBranchListFilter.to ? moment($chequesByBranchListFilter.to).endOf("minute") : null ]}
                onChange={(_, dateStrings) => onFilterChange({
                  from: dateStrings[0] ? dateStrings[0] : undefined,
                  to: dateStrings[1] ? dateStrings[1] : undefined
                })}
              />
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_SEARCH} placement={{ right: 5, top: 0, bottom: 0 }}>
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
          <WithPermission annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_COMPANY} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$chequesByBranchListFilter.companyId}
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
          <WithPermission annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_REGION} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Область'
                value={$chequesByBranchListFilter.regionId}
                onChange={onRegionChange}
                allowClear
              >
                {$regionsItems.data.map((item) => <Option value={item.id} key={item.id}>{item.nameRu}</Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_CITY} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Регион'
                value={$chequesByBranchListFilter.cityId}
                onChange={(cityId) => onFilterChange({ cityId })}
                disabled={!$chequesByBranchListFilter.regionId}
                allowClear
              >
                {$citiesItems.data.map((item) => <Option value={item.id} key={item.id}>{item.nameRu}</Option>)}
              </Select>
            </div>
          </WithPermission>
          <WithPermission annotation={STA_CHEQUE_BY_BRANCH_LIST_FILT_ACTIVITY} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder='Сфера деятельности'
                value={$chequesByBranchListFilter.activityTypeId}
                onChange={(activityTypeId) => onFilterChange({ activityTypeId })}
                allowClear
              >
                {$activityTypesItems.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
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
            current={ chequesPage + 1}
            hideOnSinglePage={true}
            pageSizeOptions={["20", "50", "100", "150", "250", "500" ]}
            onChange={onChangePagination}
          />
        </div>
      </div>
    </Card>
  );
};

export default ChequesByBranch;
