import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  MON_KKM_DELETE,
  MON_KKM_SYNC,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import kkmEffector from "app/presentationLayer/effects/kkm";
import {
  Table,
  Pagination,
  Button,
  Alert,
  Popover,
  Popconfirm,
  notification,
} from "antd";
import { DotsVerticalSvg } from "../../../../../assets/svg";
import { EditKKMModal } from "../edit-kkm-modal/index";

export const KkmListTable = (props) => {
  const { onFilterChange, $kkmList, columns, updateList } = props;
  const $syncKkm = useStore(kkmEffector.stores.$syncKkm);
  const $deleteKkm = useStore(kkmEffector.stores.$deleteKkm);

  const { data: kkmData, loading: kkmLoading, error: kkmError } = $kkmList;
  const {
    content: kkm,
    number: kkmPage,
    size: kkmSize,
    totalElements: kkmTotal,
  } = kkmData;

  const [menuPopoverVisibility, setMenuPopoverVisibility] = useState<
    number | null
  >(null);
  const [editModalProps, setEditModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    if ($syncKkm.success) {
      notification["success"]({
        message: "Синхронизация прошла успешно",
      });
      kkmEffector.events.resetSyncKkm();
    }

    if ($deleteKkm.success) {
      notification["success"]({
        message: "ККМ удален",
      });
      kkmEffector.events.resetDeleteKkm();

      if (updateList) {
        updateList();
      }
    }
  }, [$syncKkm.success, $deleteKkm.success]);

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };
  const onEditClick = (company) => {
    setEditModalProps({ visible: true, shouldRender: true, company });
  };

  const data = kkm.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{kkmSize * kkmPage + index + 1}</div>,
    model: item.model,
    serialNumber: item.serialNumber,
    branchName: item.branchName,
    branchAddress: item.branchAddress,
    companyName: item.companyName,
    actions: (
      <Popover
        overlayClassName="custom__popover"
        placement="bottomRight"
        trigger="click"
        visible={menuPopoverVisibility === item.id}
        onVisibleChange={(visible) =>
          setMenuPopoverVisibility(visible ? item.id : null)
        }
        content={
          <div>
            <WithPermission
              annotation={MON_KKM_SYNC}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Button
                    loading={$syncKkm.loading}
                    onClick={() => onEditClick(item)}
                    {...permissionProps}
                  >
                    Изменить филиал
                  </Button>
                </div>
              )}
            />
            <WithPermission
              annotation={MON_KKM_SYNC}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Button
                    loading={$syncKkm.loading}
                    onClick={() => kkmEffector.effects.syncKkmEffect(item.id)}
                    {...permissionProps}
                  >
                    Синхронизировать
                  </Button>
                </div>
              )}
            />
            <WithPermission
              annotation={MON_KKM_DELETE}
              render={(permissionProps) => (
                <div className="custom__popover__item">
                  <Popconfirm
                    placement="topRight"
                    title="Вы действительно хотите удалить ККМ?"
                    onConfirm={() =>
                      kkmEffector.effects.deleteKkmEffect(item.id)
                    }
                  >
                    <Button
                      loading={$deleteKkm.loading}
                      type="primary"
                      danger
                      {...permissionProps}
                    >
                      Удалить
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </div>
        }
      >
        <Button
          className="custom__popover-btn"
          type="ghost"
          icon={<DotsVerticalSvg />}
        />
      </Popover>
    ),
  }));

  return (
    <>
      {kkmError && (
        <div className="custom-content__error">
          <Alert message={kkmError.message} type="error" />
        </div>
      )}
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          dataSource={data}
          columns={columns}
          loading={kkmLoading}
          pagination={false}
        />
      </div>
      <div className="custom-pagination">
        <Pagination
          total={kkmTotal}
          pageSize={kkmSize}
          current={kkmPage + 1}
          hideOnSinglePage={true}
          pageSizeOptions={["20", "50", "100", "150", "250", "500"]}
          onChange={onChangePagination}
        />
      </div>
      {editModalProps.shouldRender && (
        <EditKKMModal
          modalProps={editModalProps}
          setModalProps={setEditModalProps}
          {...props}
        />
      )}
    </>
  );
};
