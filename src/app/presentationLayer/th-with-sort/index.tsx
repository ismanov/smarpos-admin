import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAmountDown, faSortAmountUpAlt } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

export const withSort = (title, fieldName, currentOrderBy, currentSortOrder, onChange) => {
  const active = fieldName === currentOrderBy;
  return (
    <div className="th-sort" onClick={() => onChange(fieldName)}>
      {title}
      <div className={`th-sort__arrow ${active ? "active": ""}`}>
        {currentSortOrder === "asc" || !active ?
          (<FontAwesomeIcon className='svg' icon={faSortAmountUpAlt} />) :
          (<FontAwesomeIcon className='svg' icon={faSortAmountDown} />)
        }
      </div>
    </div>
  );
};