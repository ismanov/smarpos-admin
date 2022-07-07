import React, { useEffect, useState } from "react";

import { useStore } from "effector-react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  MON_COMPANY_LIST_FILT_DATE,
  MON_COMPANY_LIST_FILT_SEARCH,
  MON_COMPANY_LIST_FILT_ACTIVITY,
  MON_COMPANY_LIST_FILT_BUSINESS,
  MON_COMPANY_DETAILS_DATA_ENTRY,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import effector from "app/presentationLayer/effects/clients";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Pagination,
  Button,
  Tooltip,
  Alert,
  Modal,
  InputNumber,
  notification,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUndo,
  faTimes,
  faEthernet,
} from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import CurrentUserStore from "app/presentationLayer/effects/main";
import ConfirmModal from "./checkUser/ConfirmModal";

const dateFormat = "YYYY-MM-DD";
const reqDateFormat = "YYYY-MM-DDTHH:mm:ss";
const { RangePicker } = DatePicker;

const { Option } = Select;

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

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "",
    dataIndex: "actions",
  },
  {
    title: "Название компании",
    dataIndex: "name",
  },
  {
    title: "ИНН",
    dataIndex: "tin",
  },
  {
    title: <div className="w-s-n">Дата создания</div>,
    dataIndex: "date",
  },
  {
    title: <div className="w-s-n">Номер телефона</div>,
    dataIndex: "phone",
  },
  {
    title: "НДС,%",
    dataIndex: "vat",
  },
  {
    title: "Адрес",
    dataIndex: "address",
  },
];

