import React, { useEffect, useState } from "react";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { Menu } from "antd";
import "./styles.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCogs,
  faReceipt,
  faHome,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
// import { SupplierSvg } from "../../../../assets/svg";
import {
  MENU_TYPE,
  SUB_MENU_TYPE,
  MAIN_MENU,
  MAN_EXCISE,
  MAN_MENU,
  MAN_SINGLE_CAT,
  MAN_UNIT,
  MAN_USER,
  MAN_VAT,
  MON_COMPANY,
  MON_EMPLOYEE,
  MON_KKM,
  MON_LOG,
  // MON_PRODUCT,
  MON_MENU,
  MON_BRANCH,
  // SUP_MENU,
  // SUP_COMPANY,
  STA_CHEQUE,
  STA_CHEQUE_BY_BRANCH,
  STA_CHEQUE_BY_COMPANY,
  STA_MENU,
  MON_TG_USERS,
  //MON_AGREEMENTS,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

const menuData = [
  {
    name: "Главная",
    path: "/main",
    icon: faHome,
    annotation: MAIN_MENU,
    linkProps: { exact: true },
  },
  {
    name: "Статистика и аналитика",
    key: "/main/analytics",
    icon: faReceipt,
    annotation: STA_MENU,
    sub: [
      {
        name: "Чеки",
        path: "/main/analytics/cheques",
        annotation: STA_CHEQUE,
      },
      {
        name: "Чеки по филиалам",
        path: "/main/analytics/chequesByBranch",
        annotation: STA_CHEQUE_BY_BRANCH,
      },
      {
        name: "Чеки по компаниям",
        path: "/main/analytics/cheques-by-companies",
        annotation: STA_CHEQUE_BY_COMPANY,
      },
    ],
  },
  {
    name: "Мониторинг",
    key: "/main/monitoring",
    icon: faChartBar,
    annotation: MON_MENU,
    sub: [
      {
        name: "Компании",
        path: "/main/monitoring/companies",
        annotation: MON_COMPANY,
      },
      {
        name: "Филиалы",
        path: "/main/monitoring/branches",
        annotation: MON_BRANCH,
      },
      {
        name: "Сотрудники",
        path: "/main/monitoring/staff",
        annotation: MON_EMPLOYEE,
      },
      {
        name: "ККМ",
        path: "/main/monitoring/kkm",
        annotation: MON_KKM,
      },
      {
        name: "Услуги",
        path: "/main/monitoring/agreements",
        annotation: MON_COMPANY,
      },
      {
        name: "Логи",
        path: "/main/monitoring/logs",
        annotation: MON_LOG,
      },
      {
        name: "Пользователи телеграм",
        path: "/main/monitoring/telegram-users",
        annotation: MON_TG_USERS,
      },
      // {
      // 	name: "Товары",
      // 	path: "/main/monitoring/products",
      // 	annotation: MON_PRODUCT,
      // },
    ],
  },
  // {
  //   name: "Поставщики",
  //   key: "/main/suppliers",
  //   icon: <SupplierSvg />,
  //   locIcon: true,
  //   annotation: SUP_MENU,
  //   sub: [
  //     {
  //       name: "Компании",
  //       path: "/main/suppliers/companies",
  //       annotation: SUP_COMPANY,
  //     },
  //   ]
  // },
  {
    name: "Управление",
    key: "/main/management",
    icon: faCogs,
    annotation: MAN_MENU,
    sub: [
      {
        name: "Пользователи",
        path: "/main/management/users",
        annotation: MAN_USER,
      },
      {
        name: "Акциз",
        path: "/main/management/excise",
        annotation: MAN_EXCISE,
      },
      {
        name: "Ставка НДС",
        path: "/main/management/vat",
        annotation: MAN_VAT,
      },
      {
        name: "Единица измерения",
        path: "/main/units",
        annotation: MAN_UNIT,
      },
      {
        name: "Единый каталог",
        path: "/main/single",
        annotation: MAN_SINGLE_CAT,
      },
    ],
  },
  {
    name: "Права и доступы",
    key: "/main/permissions",
    icon: faLock,
    sub: [
      {
        name: "Эндпоинты",
        path: "/main/permissions/endpoints",
      },
    ],
  },
];

const { SubMenu } = Menu;

const findOpenKeysInTree = (tree, path, parents) => {
  if (!tree || !tree.length) {
    return null;
  }

  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    const newParents = [...parents];

    newParents.push(item.path || item.key);

    if (item.path === path || item.key === path) {
      return newParents;
    }

    const subParents = findOpenKeysInTree(item.sub, path, newParents);

    if (subParents) {
      return subParents;
    }
  }

  return null;
};

