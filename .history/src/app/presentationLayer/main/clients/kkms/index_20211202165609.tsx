import React, { useEffect, useCallback, useState } from "react";
import { useStore } from "effector-react";
import effector from "app/presentationLayer/effects/clients/kkms";

import Card from "app/presentationLayer/components/card";
import { KkmListTable } from "app/presentationLayer/main/kkm/kkm-list-table";
import { Button } from "antd";
import commonEffector from "app/presentationLayer/effects/common";
import { AddKKMModal } from "../../kkm/add-kkm-modal";

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Модель",
    dataIndex: "model",
  },
  {
    title: "Серийний номер",
    dataIndex: "serialNumber",
  },
  {
    title: "Филиал",
    dataIndex: "branchName",
  },
  {
    title: "Адрес филиала",
    dataIndex: "branchAddress",
  },
  {
    title: "",
    dataIndex: "actions",
  },
];

export const Kkms = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;
  const $kkmsList = useStore(effector.stores.$kkmsList);
  const $kkmsFilter = useStore(effector.stores.$kkmsFilter);
  const $createAndUpdateTerminalInfo = useStore(
    commonEffector.stores.$createAndUpdateTerminalInfo
  );
  const [addUserModalProps, setAddUserModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const getList = useCallback(() => {
    effector.effects.fetchKkmsListEffect({ companyId, ...$kkmsFilter });
  }, [companyId, $kkmsFilter]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if ($createAndUpdateTerminalInfo.success) {
      effector.effects.fetchKkmsListEffect({ companyId, ...$kkmsFilter });
    }
  }, [$createAndUpdateTerminalInfo.success]);

  const onFilterChange = (fields) => {
    effector.events.updateKkmsFilter({ ...$kkmsFilter, page: 0, ...fields });
  };

  // const onAddUserClick = () => {
  //   setAddUserModalProps({ visible: true, shouldRender: true });
  // };

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>ККМ</h1>
          </div>
          {/* <Button onClick={onAddUserClick} type="primary">
            Добавить
          </Button> */}
        </div>
        <KkmListTable
          $kkmList={$kkmsList}
          columns={columns}
          onFilterChange={onFilterChange}
          updateList={getList}
          fromCompany={true}
        />
      </div>
      {addUserModalProps.shouldRender && (
        <AddKKMModal
          modalProps={addUserModalProps}
          setModalProps={setAddUserModalProps}
          fromCompany={true}
          companyId={companyId}
          {...props}
        />
      )}
    </Card>
  );
};