export const ClientsList = (props) => {
  const { match, history } = props;

  const $clientsList = useStore(effector.stores.$clientsList);
  const $clientsListFilter = useStore(effector.stores.$clientsListFilter);
  const $activityTypesItems = useStore(effector.stores.$activityTypesItems);
  const $businessTypesItems = useStore(effector.stores.$businessTypesItems);

  const {
    data: clientsData,
    loading: clientsLoading,
    error: clientsError,
    requestError,
    requestSend,
  } = $clientsList;

  const {
    content: clients,
    number: clientsPage,
    size: clientsSize,
    totalElements: clientsTotal,
  } = clientsData;

  const [step, setStep] = useState<number>(1);
  const [company, setCompany] = useState<any>(null);
  const [searchValue, setSearchValue] = useState($clientsListFilter.search);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
  const [companyInnMode, setCompanyInnMode] = useState(true);
  const [refCompanyInn, setRefCompanyInn] = useState<number | undefined>();
  const [accessCode, setAccessCode] = useState<number | undefined>();
  const $currentUser = useStore(CurrentUserStore.stores.$currentUser);
  const isAdmin = $currentUser?.data?.authorities?.includes(
    "ROLE_SMARTPOS_ADMIN"
  );
  const isOperator = $currentUser?.data?.authorities?.includes("ROLE_OPERATOR");

  useEffect(() => {
    effector.effects.fetchActivityTypesItemsEffect();
    effector.effects.fetchBusinessTypesItemsEffect();
    return onResetFilterProps;
  }, []);

  useEffect(() => {
    if (isContentManager()) {
      effector.effects.fetchClientsListForContentManagerEffect(
        formatFilterProps($clientsListFilter)
      );
    } else {
      effector.effects.fetchClientsListEffect(
        formatFilterProps($clientsListFilter)
      );
    }
  }, [$clientsListFilter]);

  useEffect(() => {
    if (requestError) {
      notification.warn({
        message: "Ошибка",
        description: JSON.stringify(requestError),
        duration: 3,
      });
    }
    if (requestSend === true) {
      setCompanyInnMode(false);
    }
  }, [$clientsList]);

  const isContentManager = () => {
    return (
      $currentUser &&
      $currentUser.data &&
      $currentUser.data.authorities.indexOf("ROLE_CONTENT_MANAGER") >= 0
    );
  };

  const onFilterChange = (fields) => {
    effector.events.updateClientsListFilter({
      ...$clientsListFilter,
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

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    effector.events.resetClientsListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$clientsListFilter });
  };

  const onRefToCompany = () => {
    setIsModalVisible(true);
  };

  const onOkRefModal = () => {
    if (companyInnMode) {
      if (!refCompanyInn) {
        notification.warn({
          message: "Ошибка валидации",
          description: "Введите ИНН компании",
          duration: 3,
        });
        return;
      }
      effector.effects.postAccessKey(`${refCompanyInn}`);
    } else {
      if (!refCompanyInn) {
        notification.warn({
          message: "Ошибка валидации",
          description: "Введите ИНН компании",
          duration: 3,
        });
        return;
      }
      if (!accessCode) {
        notification.warn({
          message: "Ошибка валидации",
          description: "Введите код подтверждения",
          duration: 3,
        });
        return;
      }
      effector.effects.sendAccessKey({
        inn: `${refCompanyInn}`,
        key: `${accessCode}`,
        filter: $clientsListFilter,
      });
      setIsModalVisible(false);
    }
  };
  const onCancelRefModal = () => {
    setRefCompanyInn(undefined);
    setAccessCode(undefined);
    setCompanyInnMode(true);
    setIsModalVisible(false);
    effector.events.resetRequestError();
  };

  useEffect(() => {
    if (clients.length === 1 && !isAdmin && isOperator) {
      const item = clients[0];
      const cData = {
        id: item.id,
        phone: item.phone,
      };
      sessionStorage.setItem("cData", JSON.stringify(cData));
      await sessionStorage.setItem("COMPANY_ID", String(item.id));
      history.push(`${match.url}/details/${item.id}`);
      setCompany(item);
    }
  }, [clients]);

  const data = clients.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: (
      <div className="w-s-n">
        {(clientsSize * clientsPage + index + 1).toLocaleString("ru")}
      </div>
    ),
    name: (
      <Link
        onClick={async (e) => {
          e.preventDefault();
          const cData = {
            id: item.id,
            phone: item.phone,
          };
          sessionStorage.setItem("cData", JSON.stringify(cData));
          sessionStorage.setItem("COMPANY_ID", String(item.id));
          history.push(`${match.url}/details/${item.id}`);
          setCompany(item);
        }}
        to={match.url}
      >
        {item.name}
      </Link>
    ),
    tin: isAdmin ? item.inn || "-" : "-",
    date: isAdmin ? (
      <div className="w-s-n">{moment(item.createdDate).format(dateFormat)}</div>
    ) : (
      "-"
    ),
    phone: isAdmin ? <div className="w-s-n">{item.phone}</div> : "-",
    vat: isAdmin ? item.ndsPercent || "-" : "-",
    address: isAdmin
      ? `${item.region ? item.region.nameRu : ""} ${
          item.city ? item.city.nameRu : ""
        } ${item.address || ""}`
      : "-",
  }));

  return (
    <Card className="clients" fullHeight={true}>
      <Modal
        title="Привязать к компании"
        visible={isModalVisible}
        onOk={onOkRefModal}
        onCancel={onCancelRefModal}
        okText={
          companyInnMode ? "Отправить запрос" : "Подтвердить код активации"
        }
      >
        <div className="modal modal_content">
          <InputNumber
            placeholder="ИНН"
            value={refCompanyInn}
            onChange={(e) => {
              setRefCompanyInn(e !== undefined ? (e as number) : undefined);
            }}
            style={{ width: "100%" }}
          />
          {companyInnMode ? null : (
            <InputNumber
              placeholder="Код активации"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e !== undefined ? (e as number) : undefined);
              }}
              style={{ width: "100%", marginTop: 15 }}
            />
          )}
          <div className="t-a-r" style={{ margin: "10px 10px 10px 0" }}>
            <span
              className="modal_link"
              onClick={() => {
                setCompanyInnMode(!companyInnMode);
              }}
            >
              {companyInnMode ? "Ввести код активации" : "Ввести ИНН компании"}
            </span>
          </div>
        </div>
      </Modal>
      <ConfirmModal
        options={{
          title: "",
          centered: true,
          width: 600,
          footer: null,
          maskStyle: { background: "rgba(255,255,255,0.9)" },
          visible: isCheckModalVisible,
          onCancel: () => {
            setIsCheckModalVisible(false);
            setStep(1);
          },
        }}
        step2Option={{
          onConfirm: () => {
            sessionStorage.setItem(String(clients[0].id), "confirm");
            onResetFilterProps();
            company && history.push(`${match.url}/details/${clients[0].id}`);
          },
        }}
        setStep={setStep}
        step={step}
        companyId={company?.id ? company.id : null}
      />
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Компании</h1>
            {isAdmin && (
              <span>Кол-во: {clientsTotal.toLocaleString("ru")}</span>
            )}
          </div>
        </div>
        <div className="filter-block">
          <WithPermission
            annotation={MON_COMPANY_LIST_FILT_DATE}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <RangePicker
                className="custom-date-picker"
                format={dateFormat}
                value={[
                  $clientsListFilter.from
                    ? moment($clientsListFilter.from)
                    : null,
                  $clientsListFilter.to
                    ? moment($clientsListFilter.to).endOf("minute")
                    : null,
                ]}
                onChange={(_, dateStrings) =>
                  onFilterChange({
                    from: dateStrings[0] ? dateStrings[0] : undefined,
                    to: dateStrings[1] ? dateStrings[1] : undefined,
                  })
                }
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_COMPANY_LIST_FILT_SEARCH}
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
          <WithPermission
            annotation={MON_COMPANY_LIST_FILT_ACTIVITY}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder="Сфера деятельности"
                value={$clientsListFilter.activityTypeId}
                onChange={(activityTypeId) =>
                  onFilterChange({ activityTypeId })
                }
                allowClear
              >
                {$activityTypesItems.data.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_COMPANY_LIST_FILT_BUSINESS}
            placement={{ right: 5, top: 0, bottom: 0 }}
          >
            <div className="filter-block__item">
              <Select
                className="custom-select"
                placeholder="Тип компании"
                value={$clientsListFilter.businessType}
                onChange={(businessType) => onFilterChange({ businessType })}
                allowClear
              >
                {$businessTypesItems.data.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.nameRu}
                  </Option>
                ))}
              </Select>
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
          <div style={{ marginLeft: 10 }}>
            <WithPermission
              annotation={MON_COMPANY_DETAILS_DATA_ENTRY}
              placement={{ right: 5, top: 0, bottom: 0, left: 10 }}
            >
              <Tooltip placement="bottom" title="Привязать к компании">
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon className="svg" icon={faEthernet} />}
                  onClick={onRefToCompany}
                />
              </Tooltip>
            </WithPermission>
          </div>
        </div>
        {clientsError && (
          <div className="custom-content__error">
            <Alert message={clientsError.message} type="error" />
          </div>
        )}
        {isAdmin && (
          <div className="custom-content__table u-fancy-scrollbar">
            <Table
              dataSource={data}
              columns={columns}
              loading={clientsLoading}
              pagination={false}
            />
          </div>
        )}
        {isAdmin && (
          <div className="custom-pagination">
            <Pagination
              total={clientsTotal}
              pageSize={clientsSize}
              current={clientsPage + 1}
              hideOnSinglePage={true}
              pageSizeOptions={["20", "50", "100", "150", "250", "500"]}
              onChange={onChangePagination}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
