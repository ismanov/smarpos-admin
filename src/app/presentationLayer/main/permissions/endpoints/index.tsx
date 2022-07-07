import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, notification, Popconfirm, Menu, Empty, Spin } from "antd";
import Card from "app/presentationLayer/components/card";
import effector from "app/presentationLayer/effects/permissions";

import { AddEndpointModal } from "app/presentationLayer/main/permissions/endpoints/add-endpoint-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PlusSvg } from "../../../../../assets/svg";
import "./styles.scss";

const { SubMenu } = Menu;


export interface IAddEndpointModalProps {
  visible: boolean;
  appRouteId?: number | null;
  parent?: any;
}

export const PermissionEndpoints = props => {
  const $appRoutes = useStore(effector.stores.$appRoutes);
  const $createAppRoute = useStore(effector.stores.$createAppRoute);
  const $updateAppRoute = useStore(effector.stores.$updateAppRoute);
  const $deleteAppRoute = useStore(effector.stores.$deleteAppRoute);

  const { data: appRoutes, loading: appRoutesLoading } = $appRoutes;

  const [ addEndpointModalProps, setAddEndpointModalProps ] = useState<any>({
    visible: false,
    shouldRender: false,
    parentId: null,
    appRouteId: null,
  });

  useEffect(() => {
    effector.effects.getAppRoutesEffect({});
  }, []);

  useEffect(() => {
    if ($createAppRoute.success) {
      effector.effects.getAppRoutesEffect({});
    }

    if ($updateAppRoute.success) {
      effector.effects.getAppRoutesEffect({});
    }

    if ($deleteAppRoute.success) {
      effector.events.resetDeleteAppRouteEvent();
      notification['success']({
        message: "Эндпоинт удален",
      });

      effector.effects.getAppRoutesEffect({});
    }
  }, [ $createAppRoute.success, $updateAppRoute.success, $deleteAppRoute.success ]);


  const onAddAppRouteClick = (event, parent = undefined) => {
    event.stopPropagation();

    setAddEndpointModalProps({ visible: true, shouldRender: true, appRouteId: null, parent });
  };

  const onEditAppRouteClick = (event, appRouteId) => {
    event.stopPropagation();

    setAddEndpointModalProps({ visible: true, shouldRender: true, appRouteId });
  };

  const onDeleteAppRouteClick = (event: any, appRouteId) => {
    event.stopPropagation();
    effector.effects.deleteAppRouteEffect(appRouteId);
  };

  const getActionButton = (item) => (
    <div className="endpoints__tree__item__actions">
      <Button
        type="primary"
        shape="circle"
        icon={<PlusSvg />}
        onClick={(e) => onAddAppRouteClick(e, item)}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={(e) => onEditAppRouteClick(e, item.id)}
      />
      <Popconfirm
        title="Вы уверены?"
        onConfirm={(event) => onDeleteAppRouteClick(event, item.id)}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="primary"
          shape="circle"
          danger
          loading={$deleteAppRoute.loading}
          icon={<FontAwesomeIcon icon={faTrashAlt} />}
          onClick={(event) => event.stopPropagation()}
        />
      </Popconfirm>
    </div>
  );

  const getItem = (item) => {
    if (item.subordinates && item.subordinates.length) {
      return (
        <SubMenu
          key={item.id}
          title={(<>
            {item.menuName}
            {getActionButton(item)}
          </>)}
        >
          {item.subordinates.map((subItem) => getItem(subItem))}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={item.id}>
        {item.menuName}
        {getActionButton(item)}

      </Menu.Item>
    );
  };

  return (
    <Card className="endpoints" fullHeight={true}>
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Эндпоинты</h1>
          </div>
          <div>
            <Button type="primary" onClick={onAddAppRouteClick}>Добавить</Button>
          </div>
        </div>

        <div className="endpoints__tree-wr">
          {!!appRoutes.length
            ? (<Menu mode="inline" className="endpoints__tree">
              {appRoutes.map((item) => getItem(item))}
            </Menu>)
            : (<div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>)
          }
          {appRoutesLoading && <div className="abs-loader">
            <Spin />
          </div>}
        </div>
      </div>
      {addEndpointModalProps.shouldRender && <AddEndpointModal
        modalProps={addEndpointModalProps}
        setModalProps={setAddEndpointModalProps}
      />}
    </Card>
  );
};
