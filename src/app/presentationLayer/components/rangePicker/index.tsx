import React, { HTMLAttributes, useState, useEffect } from "react";
// @ts-ignore
import RangePicker from "react-range-picker";
import cn from "classnames";
// @ts-ignore
import styles from "./rangepicker.module.css";

import moment from "moment";
// @ts-ignore
import Calendar from "app/assets/img/calendar.svg";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default (
  props: HTMLAttributes<HTMLDivElement> & {
    onDateSelected: (from?: Date, to?: Date) => void;
    initialValue?: "day" | "week" | "month";
    value?: {from?: Date, to?: Date}
  }
) => {
  const [dateText, setDateText] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!startDate || !endDate) {
      setDateText('Дата');
      return
    }
    let sDate = moment(startDate).startOf("day");
    let eDate = moment(endDate).startOf("day");
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDay() === endDate.getDay()
    ) {
      setDateText(sDate.format("DD-MMM-YYYY"));
    } else {
      setDateText(
        `${sDate.format("DD-MMM-YYYY")} - ${eDate.format("DD-MMM-YYYY")}`
      );
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setStartDate(props.value ? props.value.from : startDate);
    setEndDate(props.value ? props.value.to : endDate);
  }, [props.value]);

  useEffect(() => {
    let initialValue = props.initialValue || "day";
    switch (initialValue) {
      case "day":
        setStartDate(moment().startOf("day").toDate());
        setEndDate(moment().endOf("day").toDate());
        break;
      case "month":
        setStartDate(moment().startOf("month").toDate());
        setEndDate(moment().endOf("month").toDate());
        break;
      case "week":
        setStartDate(moment().startOf("isoWeek").toDate());
        setEndDate(moment().endOf("isoWeek").toDate());
        break;
    }
  }, []);

  const dateSelected = (from: Date, to: Date) => {
    setStartDate(from);
    setEndDate(to);
    props.onDateSelected && props.onDateSelected(from, to);
  };

  const customView = () => {
    return (
      <div {...props} className={cn(styles.rangepicker, props.className)}>
        <div className={styles.img}>
          <img src={Calendar} alt="calendar" />
        </div>
        <div className={styles.text}>{dateText}</div>
        <span
            className={styles.clear}
            onClick={e => {
              setStartDate(undefined);
              setEndDate(undefined);
              props.onDateSelected && props.onDateSelected(undefined, undefined);
              e.preventDefault()
            }}
        >X</span>

      </div>
    );
  };

  return <RangePicker
          onDateSelected={dateSelected}
          placeholder={customView}
          onClose={() => {}}
          closeOnSelect={true}
        />;

};
