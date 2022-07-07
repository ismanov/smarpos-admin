import React, {useState} from "react";
import { bindPresenter } from "app/hocs/bindPresenter";
// import {Product} from "app/businessLogicLayer/models/Product";
import {Category} from "app/businessLogicLayer/models/Category";
import {SingleCatalogPresenter} from "app/businessLogicLayer/presenters/SingleCatalogPresenter";
//@ts-ignore
import styles from './single.module.css';
import Card from 'app/presentationLayer/components/card';
import Collapse from 'react-css-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faInfoCircle, faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames';
import Popup from "reactjs-popup";
import {Product} from "app/businessLogicLayer/models/Product";
import Loading from "app/presentationLayer/components/loading";
import {
    MAN_SINGLE_CAT_DOWNLOAD,
    MAN_SINGLE_CAT_UPLOAD,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

export type SingleCatalogState = {
    categories?: Array<Category>,
    isLoading?: boolean,
    isProductsLoading?: boolean,
    products?: Array<Product>
};

let nesting = 1;

export default bindPresenter<SingleCatalogState, SingleCatalogPresenter>(SingleCatalogPresenter, ({model, presenter}) => {

    const [ids, setIds] = useState<Array<number | undefined>>([]);
    const [selected, setSelected] = useState();
    const [popupOpen, setPopupOpen] = useState();
    const [selectedCategoryId, setSelectedCategoryId] = useState();

    const renderCatalog = () => {
        if (!model.categories || model.categories.length === 0) {
            return <div className={styles.empty_catalog}>
                Каталог пустой!
            </div>
        } else {
            return renderItems(model.categories)
        }
    };

    const renderItems = (categories: Array<Category>) => {
        return categories.map(c => {
            // @ts-ignore
          let mainItem = (
                <div
                    className={styles.catalog_item}
                >
                    {
                        (() => {
                            if (c.children && c.children.length) {
                                return (
                                    <div
                                        className={cn(styles.open_arrow, ids.indexOf(c.id) >= 0 ? styles.open : undefined)}
                                        onClick={() => {
                                            let i = [...ids];
                                            if (i.indexOf(c.id) >= 0) {
                                                i.splice(i.indexOf(c.id), 1)
                                            } else {
                                                i.push(c.id)
                                            }
                                            setIds(i);
                                        }}
                                        style={{marginLeft: nesting*15}}
                                    >
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </div>
                                )
                            } else {
                                return undefined
                            }
                        })()
                    }
                    <div
                      // @ts-ignore
                        style={{marginLeft: c.children && c.children.length ? 15 : nesting*15+23, color: selected && selected.id === c.id ? '#009f3c' : "#4d4d4d", flexGrow: 1}}
                        onClick={() => {
                          // @ts-ignore
                            setSelected(c);
                            presenter.selectCatalog(c.id || 0)
                        }}
                    >
                        {`${c.name} - (${c.productCount} шт.)`}
                    </div>
                    <Popup
                        trigger={
                            <div style={{marginRight: 20}}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                        }
                        onOpen={() => {
                          // @ts-ignore
                            setPopupOpen(c.id)
                        }}
                        open={popupOpen === c.id}
                        position="bottom center"
                    >
                        <div>
                            <WithPermission
                              annotation={MAN_SINGLE_CAT_DOWNLOAD}
                              placement={{ right: -25, top: -2, bottom: 0 }}
                              render={(permissionProps) => (
                                <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    height: 35,
                                    fontSize: 15,
                                    width: 200
                                }}
                                     onClick={() => {
                                         presenter.downloadTemplate(c.id);
                                         setPopupOpen(undefined)
                                     }}
                                     {...permissionProps}
                                >
                                    Скачать шаблон
                                </div>
                                <div style={{height: 1, backgroundColor: '#eee'}} />
                                </>
                              )} />
                            <WithPermission
                              annotation={MAN_SINGLE_CAT_UPLOAD}
                              placement={{ right: -25, top: -2, bottom: 0 }}
                              render={(permissionProps) => (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    height: 35,
                                    fontSize: 15,
                                    width: 200
                                }}
                                     onClick={() => {
                                       // @ts-ignore
                                         setSelectedCategoryId(c.id);
                                         let e = document.getElementById('file');
                                         e && e.click();
                                         setPopupOpen(undefined)
                                     }}
                                     {...permissionProps}
                                >
                                    Загрузить шаблон
                                </div>
                              )} />
                        </div>
                    </Popup>

                </div>
            );
            let children;
            if (c.children && c.children.length) {
                nesting++;
                children = (
                    <Collapse
                        isOpen={ids.indexOf(c.id) >= 0}
                    >
                        {
                            c.children.map(ch => {
                                if (!ch.children || !ch.children.length) {
                                    return (
                                        <div
                                            className={styles.catalog_item_child}

                                        >
                                            <div
                                              // @ts-ignore
                                                style={{marginLeft: nesting*15 + 23, cursor: 'pointer', color: selected && selected.id === ch.id ? '#009f3c' : "#4d4d4d", flexGrow: 1}}
                                                onClick={() => {
                                                  // @ts-ignore
                                                    setSelected(ch)
                                                    presenter.selectCatalog(ch.id || 0)
                                                }}
                                            >
                                                {`${ch.name} - (${ch.productCount})`}
                                            </div>
                                            <Popup
                                                trigger={
                                                    <div style={{marginRight: 20}}>
                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                    </div>
                                                }
                                                onOpen={() => {
                                                  // @ts-ignore
                                                    setPopupOpen(ch.id)
                                                }}
                                                open={popupOpen === ch.id}
                                                position="bottom center"
                                            >
                                                <div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        height: 35,
                                                        fontSize: 15,
                                                        width: 200
                                                    }}
                                                         onClick={() => {
                                                             presenter.downloadTemplate(ch.id);
                                                             setPopupOpen(undefined)
                                                         }}
                                                    >
                                                        Скачать шаблон
                                                    </div>
                                                    <div style={{height: 1, backgroundColor: '#eee'}} />
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        height: 35,
                                                        fontSize: 15,
                                                        width: 200
                                                    }}
                                                         onClick={() => {
                                                           // @ts-ignore
                                                             setSelectedCategoryId(ch.id);
                                                             let e = document.getElementById('file');
                                                             e && e.click();
                                                             setPopupOpen(undefined)
                                                         }}
                                                    >
                                                        Загрузить шаблон
                                                    </div>
                                                </div>
                                            </Popup>

                                        </div>
                                    )
                                } else {
                                    return <div>
                                        <div
                                            className={styles.catalog_item}
                                        >
                                            <div
                                                className={cn(styles.open_arrow, ids.indexOf(ch.id) >= 0 ? styles.open : undefined)}
                                                style={{marginLeft: nesting*15}}
                                                onClick={() => {
                                                    let i = [...ids];
                                                    if (i.indexOf(ch.id) >= 0) {
                                                        i.splice(i.indexOf(ch.id), 1)
                                                    } else {
                                                        i.push(ch.id)
                                                    }
                                                    setIds(i);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faAngleRight} />
                                            </div>
                                            <div
                                              // @ts-ignore
                                                style={{marginLeft: 15, color: selected && selected.id === ch.id ? '#009f3c' : "#4d4d4d", flexGrow: 1}}
                                                onClick={() => {
                                                  // @ts-ignore
                                                    setSelected(ch)
                                                    presenter.selectCatalog(ch.id || 0)
                                                }}
                                            >
                                                {`${ch.name} - (${ch.productCount} шт.)`}
                                            </div>
                                            <Popup
                                                trigger={
                                                    <div style={{marginRight: 20}}>
                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                    </div>
                                                }
                                                onOpen={() => {
                                                  // @ts-ignore
                                                    setPopupOpen(ch.id)
                                                }}
                                                open={popupOpen === ch.id}
                                                position="bottom center"
                                            >
                                                <div

                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        height: 35,
                                                        fontSize: 15,
                                                        width: 200
                                                    }}
                                                         onClick={() => {
                                                             presenter.downloadTemplate(ch.id);
                                                             setPopupOpen(undefined)
                                                         }}
                                                    >
                                                        Скачать шаблон
                                                    </div>
                                                    <div style={{height: 1, backgroundColor: '#eee'}} />
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        height: 35,
                                                        fontSize: 15,
                                                        width: 200
                                                    }}
                                                         onClick={() => {
                                                           // @ts-ignore
                                                             setSelectedCategoryId(ch.id);
                                                             let e = document.getElementById('file');
                                                             e && e.click();
                                                             setPopupOpen(undefined)
                                                         }}
                                                    >
                                                        Загрузить шаблон
                                                    </div>
                                                </div>
                                            </Popup>

                                        </div>
                                        {
                                            (() => {
                                                nesting++;
                                                let o = <Collapse
                                                    isOpen={ids.indexOf(ch.id) >= 0}
                                                >
                                                    {renderItems(ch.children || [])}
                                                </Collapse>;
                                                nesting--;
                                                return o
                                            })()
                                        }

                                    </div>
                                }
                            })
                        }
                    </Collapse>
                );
                nesting--;
            }
            return (
                <div>
                    {mainItem}
                    {children}
                </div>
            )
        })
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Единый каталог
                </div>
                <div className={styles.header_buttons}>
                    <WithPermission
                      annotation={MAN_SINGLE_CAT_DOWNLOAD}
                      placement={{ right: -25, top: -2, bottom: 0 }}
                      render={(permissionProps) => (
                        <span
                            style={{color: '#009f3c', cursor: 'pointer'}}
                            onClick={() => {
                                presenter.downloadTemplate()
                            }}
                            {...permissionProps}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </span>
                      )} />
                    <WithPermission
                      annotation={MAN_SINGLE_CAT_UPLOAD}
                      placement={{ right: -25, top: -2, bottom: 0 }}
                      render={(permissionProps) => (
                        <span
                            style={{marginLeft: 25, color: '#009f3c', cursor: 'pointer'}}
                            onClick={() => {
                                setSelectedCategoryId(undefined);
                                let e = document.getElementById('file');
                                e && e.click();
                            }}
                            {...permissionProps}
                        >
                            <FontAwesomeIcon icon={faUpload} />
                        </span>
                    )} />
                </div>
            </div>
            <input
                id="file"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e) => {
              // @ts-ignore
                presenter.uploadTemplate(e.target.files ? e.target.files[0] : undefined, selectedCategoryId, selected? selected.id : undefined)
            }} style={{display: 'none'}}/>
            <Card className={styles.content}>
                {model.isLoading ? (
                    <div className={cn(styles.catalog_container, styles.centered)}>
                        <Loading show={model.isLoading} />
                    </div>
                ) : (
                    <div className={styles.catalog_container}>
                        {renderCatalog()}
                    </div>
                )}

                <div className={styles.products_container}>
                    <div className={styles.products_header}>
                        {
                          // @ts-ignore
                          `${selected ? selected.name : 'Ничего не выбрано'} - (${selected ? selected.productCount : 0} шт)`
                        }
                    </div>
                    {
                        model.isProductsLoading ? (
                            <div className={cn(styles.products, styles.centered)}>
                                <Loading show={model.isProductsLoading} />
                            </div>
                        ) : (
                            <div className={styles.products}>
                                {
                                    model.products && model.products.map((p, index) => {
                                        return (
                                            <div>
                                                <div className={styles.product_item}>
                                                    {index+1}. <span style={{marginLeft: 8, width: '100%'}}> {p.name} </span> <span> {p.description} </span>
                                                </div>
                                                <div className={styles.divider} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </Card>
        </div>
    )
});

