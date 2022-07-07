import React, { useState } from "react";
// @ts-ignore
import styles from "./cheque.module.css";
import cn from "classnames";
import moment from "moment";
import Loading from "app/presentationLayer/components/loading";
import QRCode from "qrcode.react";
import Modal from "react-modal";
import { Map, Marker } from "yandex-map-react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ChequeComponent = (props) => {
  const [open, setOpen] = useState(false);
  const [lon, setLon] = useState();
  const [lat, setLat] = useState();
  if (props.isLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.circular_content}>
            <Loading show={props.isLoading} />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.main}>
        <div className={`${styles.content} u-fancy-scrollbar`}>
          <Modal
            isOpen={open}
            style={customStyles}
            contentLabel="Локация чека"
            onRequestClose={() => {
              setLon(undefined);
              setLat(undefined);
              setOpen(false);
            }}
          >
            <div style={{ width: 600, height: 600 }}>
              <Map
                onAPIAvailable={function() {
                  console.log("API loaded");
                }}
                center={[lat || 55.754734, lon || 37.583314]}
                zoom={12}
              >
                <Marker lat={lat || 55.754734} lon={lon || 37.583314} />
              </Map>
            </div>
          </Modal>
          <div className={cn(styles.company_title, styles.centered)}>
            Компания
            {props.cheque && props.cheque.lon && props.cheque.lat ? (
              <span
                style={{ paddingLeft: 6 }}
                onClick={() => {
                  setLon(props.cheque.lon);
                  setLat(props.cheque.lat);

                  setOpen(true);
                }}
              >
                <img
                  src={require("../../../assets/img/location_icon.png")}
                  alt="lc"
                  width={20}
                  height={20}
                  style={{ objectFit: "contain", cursor: "pointer" }}
                />
              </span>
            ) : (
              undefined
            )}
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque && props.cheque.companyName
              ? `${props.cheque.companyName}`
              : "Название компании"}
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque ? props.cheque.branchName : "Филиал"}
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque ? props.cheque.branchAddress : "Адрес"}
          </div>
          {props.cheque && props.cheque.companyINN ? (
            <div className={cn(styles.company_header, styles.centered)}>
              ИНН: {props.cheque.companyINN}
            </div>
          ) : (
            undefined
          )}
          <div>
            <div className={styles.divider} />
            <div className={styles.pair}>
              <div className={styles.left}>Кассир:</div>
              <div className={styles.right}>
                {props.cheque && props.cheque.user
                  ? `${props.cheque.user.fullName.lastName} ${props.cheque.user.fullName.firstName}`
                  : "ФИО Кассира"}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={styles.left}>
                Смена № {props.cheque ? props.cheque.shiftNo : ""}
              </div>
              <div className={styles.right}>
                {props.cheque && props.cheque.receiptDateTime
                  ? moment(props.cheque.receiptDateTime).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </div>
            </div>
            <div className={styles.divider} />
            {props.cheque && props.cheque.receiptDetails ? (
              props.cheque.receiptDetails.map((item, index) => (
                <div className={styles.pair}>
                  <div className={styles.left}>
                    {index + 1}. {item.productName || "Не известно"}
                    <div style={{ marginLeft: 10 }}>
                      {item.qty} x {item.price} сум
                    </div>
                    <div style={{ marginLeft: 10 }}>
                      в т.ч. НДС - {item.ndsPercent || 0}%
                    </div>
                    {item.excise !== undefined && item.excise !== null ? (
                      <div style={{ marginLeft: 10 }}>
                        Акциз - {item.exciseRate || 0}
                      </div>
                    ) : (
                      undefined
                    )}
                    {item.discountAmountForPromotion ? (
                      <div style={{ marginLeft: 10 }}>
                        Акция{" "}
                        {item.discountByPromotionPercent
                          ? `${item.discountByPromotionPercent} %`
                          : ""}
                      </div>
                    ) : (
                      undefined
                    )}
                  </div>

                  <div className={styles.right}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      ={item.amount}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      ={item.nds}
                    </div>
                    {item.excise !== undefined && item.excise !== null ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        ={item.excise || 0}
                      </div>
                    ) : (
                      undefined
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 20, textAlign: "center" }}>
                СПИСОК ТОВАРОВ ПУСТ
              </div>
            )}
            <div className={styles.divider} />
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>ПОЗИЦИЙ</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque && props.cheque.receiptDetails
                  ? props.cheque.receiptDetails.length
                  : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>ИТОГО</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque ? props.cheque.totalCost : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>СКИДКА</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque ? props.cheque.totalDiscount : 0}
              </div>
            </div>
            <div
              className={styles.pair}
              style={{ marginTop: 6, marginBottom: 6, fontSize: 16 }}
            >
              <div className={cn(styles.left, styles.bold)}>К ОПЛАТЕ</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? props.cheque.totalCost - props.cheque.totalDiscount
                  : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>
                ОПЛАЧЕНО
                <div
                  style={{
                    marginLeft: 10,
                    fontWeight: 200,
                  }}
                >
                  Наличными:
                </div>
                <div
                  style={{
                    marginLeft: 10,
                    fontWeight: 200,
                  }}
                >
                  Банковская карта:
                </div>
              </div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque ? props.cheque.totalPaid : 0}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    fontWeight: 200,
                  }}
                >
                  {props.cheque ? props.cheque.totalCash : 0}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    fontWeight: 200,
                  }}
                >
                  {props.cheque ? props.cheque.totalCard : 0}
                </div>
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>
                Итого сумма НДС
              </div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque ? props.cheque.totalNds : 0}
              </div>
            </div>
            {props.cheque && props.cheque.totalPromotionBonus ? (
              <div className={styles.pair}>
                <div className={cn(styles.left, styles.bold)}>
                  Акции
                  {props.cheque && props.cheque.totalBasketPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      Корзина{" "}
                      {props.cheque.discountAmountForPromotion
                        ? `${props.cheque.discountAmountForPromotion} %`
                        : ""}
                      :
                    </div>
                  ) : (
                    undefined
                  )}
                  {props.cheque && props.cheque.totalProductPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      Товары:
                    </div>
                  ) : (
                    undefined
                  )}
                </div>
                <div className={cn(styles.right, styles.bold)}>
                  {props.cheque
                    ? (props.cheque.totalPromotionBonus || 0).toLocaleString(
                        "ru"
                      )
                    : 0}
                  {props.cheque && props.cheque.totalBasketPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      {props.cheque
                        ? props.cheque.totalBasketPromotionBonuses.toLocaleString(
                            "ru"
                          )
                        : 0}
                    </div>
                  ) : (
                    undefined
                  )}
                  {props.cheque && props.cheque.totalProductPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      {props.cheque
                        ? props.cheque.totalProductPromotionBonuses.toLocaleString(
                            "ru"
                          )
                        : 0}
                    </div>
                  ) : (
                    undefined
                  )}
                </div>
              </div>
            ) : (
              undefined
            )}
            <div
              className={styles.pair}
              style={{
                marginBottom: 6,
                marginTop: 6,
                fontSize: 16,
              }}
            >
              <div className={cn(styles.left, styles.bold)}>СДАЧА</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? props.cheque.totalPaid - props.cheque.totalCost
                  : 0}
              </div>
            </div>
            <div className={styles.divider} />
          </div>
          <div className={styles.pair}>
            <div className={styles.left}>UID чека</div>
            <div className={styles.right}>
              {props.cheque ? props.cheque.uid : 0}
            </div>
          </div>
          <div className={styles.pair}>
            <div className={styles.left}>ФП</div>
            <div className={styles.right}>
              {props.cheque && props.cheque.fiscalSign
                ? props.cheque.fiscalSign
                : "Не фискальный"}
            </div>
          </div>
          <div className={styles.pair}>
            <div className={styles.left}>ККМ</div>
            <div className={styles.right}>
              {props.cheque && props.cheque.terminalSN
                ? props.cheque.terminalSN
                : "НЕТ"}
            </div>
          </div>
          <div className={styles.qrcode_container}>
            {props.cheque && props.cheque.fiscalUrl ? (
              <a href={props.cheque.fiscalUrl} target="_blank">
                <QRCode value={props.cheque.fiscalUrl} />
              </a>
            ) : (
              undefined
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ChequeComponent;
