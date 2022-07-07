import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import {
  Select,
  Table,
  Input,
  Button,
  Popover,
  Popconfirm,
  Tooltip,
} from "antd";
import moment from "moment";
import Card from "app/presentationLayer/components/card";
import agreementsEffector from "app/presentationLayer/effects/allAgreements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import { ServicePrice } from "app/presentationLayer/main/clients/agreements/components/service-price";
import { DotsVerticalSvg } from "assets/svg";
import { Status } from "app/presentationLayer/components/status";
import {
  getAgreementRecurring,
  getAgreementTariff,
  getStatusColor,
} from "app/presentationLayer/main/clients/agreements/helper";
import commonEffector from "app/presentationLayer/effects/common";
import { withDebounce } from "app/utils/utils";
import Repository from "app/businessLogicLayer/repo";
import { faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;
const reqDateFormat = "YYYY-MM-DDTHH:mm:ss";
const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: <div className="w-s-n">Номер</div>,
    dataIndex: "agreementNumber",
  },
  {
    title: <div className="w-s-n">Услуга</div>,
    dataIndex: "serviceType",
  },
  {
    title: <div className="w-s-n">Компания</div>,
    dataIndex: "company",
    width: "20%",
  },
  {
    title: <div className="w-s-n">Тариф</div>,
    dataIndex: "tariff",
  },
  {
    title: <div className="w-s-n">Тип услуги</div>,
    dataIndex: "recurring",
  },
  {
    title: "Стоимость",
    dataIndex: "price",
  },
  {
    title: <div className="w-s-n">Дата активации</div>,
    dataIndex: "firstActivatedDate",
  },
  {
    title: <div className="w-s-n">Следующий платеж</div>,
    dataIndex: "nextPeriodStart",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from
      ? moment(filter.from)
          .startOf("day")
          .format(reqDateFormat)
      : undefined,
    to: filter.to
      ? moment(filter.to)
          .endOf("day")
          .format(reqDateFormat)
      : undefined,
  };
};

type filterType = {
  status: string | null;
  search: string;
  recurring: null | boolean;
  serviceType: null | string;
  companyInn: null | string;
};
const initialState: filterType = {
  status: null,
  search: "",
  recurring: null,
  serviceType: null,
  companyInn: null,
};

function reducer(state: filterType, action: any) {
  switch (action.type) {
    case "STATUS":
      return { ...state, status: action.payload };
    case "SERVICE_TYPE":
      return { ...state, serviceType: action.payload };
    case "RECURRING":
      return { ...state, recurring: action.payload };
    case "SEARCH":
      return { ...state, search: action.payload };
    case "COMPANY":
      return { ...state, companyInn: action.payload };
    case "RESET":
      return initialState;
    default:
      return { ...state };
  }
}

