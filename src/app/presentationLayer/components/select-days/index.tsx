import React from "react";
import { Input, Popover, Checkbox } from "antd";
import "./styles.scss";

const WEEK = "week";
const MONTH = "month";
const SELECT_ALL = "SELECT_ALL";
const SELECT_EVEN = "SELECT_EVEN";
const SELECT_ODD = "SELECT_ODD";

const days: any = {
  [WEEK]: [
    { name: "Понедельник", short: "Пн" },
    { name: "Вторник", short: "Вт" },
    { name: "Среда", short: "Ср" },
    { name: "Четверг", short: "Чт" },
    { name: "Пятница", short: "Пт" },
    { name: "Суббота", short: "Сб" },
    { name: "Воскресенье", short: "Вс" },
   ],
  [MONTH]: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ]
};

export interface DaysI {
  [key: number]: boolean;
}

interface PropsI {
  type: typeof WEEK | typeof MONTH
  selectedDays: DaysI | undefined
  onChange?: any
  readOnly?: boolean
}

const checkSelection = (type, selectedDays, days) => {
  if (type === SELECT_ALL) {
    return Object.keys(selectedDays).length === days.length;
  } else if (type === SELECT_EVEN) {
    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      if (day % 2 === 0) {
        if (!selectedDays[day]) {
          return false;
        }
      } else {
        if (selectedDays[day]) {
          return false;
        }
      }
    }

    return true;
  } else if (type === SELECT_ODD) {
    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      if (day % 2 !== 0) {
        if (!selectedDays[day]) {
          return false;
        }
      } else {
        if (selectedDays[day]) {
          return false;
        }
      }
    }

    return true;
  }

  return false;
};

const getSelectedValue = (type, selectedDays) => {
  let value = "";
  if (type === WEEK) {
    value = days[WEEK].filter((item, index) => !!selectedDays[index+1]).map((item) => item.short).join(", ");
  } else if (type === MONTH) {
    value = `Выбрано ${Object.values(selectedDays).length} дат`;
  }

  return value;
};

export const SelectDays = (props: PropsI) => {
  const { type, onChange, selectedDays = {} } = props;

  const onSelectDay = (event, day) => {
    const checked = event.target.checked;
    const newSelectedDays = { ...selectedDays };
    if (checked) {
      newSelectedDays[day] = true;
    } else {
      delete newSelectedDays[day];
    }

    if (onChange) {
      onChange(newSelectedDays, day);
    }
  };

  const onSelectAll = (event) => {
    const checked = event.target.checked;
    let newSelectedDays = [];
    if (checked) {
      newSelectedDays = days[type].reduce((acc, item, index) => {
        return { ...acc, [index + 1]: item.short || true }
      }, {});
    }

    if (onChange) {
      onChange(newSelectedDays);
    }
  };

  const onSelectEven = (event) => {
    const checked = event.target.checked;
    let newSelectedDays = [];
    if (checked) {
      newSelectedDays = days[type].filter((item) => item%2 === 0).reduce((acc, item) => {
        return { ...acc, [item]: true }
      }, {});
    }

    if (onChange) {
      onChange(newSelectedDays);
    }
  };

  const onSelectOdd = (event) => {
    const checked = event.target.checked;
    let newSelectedDays = [];
    if (checked) {
      newSelectedDays = days[type].filter((item) => item%2 !== 0).reduce((acc, item) => {
        return { ...acc, [item]: true }
      }, {});
    }

    if (onChange) {
      onChange(newSelectedDays);
    }
  };

  const selectedAll = checkSelection(SELECT_ALL, selectedDays, days[type]);
  const selectedEven = checkSelection(SELECT_EVEN, selectedDays, days[type]);
  const selectedOdd = checkSelection(SELECT_ODD, selectedDays, days[type]);

  const getContent = () => {
    if (type == WEEK) {
      return (
        <div className="select-days__week">
          <div className="select-days__week__item">
            <Checkbox checked={selectedAll} onChange={onSelectAll}>Все</Checkbox>
          </div>
          {days[type].map((day, index) => <div key={index} className="select-days__week__item">
            <Checkbox
              checked={!!selectedDays[index + 1]}
              onChange={(event) => onSelectDay(event, index + 1)}
            >
              {day.name}
            </Checkbox>
          </div>)}

        </div>
      );
    } else if (type == MONTH) {
      return (
        <div className="select-days__month">
          <div className="select-days__month__head">
            <div>
              <Checkbox onChange={onSelectAll} checked={selectedAll}>Все</Checkbox>
            </div>
            <div>
              <Checkbox onChange={onSelectEven} checked={selectedEven}>Четные</Checkbox>
            </div>
            <div>
              <Checkbox onChange={onSelectOdd} checked={selectedOdd}>Нечётные</Checkbox>
            </div>
          </div>
          <div className="select-days__month__inner">
            {days[type].map((day, index) => <div key={index} className="select-days__month__item">
              <Checkbox
                checked={!!selectedDays[index + 1]}
                onChange={(event) => onSelectDay(event, index + 1)}
              >
                {day}
              </Checkbox>
            </div>)}
          </div>

        </div>
      );
    }
    return null;
  };

  return (
    <Popover placement="bottomRight" content={getContent()} overlayClassName="select-days" trigger="click">
      <Input placeholder="Выберите дни" value={getSelectedValue(type, selectedDays)} readOnly />
    </Popover>
  );
};