const findOpenKeysInSubPath = (pathname) => {
  const arrayPath = pathname.split("/");
  arrayPath.splice(-1, 1);

  if (arrayPath <= 1) {
    return null;
  }

  const newPath = arrayPath.join("/");

  const openKeys = findOpenKeysInTree(menuData, newPath, []);

  if (openKeys) {
    return openKeys;
  }

  return findOpenKeysInSubPath(newPath);
};

const getOpenKeys = (location) => {
  let openKeys = findOpenKeysInTree(menuData, location.pathname, []);

  if (!openKeys) {
    openKeys = findOpenKeysInSubPath(location.pathname);
  }

  return openKeys || [];
};

interface PropsI {
  collapsed: boolean;
}

export const Navigation = withRouter((props: RouteComponentProps & PropsI) => {
  const { location, collapsed } = props;
  const [openKeys, setOpenKeys] = useState(getOpenKeys(location));

  useEffect(() => {
    setOpenKeys(getOpenKeys(location));
  }, [location]);

  const onParentClick = ({ key }) => {
    let newOpenKeys: string[] = [];
    const findIndex = openKeys.findIndex((item) => item === key);

    if (findIndex > -1) {
      newOpenKeys = [...openKeys];
      newOpenKeys.splice(findIndex, 1);
    } else {
      newOpenKeys = [key];
    }

    setOpenKeys(newOpenKeys);
  };

  const getMenu = (menu, level = 1) => {
    const type = level === 1 ? MENU_TYPE : SUB_MENU_TYPE;
    const className = level === 1 ? "left-menu__item" : "left-menu__sub-item";
    const placement = level > 2 ? { left: level * 8, top: 0, bottom: 0 } : null;
    return menu.map((item) => {
      const menuItem = (
        <WithPermission
          annotation={item.annotation}
          type={type}
          placement={placement}
        >
          <div className={className}>
            {item.path ? (
              <NavLink to={item.path} {...item.linkProps}>
                {item.icon && (
                  <FontAwesomeIcon className="svg" icon={item.icon} />
                )}
                <span>{item.name}</span>
              </NavLink>
            ) : (
              <>
                {item.icon && !item.locIcon && (
                  <FontAwesomeIcon className="svg" icon={item.icon} />
                )}
                {item.locIcon && item.icon}
                <span>{item.name}</span>
              </>
            )}
          </div>
        </WithPermission>
      );

      if (item.sub && item.sub.length) {
        return (
          <SubMenu
            key={item.path || item.key}
            title={menuItem}
            onTitleClick={onParentClick}
          >
            {getMenu(item.sub, level + 1)}
          </SubMenu>
        );
      }

      return <Menu.Item key={item.path || item.key}>{menuItem}</Menu.Item>;
    });
  };

  const menuProps: any = {
    selectedKeys: openKeys,
  };

  if (!collapsed) {
    menuProps.openKeys = openKeys;
  }

  return (
    <Menu
      mode="inline"
      className="left-navigation"
      {...menuProps}
      selectedKeys={openKeys}
    >
      {getMenu(menuData)}
    </Menu>
  );
});
