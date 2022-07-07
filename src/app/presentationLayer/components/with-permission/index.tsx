import React, { ReactNode } from "react";
import { useStore } from "effector-react";
import cn from "classnames";

import mainEffector from "app/presentationLayer/effects/main";
import effector from "app/presentationLayer/effects/permissions";

import { SWITCH_TYPE, PAGE_TYPE } from "./constants";
import { getPlacement, findPermissionsInTree } from "./helper";

import { CustomCheckbox } from "app/presentationLayer/components/checkbox";
import { NotAllowedPage } from "app/presentationLayer/components/not-allowed-page";
import "./styles.scss";

const resetOnClick = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const preventOnClick = (event) => {
  event.stopPropagation();
};

const resetOnChange = (_, event) => {
  event.preventDefault();
  event.stopPropagation();
};

interface IProps {
  annotation: string;
  className?: string;
  type?: string;
  isOperator?: boolean;
  placement?: string | object | null;
  showChecker?: boolean;
  render?: (renderProps?: any, isPermissionMOde?: boolean) => ReactNode;
  children?: any;
}

export const WithPermission = (props: IProps) => {
  const {
    className = "",
    annotation,
    type,
    placement,
    showChecker = true,
    isOperator = false,
  } = props;
  const $currentUser = useStore(mainEffector.stores.$currentUser);
  const $permissionsMode = useStore(effector.stores.$permissionsMode);
  const $userPermissions = useStore(effector.stores.$userPermissions);
  const $appRoutes = useStore(effector.stores.$appRoutes);

  const { data: currentUser } = $currentUser;

  const { user, permissions } = $permissionsMode;
  const { data: appRoutes } = $appRoutes;
  const isPermissionMode =
    !!user && !!appRoutes.length && !!$userPermissions.data;

  if (isPermissionMode && annotation) {
    const onPermissionChange = (e) => {
      const checked = e.target.checked;

      if (checked) {
        const permissions = findPermissionsInTree(
          appRoutes,
          annotation,
          [],
          true
        );
        if (permissions) {
          effector.events.selectPermissions(permissions);
        }
      } else {
        const permissions = findPermissionsInTree(
          appRoutes,
          annotation,
          [],
          false
        );
        if (permissions) {
          effector.events.unSelectPermissions(permissions);
        }
      }
    };

    const { wrapPlacementCSS, checkerPlacementCSS } = getPlacement(
      placement,
      type
    );

    let renderProps;

    if (props.render) {
      if (type === SWITCH_TYPE) {
        renderProps = {
          onChange: resetOnChange,
          disabled: false,
        };
      } else {
        renderProps = {
          onClick: resetOnClick,
          disabled: false,
        };
      }
    }

    if (!showChecker) {
      return props.render ? props.render(renderProps, true) : props.children;
    }

    return (
      <div
        className={cn(`with-permission ${className}`, {
          active: true,
          [`with-permission_${type}`]: type,
        })}
        style={wrapPlacementCSS}
      >
        {props.render ? props.render(renderProps, true) : props.children}
        <div className="with-permission__checkbox" style={checkerPlacementCSS}>
          <div className="with-permission__checkbox__inner">
            <CustomCheckbox
              onChange={onPermissionChange}
              checked={!!permissions[annotation]}
              onClick={preventOnClick}
            />
          </div>
        </div>
      </div>
    );
  } else {
    if (currentUser) {
      if (
        currentUser.superAdmin ||
        (annotation && currentUser.permissions[annotation]) ||
        isOperator
      ) {
        if (!showChecker) {
          return props.render ? props.render() : props.children;
        }

        return (
          <div
            className={cn(`with-permission ${className}`, {
              [`with-permission_${type}`]: type,
            })}
          >
            {props.render ? props.render() : props.children}
          </div>
        );
      } else {
        if (type === PAGE_TYPE) {
          return <NotAllowedPage />;
        }
        return null;
      }
    } else {
      return null;
    }
  }
};
