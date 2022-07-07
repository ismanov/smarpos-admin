import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Select, Table, Input, Button, Spin, Popover, Popconfirm } from "antd";
import moment from "moment";

import Card from "app/presentationLayer/components/card";

import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { agreementStatuses, tariffRecurringItems } from "../../constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { MON_COMPANY_DETAILS_PROMOTION_ADD } from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
//import { withDebounce } from "app/utils/utils";
import { ServicePrice } from "app/presentationLayer/main/clients/agreements/components/service-price";
import { DotsVerticalSvg } from "assets/svg";
import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";
import { Status } from "app/presentationLayer/components/status";
import {
  getAgreementRecurring,
  getAgreementTariff,
  getStatusColor,
} from "app/presentationLayer/main/clients/agreements/helper";
import "./styles.scss";

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

const initialState: {
  status: string | null;
  search: string;
  recurring: null | boolean;
  serviceType: null | string;
} = { status: null, search: "", recurring: null, serviceType: null };

function reducer(state, action) {
  switch (action.type) {
    case "STATUS":
      return { ...state, status: action.payload };
    case "SERVICE_TYPE":
      return { ...state, serviceType: action.payload };
    case "RECURRING":
      return { ...state, recurring: action.payload };
    case "SEARCH":
      return { ...state, search: action.payload };
    default:
      state.slice();
  }
}

export const AgreementsList = (props) => {
  const { tin, match, history } = props;
  const companyId = match.params.companyId;

  const $agreementsList = useStore(agreementsEffector.stores.$agreementsList);
  const $agreementsListFilter = useStore(
    agreementsEffector.stores.$agreementsListFilter
  );
  const $customerBalance = useStore(agreementsEffector.stores.$customerBalance);
  const $servicesTypes = useStore(agreementsEffector.stores.$servicesTypes);
  const $agreementStatuses = useStore(
    agreementsEffector.stores.$agreementStatuses
  );

  const $activateAgreement = useStore(
    agreementsEffector.stores.$activateAgreement
  );
  const $pauseAgreement = useStore(agreementsEffector.stores.$pauseAgreement);
  const $cancelAgreement = useStore(agreementsEffector.stores.$cancelAgreement);

  const { loading: agreementsLoading } = $agreementsList;

  // const [searchValue, setSearchValue] = useState($agreementsListFilter.search);
  const [onFilter, setOnFilter] = useState<boolean>(false);
  const [filterItems, dispatch] = useReducer(reducer, initialState);
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
  const agreements = useMemo(
    () =>
      $agreementsList.data.filter(
        (item) =>
          (!filterItems.serviceType ||
            item?.serviceType.code === filterItems.serviceType) &&
          (!filterItems.status || item?.status.code === filterItems.status) &&
          (filterItems?.recurring === null ||
            String(item?.xizmat?.recurring) === filterItems?.recurring) &&
          item?.agreementNumber
            .toLowerCase()
            .includes(filterItems.search.toLowerCase())
      ),
    [$agreementsList.data, onFilter]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setOnFilter((prev) => !prev);
    }, 500);
    return () => clearTimeout(id);
  }, [filterItems]);

  const statusFilterData = useMemo(
    () =>
      ($agreementsList.data || []).reduce(
        (acc, item) => {
          if (!acc.codes.includes(item?.status.code)) {
            return {
              items: [...acc.items, item],
              codes: [...acc.codes, item.status.code],
            };
          }
          return { ...acc };
        },
        { items: [], codes: [] }
      ),
    [$agreementsList.data]
  );
  useEffect(() => {
    agreementsEffector.effects.fetchServicesTypes({});
    agreementsEffector.effects.fetchAgreementStatuses({});
    setOnFilter((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log(filterItems);
  }, [filterItems]);

  const getList = () => {
    agreementsEffector.effects.fetchAgreementsList(
      formatFilterProps({ tin, ...$agreementsListFilter })
    );
  };

  useEffect(() => {
    getList();
    // agreementsEffector.effects.fetchAgreementsStats(formatFilterProps({ companyId, ...$agreementsListFilter }));
  }, [companyId, $agreementsListFilter]);

  useEffect(() => {
    agreementsEffector.effects.fetchCustomerBalance(tin);
  }, [tin]);

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

  const data = agreements.map((item, index) => {
    return {
      id: item.id,
      key: item.id,
      num: <div className="w-s-n">{index + 1}</div>,
      agreementNumber: (
        <div className="w-s-n">
          <Link to={`${match.url}/${item.id}`}>{item.agreementNumber}</Link>
        </div>
      ),
      serviceType: item.serviceType && item.serviceType.nameRu,
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
        <Status color={getStatusColor(item.status.code)}>
          {item.status.nameRu}
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
                item.status.code === agreementStatuses.ACTIVE && (
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
                      disabled={item.status.code === agreementStatuses.INACTIVE}
                    >
                      <Button
                        loading={$cancelAgreement.loading}
                        type="primary"
                        danger
                        disabled={
                          item.status.code === agreementStatuses.INACTIVE
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
            {/*{$servicesStats.data && <>*/}
            {/*  <span>*/}
            {/*    Активные Акции: <strong>{$servicesStats.data.activeServices.toLocaleString("ru")}</strong>*/}
            {/*  </span>*/}
            {/*    <span>*/}
            {/*    Проведённые акции: <strong>{$servicesStats.data.finishedServices.toLocaleString("ru")}</strong>*/}
            {/*  </span>*/}
            {/*    <span>*/}
            {/*    Количество хитов: <strong>{$servicesStats.data.hitCount.toLocaleString("ru")}</strong>*/}
            {/*  </span>*/}
            {/*</>}*/}
          </div>
          <div className="custom-content__header__right">
            <div className="customer-balance">
              <div>
                Баланс:{" "}
                {$customerBalance.data && (
                  <Link to={match.url.split("agreements")[0] + "payment"}>
                    <PriceWrapper price={$customerBalance.data} />
                  </Link>
                )}
              </div>
              {$customerBalance.loading && (
                <div className="abs-loader">
                  <Spin />
                </div>
              )}
            </div>
            <WithPermission annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}>
              <Button
                type="primary"
                onClick={() => history.push(`${match.url}/add`)}
              >
                Добавить услугу
              </Button>
            </WithPermission>
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$servicesTypes.loading}
              placeholder="Выберите услугу"
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
              value={$agreementsListFilter.recurring}
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
              onChange={(status) =>
                dispatch({ type: "STATUS", payload: status })
              }
            >
              {(statusFilterData?.items || []).map((item) => (
                <Option value={item.status.code} key={item.status.code}>
                  {item?.status.nameRu}
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
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={agreementsLoading}
            pagination={false}
          />
        </div>
      </div>
    </Card>
  );
};
