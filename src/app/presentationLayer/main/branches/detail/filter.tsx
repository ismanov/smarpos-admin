import React, { HTMLAttributes, useState, useEffect } from "react";
// @ts-ignore
import styles from "./detail.module.css";
import Card from "app/presentationLayer/components/card";
import FilterSelect from "./filterSelect";

enum BranchFilterTypes {
  revenue,
  cheques,
  averageCheques,
  cash,
  cashless,
  returns,
  kkm,
  cashiers,
  admins
}

const getBranchTitle = (e: BranchFilterTypes) => {
  switch (e) {
    case BranchFilterTypes.admins:
      return "Администраторы";
    case BranchFilterTypes.averageCheques:
      return "Средний чек";
    case BranchFilterTypes.cash:
      return "Наличные";
    case BranchFilterTypes.cashiers:
      return "Кассиры";
    case BranchFilterTypes.cashless:
      return "Безналичные";
    case BranchFilterTypes.cheques:
      return "Чеки";
    case BranchFilterTypes.kkm:
      return "ККМ";
    case BranchFilterTypes.returns:
      return "Возвраты";
    case BranchFilterTypes.revenue:
      return "Выручка";
  }
};

let filters: Array<BranchFilterTypes> = [
  BranchFilterTypes.revenue,
  BranchFilterTypes.cheques,
  BranchFilterTypes.averageCheques,
  BranchFilterTypes.cash,
  BranchFilterTypes.cashless,
  BranchFilterTypes.returns,
  BranchFilterTypes.kkm,
  BranchFilterTypes.cashiers,
  BranchFilterTypes.admins
];

export default (
  props: HTMLAttributes<HTMLDivElement> & {
    onSelectBranch: (BranchFilterTypes) => void;
  }
) => {
  const [selectedFilter, setSelectedFilter] = useState<BranchFilterTypes>(
    BranchFilterTypes.revenue
  );
  useEffect(() => {
    props.onSelectBranch(selectedFilter);
  }, [selectedFilter]);
  return (
    <Card className={styles.filter_panel}>
      <div className={styles.title}>Статистика торговой точки</div>
      <div className={styles.hr} />
      <div className={styles.content}>
        {filters.map(item => (
          <div style={{ marginLeft: 15 }}>
            <FilterSelect
              title={getBranchTitle(item)}
              sum="1 000 000 sum"
              active={selectedFilter === item}
              onClick={() => {
                setSelectedFilter(item);
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
