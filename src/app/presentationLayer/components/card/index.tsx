import React, { HTMLAttributes } from "react";
import cn from "classnames";
import "./styles.scss";

interface PropsI {
  className?: string;
  fullHeight?: boolean;
}

export default (props: PropsI & HTMLAttributes<HTMLDivElement>) => {
  const { className = "", fullHeight = false, children } = props;
  return (
    <div className={cn("card-bg", className, { fullHeight: fullHeight })}>
      {children}
    </div>
  );
};
