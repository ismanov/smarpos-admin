import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  MON_KKM_LIST_FILT_BRANCH,
  MON_KKM_LIST_FILT_COMPANY,
  MON_KKM_LIST_FILT_SEARCH,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import kkmEffector from "app/presentationLayer/effects/kkm";
import commonEffector from "app/presentationLayer/effects/common";
import { Input, Tooltip, Button, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import { KkmListTable } from "app/presentationLayer/main/kkm/kkm-list-table";
import { AddKKMModal } from "./../add-kkm-modal/index";

const { Option } = Select;

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Модель",
    dataIndex: "model",
  },
  {
    title: "Серийний номер",
    dataIndex: "serialNumber",
  },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Адрес филиала",
    dataIndex: "branchAddress",
  },
  {
    title: "Компания",
    dataIndex: "companyName",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];

export const KkmList = (props) => {
  const $companyItems = useStore(commonEffector.stores.$companyItems);
  const $branchItems = useStore(commonEffector.stores.$branchItems);
  const $createAndUpdateTerminalInfo = useStore(
    commonEffector.stores.$createAndUpdateTerminalInfo
  );
  const $kkmList = useStore(kkmEffector.stores.$kkmList);
  const $kkmListFilter = useStore(kkmEffector.stores.$kkmListFilter);

  const { data: kkmData } = $kkmList;
  const { totalElements: kkmTotal } = kkmData;

  const [searchValue, setSearchValue] = useState($kkmListFilter.search);
  const [addUserModalProps, setAddUserModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const getList = () => {
    kkmEffector.effects.fetchKkmListEffect($kkmListFilter);
  };

  useEffect(() => {
    getList();
  }, [$kkmListFilter]);

  useEffect(() => {
    commonEffector.effects.searchCompanyItemsEffect({});

    return () => {
      commonEffector.events.resetCompanyItemsEvent();
      commonEffector.events.resetBranchItemsEvent();
    };
  }, []);

  const onFilterChange = (fields) => {
    kkmEffector.events.updateKkmListFilter({
      ...$kkmListFilter,
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
  useEffect(() => {
    if ($createAndUpdateTerminalInfo.success) {
      onRefreshFilterProps();
    }
  }, [$createAndUpdateTerminalInfo.success]);

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
  const onAddUserClick = () => {
    setAddUserModalProps({ visible: true, shouldRender: true });
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    kkmEffector.events.resetKkmListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$kkmListFilter });
  };

  return (
    <Card fullHeight={true} className="kkm-by-companies">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>ККМ</h1>
            <span>
              Кол-во: <strong>{kkmTotal.toLocaleString("ru")}</strong>
            </span>
          </div>
          <Button
            onClick={() => {
              onAddUserClick();
            }}
            type="primary"
          >
            Добавить
          </Button>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={MON_KKM_LIST_FILT_COMPANY}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                showSearch
                className="custom-select"
                loading={$companyItems.loading}
                value={$kkmListFilter.companyId}
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
            annotation={MON_KKM_LIST_FILT_BRANCH}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$branchItems.loading}
                placeholder="Филиал"
                value={$kkmListFilter.branchId}
                onChange={(branchId) => onFilterChange({ branchId })}
                disabled={!$kkmListFilter.companyId}
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
            annotation={MON_KKM_LIST_FILT_SEARCH}
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
        <KkmListTable
          $kkmList={$kkmList}
          columns={columns}
          onFilterChange={onFilterChange}
          updateList={getList}
        />
      </div>
      {addUserModalProps.shouldRender && (
        <AddKKMModal
          modalProps={addUserModalProps}
          setModalProps={setAddUserModalProps}
          {...props}
        />
      )}
    </Card>
  );
};
