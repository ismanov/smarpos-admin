import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Tooltip,
  notification,
  Popover,
  Popconfirm,
} from "antd";
import Card from "app/presentationLayer/components/card";
import cn from "classnames";
import effector from "app/presentationLayer/effects/clients";
import catalogEffector from "app/presentationLayer/effects/clients/catalog";

import { useStore } from "effector-react";
import Loading from "app/presentationLayer/components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronRight,
  faSync,
  faCloudUploadAlt,
  faCloudDownloadAlt,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import Repository from "app/businessLogicLayer/repo";
import FileDownload from "js-file-download";
import { AddCategoryPopover } from "app/presentationLayer/main/clients/catalog/add-category";
import { Products } from "app/presentationLayer/main/clients/catalog/products";
import { AddEditProductModal } from "app/presentationLayer/main/clients/catalog/add-edit-product-modal";
import { SyncCatalogModal } from "app/presentationLayer/main/clients/catalog/sync-catalog-modal";
import "./styles.scss";

const { Option } = Select;

const checkForSearch = (text, search) => {
  if (!search) return false;

  return text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
};

const isContainsTheKeyword = (category, keyword) => {
  if (checkForSearch(category.name, keyword)) {
    return true;
  }

  for (let i = 0; i < category.children.length; i++) {
    let child = category.children[i];
    if (
      checkForSearch(child.name, keyword) ||
      (child.children.length > 0 && isContainsTheKeyword(child, keyword))
    ) {
      return true;
    }
  }
  return false;
};

const filterCatalog = (catalog, keyword) => {
  if (catalog.length !== 0) {
    let result = [];
    catalog.forEach((item) => {
      if (isContainsTheKeyword(item, keyword)) {
        // @ts-ignore
        result.push(item);
      }
    });
    return result;
  } else {
    return [];
  }
};

