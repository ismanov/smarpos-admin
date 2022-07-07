import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Table, Alert, Button } from "antd";
import chequesEffector from "app/presentationLayer/effects/cheques";
import Card from "app/presentationLayer/components/card";
import { months } from "app/constants";
import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export const BranchesStatistics = (props) => {
  const { match, history } = props;
  const { companyId } = match.params;
  const $branchItems = useStore(chequesEffector.stores.$branchItems);
  const $branchesStatistics = useStore(
    chequesEffector.stores.$branchesStatistics
  );

  const {
    data: statistics,
    loading: statisticsLoading,
    error: statisticsError,
  } = $branchesStatistics;

  useEffect(() => {
    chequesEffector.effects.fetchBranchItemsEffect({ companyId, size: 100 });
    chequesEffector.effects.fetchBranchesStatisticsEffect({ companyId });

    return () => {
      chequesEffector.events.resetBranchItemsEvent();
      chequesEffector.events.resetBranchesStatisticsEvent();
    };
  }, []);

  const columns = [
    {
      title: "",
      dataIndex: "month",
    },
    {
      title: "Данные",
      dataIndex: "data",
    },
  ];

  console.log("$branchItems", $branchItems);

  const data = statistics.map((item) => ({
    id: item.monthNumber,
    key: item.monthNumber,
    month: months[item.monthNumber - 1],
    revenue: (
      <div className="t-a-c">
        {item.revenue.toLocaleString("ru")}
        {item.revenuePercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.revenuePercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.revenuePercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    nds: (
      <div className="t-a-c">
        {item.nds.toLocaleString("ru")}
        {item.ndspercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.ndspercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.ndspercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    excise: (
      <div className="t-a-c">
        {item.excise.toLocaleString("ru")}
        {item.excisePercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.excisePercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.excisePercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    receipts: (
      <div className="t-a-c">
        {item.receipts.toLocaleString("ru")}
        {item.receiptsPercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.receiptsPercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.receiptsPercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    receiptsAvg: (
      <div className="t-a-c">
        {item.receiptsAvg.toLocaleString("ru")}
        {item.receiptsAvgPercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.receiptsAvgPercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.receiptsAvgPercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    // positionsInReceipts: (<div className="t-a-c">
    //   {item.positionsInReceipts.toLocaleString("ru")}
    //   {item.positionsInReceiptsPercent !== null ? <div className={`CCBM__percent-item ${item.positionsInReceiptsPercent > 0? "green": "red"}`}>
    //     <span>%</span>
    //     {item.positionsInReceiptsPercent.toLocaleString("ru")}
    //   </div>: ""}
    // </div>),
    cardHumo: (
      <div className="t-a-c">
        {item.cardHumo.toLocaleString("ru")}
        {item.cardHumoPercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.cardHumoPercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.cardHumoPercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    cardUzCard: (
      <div className="t-a-c">
        {item.cardUzCard.toLocaleString("ru")}
        {item.cardUzCardPercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.cardUzCardPercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.cardUzCardPercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    cash: (
      <div className="t-a-c">
        {item.cash.toLocaleString("ru")}
        {item.cashPercent !== null ? (
          <div
            className={`CCBM__percent-item ${
              item.cashPercent > 0 ? "green" : "red"
            }`}
          >
            <span>%</span>
            {item.cashPercent.toLocaleString("ru")}
          </div>
        ) : (
          ""
        )}
      </div>
    ),
    branches: <div className="t-a-c">{item.branches.toLocaleString("ru")}</div>,
  }));

  return (
    <Card fullHeight={true} className="company-cheques-by-month">
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left">
            <Button
              onClick={() => history.goBack()}
              type="ghost"
              shape="circle"
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
            />
            <div className="custom-content__header__left-inner">
              <h1>Статистика по компании</h1>
            </div>
          </div>
          <div>
            <Link
              to={`/main/analytics/cheques-by-companies/statistics-by-branches/${companyId}`}
              className="ant-btn ant-btn-primary"
            >
              Статистика по филиалам
            </Link>
          </div>
        </div>
        {statisticsError && (
          <div className="custom-content__error">
            <Alert message={statisticsError.message} type="error" />
          </div>
        )}
        <div className="custom-content__table u-fancy-scrollbar">
          <Table
            dataSource={data}
            columns={columns}
            loading={statisticsLoading}
            pagination={false}
          />
        </div>
      </div>
    </Card>
  );
};
