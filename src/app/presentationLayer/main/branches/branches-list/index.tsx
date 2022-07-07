import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import { Switch, Route } from "react-router-dom";
import moment from "moment";
import {
  MON_BRANCH_LIST_FILT_DATE,
  MON_BRANCH_LIST_FILT_COMPANY,
  MON_BRANCH_LIST_FILT_SEARCH,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import branchesEffector from "app/presentationLayer/effects/branches";
import commonEffector from "app/presentationLayer/effects/common";
import { Input, Tooltip, Button, Select, DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import { BranchesListMap } from "app/presentationLayer/main/branches/branches-list-map";
import { BranchesListData } from "app/presentationLayer/main/branches/branches-list-data";
import "./styles.scss";

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;


export const BranchesList = (props) => {
  const { match, location } = props;
  const $companyItems = useStore(commonEffector.stores.$companyItems);
  const $branchesList = useStore(branchesEffector.stores.$branchesList);
  const $branchesListFilter = useStore(branchesEffector.stores.$branchesListFilter);

  const { data: branchesData } = $branchesList;
  const { totalElements: branchesTotal  } = branchesData;

  const [ searchValue, setSearchValue ] = useState($branchesListFilter.search);

  useEffect(() => {
    commonEffector.effects.searchCompanyItemsEffect({});

    return () => {
      commonEffector.events.resetCompanyItemsEvent();
    }
  }, []);


  const onFilterChange = (fields) => {
    branchesEffector.events.updateBranchesListFilter({ ...$branchesListFilter, page: 0, ...fields });
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

  const onResetFilterProps = () => {
    setSearchValue("");
    branchesEffector.events.resetBranchesListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$branchesListFilter })
  };

  const isMap = location.pathname.indexOf("/map") > 0;

  console.log(isMap);

  return (
    <Card fullHeight={true} className="branches">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left">
            <div className="custom-content__header__left-inner">
              <h1>Филиалы</h1>
              <span>
              Кол-во: <strong>{branchesTotal.toLocaleString("ru")}</strong>
            </span>
            </div>
          </div>
          <div>
            {/*<Link to={isMap ? match.url : `${match.url}/map`} className="ant-btn ant-btn-primary">*/}
            {/*  {isMap ? "Список" : "Карта"}*/}
            {/*</Link>*/}
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={MON_BRANCH_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                format={dateFormat}
                value={[ $branchesListFilter.from ? moment($branchesListFilter.from) : null, $branchesListFilter.to ? moment($branchesListFilter.to).endOf("minute") : null ]}
                onChange={(_, dateStrings) => onFilterChange({
                  from: dateStrings[0] ? dateStrings[0] : undefined,
                  to: dateStrings[1] ? dateStrings[1] : undefined
                })}
              />
            </div>
          </WithPermission>
          <WithPermission annotation={MON_BRANCH_LIST_FILT_COMPANY} placement={{ right: 5, top: 0, bottom: 0 }}>
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$branchesListFilter.companyId}
                placeholder='Компания'
                onSearch={onCompanySearch}
                onChange={(companyId) => onFilterChange({ companyId })}
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
          <WithPermission
            annotation={MON_BRANCH_LIST_FILT_SEARCH}
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
        <Switch>
          <Route
            exact={true}
            path={match.url}
            render={(props) => <BranchesListData
              {...props}
              onFilterChange={onFilterChange}
            />}
          />
          <Route
            exact={true}
            path={`${match.url}/map`}
            component={BranchesListMap}
          />
        </Switch>
      </div>
    </Card>
  );
};