export default (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $catalog = useStore(catalogEffector.stores.$catalog);
  const $catalogFilter = useStore(catalogEffector.stores.$catalogFilter);
  const $createCatalogProduct = useStore(
    catalogEffector.stores.$createCatalogProduct
  );
  const $deleteCategory = useStore(catalogEffector.stores.$deleteCategory);

  const { data: catalog, loading: catalogLoading } = $catalog;
  const [filteredCatalog, setFilteredCatalog] = useState([]);

  const [openCatalogs, setOpenCatalogs] = useState<Array<number>>([]);

  const [search, setSearch] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [uploadCategoryId, setUploadCategoryId] = useState<number | undefined>(
    undefined
  );

  const [addEditProductModalProps, setAddEditProductModalProps] = useState({
    visible: false,
    shouldRender: false,
    categoryId: null,
    productId: null,
  });

  const [syncCatalogModalProps, setSyncCatalogModalProps] = useState({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    catalogEffector.effects.fetchCatalogEffect($catalogFilter);
  }, [$catalogFilter]);

  useEffect(() => {
    if (catalog) {
      if (search) {
        // @ts-ignore
        const newFilteredCatalog = filterCatalog([...catalog], search);
        const openedIds = addToOpenCatalogs(newFilteredCatalog);
        setFilteredCatalog(newFilteredCatalog);
        setOpenCatalogs(openedIds);
      } else {
        // @ts-ignore
        setFilteredCatalog([...catalog]);
      }
    } else {
      setFilteredCatalog([]);
    }
  }, [catalog, search]);

  useEffect(() => {
    if ($createCatalogProduct.success) {
      catalogEffector.effects.fetchCatalogEffect({
        branchId: $catalogFilter.branchId,
      });
    }
  }, [$createCatalogProduct.success]);

  useEffect(() => {
    if ($deleteCategory.success) {
      notification["info"]({
        message: "Процесс может занять около минуты",
      });
      catalogEffector.events.resetDeleteCategoryEvent();
    }
  }, [$deleteCategory.success]);

  const onSyncCatalogClick = () => {
    setSyncCatalogModalProps({ visible: true, shouldRender: true });
  };

  const onUploadTemplateClick = (id) => {
    let e = document.getElementById("file");
    // @ts-ignore
    e.click();
    setUploadCategoryId(id);
  };

  const onFilterChange = (fields) => {
    catalogEffector.events.updateCatalogFilter({
      ...$catalogFilter,
      page: 0,
      ...fields,
    });
  };

  const onBranchChange = (branchId) => {
    onFilterChange({ branchId });

    if (!branchId) {
      setSelectedCategory(null);
    }
  };

  const addToOpenCatalogs = (catalog, ids = []) => {
    catalog.forEach((item) => {
      if (item.children && !!item.children.length) {
        // @ts-ignore
        ids.push(item.id);
        addToOpenCatalogs(item.children, ids);
      }
    });

    return ids;
  };

  const openCategories = (item, parents: number[]) => {
    let newOpenCatalogs = [...openCatalogs];

    if (newOpenCatalogs.indexOf(item.id) >= 0) {
      newOpenCatalogs.splice(newOpenCatalogs.indexOf(item.id), 1);
    } else {
      newOpenCatalogs = [item.id, ...parents];
    }

    setOpenCatalogs(newOpenCatalogs);
  };

  const onCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const afterCategoryCreated = () => {
    catalogEffector.effects.fetchCatalogEffect({
      branchId: $catalogFilter.branchId,
    });
  };

  const onAddProductClick = (categoryId) => {
    setAddEditProductModalProps({
      visible: true,
      shouldRender: true,
      categoryId,
      productId: null,
    });
  };

  const onDownloadTemplateClick = (categoryId) => {
    Repository.client
      .downloadTemplate({ categoryId })
      .then((response) => {
        FileDownload(response, "product_list_template.xlsx");
      })
      .catch((error) => {});
  };

  const onEditProductClick = (productId) => {
    setAddEditProductModalProps({
      visible: true,
      shouldRender: true,
      productId,
      categoryId: null,
    });
  };

  const categoryItemActions = (item) => {
    return (
      <div>
        <div className="custom__popover__item">
          <AddCategoryPopover
            agreementId={props.location?.state?.agreementId}
            branchId={$catalogFilter.branchId}
            callBack={afterCategoryCreated}
            parentId={item.id}
          >
            <Button>Добавить группу</Button>
          </AddCategoryPopover>
        </div>
        <div className="custom__popover__item">
          <Button onClick={() => onAddProductClick(item.id)}>
            Добавить товар
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button onClick={() => onDownloadTemplateClick(item.id)}>
            Скачать шаблон
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button onClick={() => onUploadTemplateClick(item.id)}>
            Загрузить шаблон
          </Button>
        </div>
        <div className="custom__popover__item">
          <Popconfirm
            placement="topRight"
            title="Вы действительно хотите удалить категорию?"
            onConfirm={() =>
              catalogEffector.effects.deleteCategoryEffect({
                params: { branchId: $catalogFilter.branchId },
                data: { ...item, branchId: $catalogFilter.branchId },
              })
            }
          >
            <Button type="primary" loading={$deleteCategory.loading} danger>
              Удалить
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const getItem = (item, parents: number[] = []) => {
    const hasChild = item.children && !!item.children.length;
    const active = openCatalogs.indexOf(item.id) >= 0;

    return (
      <li key={item.id} className="CP__catalog__tree-item">
        <div
          className={cn("CP__catalog__tree-item-inner", {
            ["active"]: active,
            ["has-child"]: hasChild,
          })}
        >
          <div className="CP__catalog__tree-item-icon">
            <span>
              <Button
                onClick={() => openCategories(item, parents)}
                type="ghost"
                shape="circle"
                icon={<FontAwesomeIcon icon={faChevronRight} />}
              />
            </span>
          </div>
          <div
            className={cn("CP__catalog__tree-item-text", {
              ["CP__catalog__tree-item-text-strong"]: item.section,
              light: checkForSearch(item.name, search),
              selected: selectedCategory && selectedCategory.id === item.id,
            })}
            onClick={() => onCategoryClick(item)}
          >
            {item.name}
          </div>
          <div className="CP__catalog__tree-item-count">
            {item.productCount} шт.
          </div>
          <div className="CP__catalog__tree-item-menu">
            <Popover
              overlayClassName="custom__popover"
              placement="bottomRight"
              trigger="click"
              content={categoryItemActions(item)}
            >
              <Button
                type="ghost"
                icon={<FontAwesomeIcon icon={faEllipsisV} />}
              />
            </Popover>
          </div>
        </div>
        {hasChild && (
          <ul
            className={cn("CP__catalog__sub-tree", {
              ["CP__catalog__sub-tree-opened"]: active,
            })}
          >
            {item.children.map((subItem) =>
              getItem(subItem, [...parents, item.id])
            )}
          </ul>
        )}
      </li>
    );
  };

  const renderCatalog = () => {
    if (catalogLoading) {
      return (
        <div className="CP__catalog__tree-loader">
          <Loading show={true} />
        </div>
      );
    }

    if (filteredCatalog.length) {
      return (
        <ul className="CP__catalog__tree">
          {filteredCatalog.map((item) => getItem(item))}
        </ul>
      );
    } else {
      return <div>Каталог пуст</div>;
    }
  };

  return (
    <div className="CP__catalog">
      <div className="custom-content__header">
        <div className="custom-content__header__left-inner">
          <h1>Каталог</h1>
        </div>
        {$catalogFilter.branchId && (
          <div className="CP__catalog__header__buttons">
            <Tooltip placement="bottom" title="Синхронизация каталога">
              <Button
                onClick={() => onSyncCatalogClick()}
                type="primary"
                shape="circle"
                icon={<FontAwesomeIcon icon={faSync} />}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Загрузить шаблон">
              <Button
                onClick={() => onUploadTemplateClick(undefined)}
                type="primary"
                shape="circle"
                icon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Скачать шаблон">
              <Button
                onClick={() => {
                  Repository.client
                    .downloadTemplate({})
                    .then((response) => {
                      FileDownload(response, "product_list_template.xlsx");
                    })
                    .catch((error) => {});
                }}
                type="primary"
                shape="circle"
                icon={<FontAwesomeIcon icon={faCloudDownloadAlt} />}
              />
            </Tooltip>
            <input
              id="file"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => {
                // @ts-ignore
                e?.target?.files[0] &&
                  Repository.client
                    .importProductsRef(e.target.files[0] || "", {
                      categoryId: uploadCategoryId,
                      branchId: $catalogFilter.branchId,
                    })
                    .then((response) => {
                      if (response.status === 204) {
                        notification["success"]({
                          message: "Успешно загружено",
                        });
                        if ($catalogFilter.branchId) {
                          catalogEffector.effects.fetchCatalogEffect({
                            branchId: $catalogFilter.branchId,
                          });
                        }
                        setUploadCategoryId(undefined);
                      } else if (response.status === 200) {
                        notification["error"]({
                          message: "Ошибка при загрузки",
                        });
                        FileDownload(
                          response.data,
                          "product_list_import_error.xlsx"
                        );
                      }
                    })
                    .catch((error) => {
                      setUploadCategoryId(undefined);
                    });
              }}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>

      <div className="CP__catalog__content__row">
        <Card className="CP__catalog__categories">
          <div className="filter-block CP__catalog__categories__filter">
            <div className="filter-block__item">
              <Select
                className="custom-select"
                loading={$branchItems.loading}
                placeholder="Выберите филиал"
                value={$catalogFilter.branchId}
                onChange={onBranchChange}
                allowClear
              >
                {$branchItems.data.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-block__item">
              <div className="filter-block__search">
                <div className="filter-block__search__icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <Input
                  className="custom-input"
                  value={search || undefined}
                  placeholder="Поиск"
                  disabled={!$catalogFilter.branchId}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <div className="filter-block__item no-width">
              <AddCategoryPopover
                agreementId={props.location?.state?.agreementId}
                branchId={$catalogFilter.branchId}
                callBack={afterCategoryCreated}
              >
                <Tooltip placement="bottom" title="Добавить категорию">
                  <Button type="primary" disabled={!$catalogFilter.branchId}>
                    Добавить
                  </Button>
                </Tooltip>
              </AddCategoryPopover>
            </div>
          </div>
          {$catalogFilter.branchId && (
            <div className="CP__catalog__tree-wr">{renderCatalog()}</div>
          )}
        </Card>
        <Products
          companyId={companyId}
          branchId={$catalogFilter.branchId || undefined}
          selectedCategory={selectedCategory}
          onEditClick={onEditProductClick}
          addEditProductModalProps={addEditProductModalProps}
        />
      </div>
      {addEditProductModalProps.shouldRender && (
        <AddEditProductModal
          agreementId={props.location?.state?.agreementId}
          branchId={$catalogFilter.branchId}
          modalProps={addEditProductModalProps}
          setModalProps={setAddEditProductModalProps}
        />
      )}
      {syncCatalogModalProps.shouldRender && (
        <SyncCatalogModal
          branchId={$catalogFilter.branchId}
          modalProps={syncCatalogModalProps}
          setModalProps={setSyncCatalogModalProps}
        />
      )}
    </div>
  );
};
