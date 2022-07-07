import React from "react";
import { Tag } from 'antd';
import "./styles.scss";

const baseClassName = "custom-status";

export const Status = (props) => {
	const { color = "blue", size = "middle", className = "", children, ...restProps } = props;
		const sizeClass = `${baseClassName}-${size}`;

	return (
		<Tag className={`${baseClassName} ${sizeClass} ${className}`} {...restProps} color={color}>{children}</Tag>
	);
};