const AgreementsList = (props) => {
  const $agreementsList = useStore(agreementsEffector.stores.$agreementsList);
  const $servicesTypes = useStore(agreementsEffector.stores.$servicesTypes);
  const $agreementStatuses = useStore(
    agreementsEffector.stores.$agreementStatuses
  );

  const $companyItems = useStore(commonEffector.stores.$companyItems);

  const $activateAgreement = useStore(
    agreementsEffector.stores.$activateAgreement
  );
  const $pauseAgreement = useStore(agreementsEffector.stores.$pauseAgreement);
  const $cancelAgreement = useStore(agreementsEffector.stores.$cancelAgreement);

  const { loading: agreementsLoading } = $agreementsList;

  //const [searchValue, setSearchValue] = useState($agreementsListFilter.search);
  const [companyId] = useState<any>("");
  const [onFilter, setOnFilter] = useState<boolean>(false);
  const [filterItems, dispatch] = useReducer(reducer, initialState);
  const [navigateLoading, setNavigateLoading] = useState<boolean>(false);

  const agreements = useMemo(
    () =>
      $agreementsList.data.filter(
        (item) =>
          (!filterItems.companyInn ||
            item?.customer?.inn === filterItems.companyInn) &&
          (!filterItems.serviceType ||
            item?.serviceType.code === filterItems.serviceType) &&
          (!filterItems.status || item?.status?.code === filterItems.status) &&
          (filterItems?.recurring === null ||
            item?.xizmat?.recurring === !!filterItems.recurring) &&
          item?.agreementNumber
            .toLowerCase()
            .includes(filterItems.search.toLowerCase())
      ),
    [$agreementsList.data, onFilter]
  );

  const servicesFilterData = useMemo(
    () =>
      ($agreementsList.data || []).reduce(
        (acc, item) => {
          if (!acc?.codes.includes(item?.serviceType.code)) {
            return {
              items: [...acc.items, item],
              codes: [...acc.codes, item.serviceType.code],
            };
          }
          return { ...acc };
        },
        { items: [], codes: [] }
      ),
    [$agreementsList.data]
  );

  const statusFilterData = useMemo(
    () =>
      ($agreementsList.data || []).reduce(
        (acc, item) => {
          if (!acc?.codes.includes(item?.status?.code)) {
            return {
              items: [...acc.items, item],
              codes: [...acc.codes, item.status?.code],
            };
          }
          return { ...acc };
        },
        { items: [], codes: [] }
      ),
    [$agreementsList.data]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setOnFilter((prev) => !prev);
    }, 500);
    return () => clearTimeout(id);
  }, [filterItems]);

  // useEffect(() => {
  //   agreementsEffector.effects.fetchServicesTypes({});
  //   agreementsEffector.effects.fetchAgreementStatuses({});
  // }, []);

  const getList = () => {
    companyId
      ? agreementsEffector.effects.fetchAgreementsList(
          formatFilterProps({ companyId })
        )
      : agreementsEffector.effects.fetchAgreementsList(formatFilterProps({}));
  };

  useEffect(() => {
    getList();
    // agreementsEffector.effects.fetchAgreementsStats(formatFilterProps({ companyId, ...$agreementsListFilter }));
  }, [companyId]);

  useEffect(() => {
    if ($activateAgreement.success) {
      getList();
      agreementsEffector.events.resetActivateAgreement();
    }

    if ($pauseAgreement.success) {
      getList();
      agreementsEffector.events.resetPauseAgreement();
    }

    if ($cancelAgreement.success) {
      getList();
      agreementsEffector.events.resetCancelAgreement();
    }
  }, [
    $activateAgreement.success,
    $pauseAgreement.success,
    $cancelAgreement.success,
  ]);

  // const onFilterChange = (fields) => {
  //   agreementsEffector.events.updateAgreementsListFilter({
  //     ...$agreementsListFilter,
  //     page: 0,
  //     ...fields,
  //   });
  // };

  // const onSearchChange = (e) => {
  //   const search = e.target.value;
  //   setSearchValue(search);

  //   withDebounce(() => {
  //     onFilterChange({
  //       search,
  //     });
  //   });
  // };

  const onCompanySearch = (search) => {
    if (search.length > 2 || search.length == 0) {
      withDebounce(() => {
        commonEffector.effects.searchCompanyItemsEffect({ search, size: 100 });
      });
    }
  };

  const data = agreements.map((item, index) => {
    return {
      id: item.id,
      key: item.id,
      num: <div className="w-s-n">{index + 1}</div>,
      agreementNumber: (
        <div className="w-s-n">
          <Link
            onClick={async (e) => {
              e.preventDefault();
              setNavigateLoading(true);
              Repository.owner
                .fetchOwners({ search: item.customer?.inn })
                .then(async (res) => {
                  const company = res?.content;
                  if (company?.length === 1) {
                    const cData = {
                      id: company[0].id,
                      phone: company[0].phone,
                    };
                    await sessionStorage.setItem(
                      "cData",
                      JSON.stringify(cData)
                    );
                    window.location.pathname = `/main/monitoring/companies/details/${company[0].id}/agreements/${item.id}`;
                  }
                })
                .catch((err) => console.log(err))
                .finally(() => {
                  setTimeout(() => {
                    setNavigateLoading(false);
                  }, 1000);
                });
            }}
            to={"/"}
          >
            {item.agreementNumber}
          </Link>
        </div>
      ),
      serviceType: item.serviceType && item.serviceType.nameRu,
      company: item.customer && item.customer.name,
      tariff: getAgreementTariff(item),
      recurring: getAgreementRecurring(item),
      price: <ServicePrice agreement={item} />,
      firstActivatedDate: item.firstActivatedDate
        ? moment(item.firstActivatedDate).format("DD.MM.YYYY")
        : "-",
      nextPeriodStart: item.nextPeriodStart
        ? moment(item.nextPeriodStart).format("DD.MM.YYYY")
        : "-",
      status: item.status && (
        <Status color={getStatusColor(item.status?.code)}>
          {item.status?.nameRu}
        </Status>
      ),
      actions: (
        <Popover
          overlayClassName="custom__popover"
          placement="bottomRight"
          trigger="click"
          content={
            <div>
              {item.xizmat &&
                item.xizmat.recuring &&
                item.status.code === agreementStatuses.PAUSE && (
                  <WithPermission
                    annotation={"TEST"}
                    render={(permissionProps) => (
                      <div className="custom__popover__item">
                        <Popconfirm
                          placement="topRight"
                          title="Вы действительно хотите включить услугу?"
                          onConfirm={() =>
                            agreementsEffector.effects.activateAgreement(
                              item.id
                            )
                          }
                        >
                          <Button
                            loading={$activateAgreement.loading}
                            {...permissionProps}
                          >
                            Включить
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  />
                )}
              {item.xizmat &&
                item.xizmat.recuring &&
                item.status?.code === agreementStatuses.ACTIVE && (
                  <WithPermission
                    annotation={"TEST"}
                    render={(permissionProps) => (
                      <div className="custom__popover__item">
                        <Popconfirm
                          placement="topRight"
                          title="Вы действительно хотите поставить на паузу?"
                          onConfirm={() =>
                            agreementsEffector.effects.pauseAgreement(item.id)
                          }
                        >
                          <Button
                            loading={$pauseAgreement.loading}
                            {...permissionProps}
                          >
                            Поставить на паузу
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  />
                )}
              <WithPermission
                annotation={"TEST"}
                render={(permissionProps) => (
                  <div className="custom__popover__item">
                    <Popconfirm
                      placement="topRight"
                      title="Вы действительно хотите отменить подписку?"
                      onConfirm={() =>
                        agreementsEffector.effects.cancelAgreement(item.id)
                      }
                      disabled={
                        item.status?.code === agreementStatuses.INACTIVE
                      }
                    >
                      <Button
                        loading={$cancelAgreement.loading}
                        type="primary"
                        danger
                        disabled={
                          item.status?.code === agreementStatuses.INACTIVE
                        }
                        {...permissionProps}
                      >
                        Отменить
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
    };
  });

  return (
    <Card className="agreements-list">
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Услуги</h1>
          </div>
          <div className="custom-content__header__right"></div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              showSearch
              className="custom-select"
              loading={$companyItems.loading}
              placeholder="Компания"
              value={filterItems.companyInn}
              onSearch={onCompanySearch}
              onChange={(value) => {
                dispatch({ type: "COMPANY", payload: value });
              }}
              filterOption={false}
              defaultActiveFirstOption={false}
              allowClear
            >
              {$companyItems.data.content.map((item) => (
                <Option value={item.inn} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$servicesTypes.loading}
              placeholder="Выберите услугу"
              value={filterItems.serviceType}
              onChange={(serviceType) =>
                dispatch({ type: "SERVICE_TYPE", payload: serviceType })
              }
            >
              {(servicesFilterData.items || []).map((item) => (
                <Option value={item?.serviceType.code} key={item.id}>
                  {item?.serviceType.nameRu}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              placeholder="Выберите тип услуги"
              value={filterItems.recurring}
              onChange={(recurring) =>
                dispatch({ type: "RECURRING", payload: recurring })
              }
            >
              {tariffRecurringItems.map((item, index) => (
                <Option value={item.code} key={index}>
                  {item?.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$agreementStatuses.loading}
              placeholder="Выберите статус"
              value={filterItems.status}
              onChange={(status) =>
                dispatch({ type: "STATUS", payload: status })
              }
            >
              {(statusFilterData?.items || [])
                .filter((item) => item?.status?.code)
                .map((item) => (
                  <Option value={item.status?.code} key={item.status?.code}>
                    {item?.status?.nameRu}
                  </Option>
                ))}
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
                value={filterItems.search}
                onChange={(e) => {
                  dispatch({ type: "SEARCH", payload: e.target.value });
                }}
                allowClear
              />
            </div>
          </div>
          <div className="filter-block__item filter-block__buttons">
            <Tooltip placement="bottom" title="Сбросить фильтр">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className="svg" icon={faTimes} />}
                onClick={() => dispatch({ type: "RESET" })}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Повторный запрос">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className="svg" icon={faUndo} />}
                onClick={getList}
              />
            </Tooltip>
          </div>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={agreementsLoading || navigateLoading}
            pagination={false}
          />
        </div>
      </div>
    </Card>
  );
};
export default AgreementsList;

const agreementStatuses = {
  ACCEPTED: "ACCEPTED",
  ACTIVE: "ACTIVE",
  PAUSE: "PAUSE",
  INACTIVE: "INACTIVE",
};

const tariffRecurringItems = [
  { name: "Разовый", code: 0 },
  { name: "Повторяющийся", code: 1 },
];
