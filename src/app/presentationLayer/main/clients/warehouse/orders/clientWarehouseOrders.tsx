// import React, { useEffect, useState } from "react";
// import { Link, withRouter } from "react-router-dom";
// // @ts-ignore
// import styles from "./clientWarehouseOrders.module.css";
// import Card from "app/presentationLayer/components/card";
// import Pagination, { PageSizeType } from "app/presentationLayer/components/pagination";
// import Search from "app/presentationLayer/components/search";
// import RangePicker from "app/presentationLayer/components/rangePicker";
// import Table from "app/presentationLayer/components/table";
// import moment from "moment";
// import DropDown from "app/presentationLayer/components/dropdown";
// import { useStore } from 'effector-react'
// import effector from "app/presentationLayer/effects/clients";
// import Dropdown from "app/presentationLayer/components/dropdown";
// import { ChequeListFilterType } from "app/businessLogicLayer/models/Client";
//
// export default withRouter((props) => {
//   const { match } = props;
//   const companyId = match.params.companyId;
//
//   const $warehouseOrdersList = useStore(effector.stores.$warehouseOrdersList);
//   const $branchItems = useStore(effector.stores.$branchItems);
//   const $contractors = useStore(effector.stores.$contractors);

//   const { data: warehouseOrdersData, loading: warehouseOrdersLoading } = $warehouseOrdersList;
//
//   const {
//     content: warehouseOrders,
//     number: warehouseOrdersPage,
//     size: warehouseOrdersSize,
//     totalPages: warehouseOrdersTotalPages
//   } = warehouseOrdersData;
//
//   const [filterProps, setFilterProps] = useState<ChequeListFilterType>({ size: 50, });
//
//   useEffect(() => {
//     effector.effects.fetchWarehouseOrdersList({ companyId });
//
//     if (!$branchItems.data.length) {
//       effector.effects.fetchBranchItems({ companyId });
//     }
//
//     effector.effects.fetchContractors({ companyId });
//
//     return () => {
//       effector.events.resetWarehouseOrdersList();
//       effector.events.resetBranchItems();
//     }
//   }, []);
//
//   useEffect(() => {
//     effector.effects.fetchWarehouseOrdersList({ companyId, ...filterProps });
//   }, [filterProps]);
//
//
//   const onFilterChange = (prop, value) => {
//     setFilterProps({ ...filterProps, [prop]: value });
//   };
//
//   const onBranchChange = (branchId) => {
//     setFilterProps({ ...filterProps, branchId });
//   };
//
//   const onDateSelected = (from, to) => {
//     setFilterProps({
//       ...filterProps,
//       from: from ? moment(from).startOf("day").format("YYYY-MM-DDTHH:mm:ss") : undefined,
//       to: to ? moment(to).endOf("day").format("YYYY-MM-DDTHH:mm:ss") : undefined
//     });
//   };
//
//   const onChangePagination = (page) => {
//     setFilterProps({ ...filterProps, page });
//   };
//
//   const onChangeSize = (size) => {
//     setFilterProps({ ...filterProps, size });
//   };
//
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.header}>
//         <div>
//           <strong>Склад. Заказы</strong>
//         </div>
//         <div>
//           <Link to={`${match.url}/warehouse/orders/add`} className={styles.add_button}>+</Link>
//         </div>
//       </div>
//       <Card className={styles.content}>
//         <div className={styles.card}>
//           <div className={styles.filter}>
//             <div className={styles.filter_item}>
//               <Dropdown
//                 value={filterProps.branchId}
//                 onSelect={item => onBranchChange(item ? item.value : undefined)}
//                 data={
//                   $branchItems.data.map(at => ({
//                     title: at.name,
//                     value: at.id
//                   })) || []
//                 }
//                 noDataTitle="Выберите филиал"
//               />
//             </div>
//             <div className={styles.filter_item}>
//               <RangePicker
//                 value={{
//                   from: filterProps.from ? moment(filterProps.from).toDate() : undefined,
//                   to: filterProps.to ? moment(filterProps.to).toDate() : undefined
//                 }}
//                 onDateSelected={onDateSelected}
//               />
//             </div>
//             <div className={styles.filter_item}>
//               <Search
//                 className={styles.search}
//                 onSearch={(value) => {
//                   if (!value || value.length >= 3) {
//                     onFilterChange("search", value);
//                   }
//                 }}
//                 value={filterProps.search}
//                 placeholder="Поиск..."
//               />
//             </div>
//             <div className={styles.filter_item}>
//               <DropDown
//                 noDataTitle="Статус - Все"
//                 data={[
//                   {
//                     value: 'ALL',
//                     title: 'Все'
//                   },
//                   {
//                     value: 'RECEIVED',
//                     title: 'Закрытый'
//                   },
//                   {
//                     value: 'PARTLY_RECEIVED',
//                     title: 'Частично закрытый'
//                   },
//                   {
//                     value: 'ORDERED',
//                     title: 'Заказ'
//                   },
//                   {
//                     value: 'DRAFT',
//                     title: 'Черновик'
//                   },
//                   {
//                     value: 'CANCELLED',
//                     title: 'Отменен'
//                   }
//                 ]}
//                 value={filterProps.isFiscal}
//                 onSelect={item => onFilterChange("status", item ? item.value === 0 : undefined)}
//               />
//             </div>
//             <div className={styles.filter_item}>
//               <Dropdown
//                 value={filterProps.branchId}
//                 onSelect={item => onBranchChange(item ? item.value : undefined)}
//                 data={
//                   $contractors.data.map(at => ({
//                     title: at.name,
//                     value: at.id
//                   })) || []
//                 }
//                 noDataTitle="Поставщик - все"
//               />
//             </div>
//           </div>
//           <div className={styles.table}>
//             <Table
//               showOrderNo={true}
//               header={["Дата", "Сумма", "Торговая точка", "Способ оплаты", "Тип чека"]}
//               page={warehouseOrdersPage}
//               size={warehouseOrdersSize}
//               data={
//                 warehouseOrders.map(cheque => ({
//                   id: cheque.id,
//                   date: moment(cheque.receiptDateTime).format("DD-MM-YYYY HH:mm:ss"),
//                   sum: String(cheque.totalCost),
//                   branch: cheque.branchName || "Неизвестно",
//                   paymentType: `${cheque.totalCash ? "Наличные " : ""} ${cheque.totalCard ? "Терминал" : ""}`,
//                   chequeType: cheque.fiscalUrl ? "Фискальный" : "Не фискальный"
//                 }))
//               }
//               isLoading={warehouseOrdersLoading}
//             />
//           </div>
//         </div>
//         {!!warehouseOrdersTotalPages && <div className={styles.pagination}>
//           <Pagination
//             page={warehouseOrdersPage}
//             total={warehouseOrdersTotalPages}
//             sizeType={PageSizeType.big}
//             size={warehouseOrdersSize}
//             onPageSelected={onChangePagination}
//             onSizeChange={onChangeSize}
//           />
//         </div>}
//       </Card>
//     </div>
//   );
// });
