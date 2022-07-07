import React, { ReactNode } from "react";
import "./styles.scss";

interface Props {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  desc?: string | null;
  error?: string | null;
  className?: string;
}

export const FormField = (props: Props) => {
  const { title, aside, children, desc, error, className } = props;

  return (
    <div
      className={`form-field-item ${className ? className : ""} ${
        error ? "form-field-item-error ant-form-item-has-error" : ""
      }`}
    >
      {title && (
        <div className="form-field-title">
          <div>{title}</div>
          {aside}
        </div>
      )}
      {children}
      {desc && <div className="form-field-item__desc">{desc}</div>}
      {error && <div className="form-field-item__error">{error}</div>}
    </div>
  );
};
