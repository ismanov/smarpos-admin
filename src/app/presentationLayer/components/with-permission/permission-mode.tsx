import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, notification, Popconfirm } from "antd";

import effector from "app/presentationLayer/effects/permissions";
import Loading from "app/presentationLayer/components/loading";
import "./permission-mode.scss"


export const PermissionsModePopup = () => {
  const $permissionsMode = useStore(effector.stores.$permissionsMode);
  const $userPermissions = useStore(effector.stores.$userPermissions);
  const $appRoutes = useStore(effector.stores.$appRoutes);
  const $addPermissions = useStore(effector.stores.$addPermissions);

  const { user, permissions } = $permissionsMode;
  const { loading: userPermissionsLoading, data: userPermissions } = $userPermissions;
  const { data: appRoutes } = $appRoutes;

  useEffect(() => {
    if (user) {
      if (!appRoutes.length) {
        effector.effects.getAppRoutesEffect({});
      }

      effector.effects.getUserPermissionsEffect(user.id);
    }

    return () => {
      effector.events.resetUserPermissions();
    }
  }, [user]);


  useEffect(() => {
    if ($addPermissions.success) {
      notification['success']({
        message: "Права добавлены",
      });
      effector.events.resetAddPermissions();
      effector.events.resetPermissionsMode();
    }
  }, [$addPermissions.success]);

  if (!user) {
    return null;
  }

  const addPermissionsClick = () => {
    effector.effects.addPermissionsEffect({ id: user.id, permissions: Object.keys(permissions) });
  };

  return (
    <React.Fragment>
      <div className="permission-mode">
        {userPermissions && <div className="permission-mode__inner">
          Режим установки прав для &nbsp;
          <strong>{user.fullName.firstName} {user.fullName.lastName}</strong>
          <div className="permission-mode__btns">
            <Popconfirm
              placement="topRight"
              title="Выбранные права будут потеряны. Вы уверены, что хотите отменить?"
              onConfirm={() => effector.events.resetPermissionsMode()}
            >
              <Button type="primary" danger>Отменить</Button>
            </Popconfirm>
            <Button className="btn-success" onClick={addPermissionsClick}>Сохранить</Button>
          </div>
        </div>}
        {(userPermissionsLoading) && (
          <div className="permission-mode__loader">
            <Loading show={true}/>
          </div>
        )}
      </div>
    </React.Fragment>
  )
};