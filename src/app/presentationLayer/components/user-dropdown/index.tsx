import React from "react";
import { useStore } from "effector-react";
import { useHistory } from 'react-router-dom';
import { Button, Popover, Spin, Avatar } from 'antd';
import Cookies from "js-cookie";

import effector from "app/presentationLayer/effects/main";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserSvg } from "../../../../assets/svg";
import "./styles.scss";


export const UserDropdown = () => {
  const $currentUser = useStore(effector.stores.$currentUser);
  const history = useHistory();

  const { loading: currentUserLoading, data: currentUserData } = $currentUser;

  const onSignOutClick = () => {
    Cookies.remove('access-token');

    history.push("/signin");
  };

  const dropdownMenu = () => {
    return (
      <div className="site-header-user__dropdown">
        <div className="site-header-user__dropdown__logout">
          <div className="site-header-user__dropdown__item">
            <Button type="link" onClick={onSignOutClick}>Выйти</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderInner = () => {
    if (currentUserLoading) {
      return (
        <div className="site-header-user__loading">
          <Spin />
        </div>
      );
    } else if (currentUserData) {
      return (
        <div className="site-header-user__name">
          {currentUserData.fullName.lastName} {currentUserData.fullName.firstName}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="site-header-user">
      <Popover placement="bottomRight" content={dropdownMenu()} trigger="click">
        <div className="site-header-user__row">
          <div className="site-header-user__row__left">
            <Avatar size={40} icon={<UserSvg />} />
          </div>
          <div className="site-header-user__row__middle">
            {renderInner()}
          </div>
          <div className="site-header-user__row__right">
						<FontAwesomeIcon className='svg' icon={faChevronDown} />
          </div>
        </div>
      </Popover>
    </div>
  )
};