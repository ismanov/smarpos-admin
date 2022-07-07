import React, {useState, useEffect} from 'react';
import Card from "app/presentationLayer/components/card";
import { 
    Table,     
    Button,      
    Row, 
    Col,
    Modal,
    Select,
    InputNumber,  
    notification,    
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, } from "@fortawesome/free-solid-svg-icons";
import 'app/presentationLayer/main/clients/dataEntry/style.scss';
import effector from 'app/presentationLayer/effects/dataEntry';
import { useStore } from 'effector-react'
import { DataEntryModelItem, } from 'app/businessLogicLayer/models/DataEntryModel';

const { Option } = Select;

type ModalColumnsType = DataEntryModelItem & {editing: boolean, isStatic: boolean};

const columns = (onEdit: (number) => void, onRemove: (number) => void) => [
    {
      title: "#",
      dataIndex: 'num',
      width: 50,
      render: (_, __, index) => index + 1
    },    
    {
      title: 'Компания',
      dataIndex: 'company',
      render: (row: {name: string}) => row.name || '-'
    },
    {
      title: "Статус",
      dataIndex: 'status',
    },
    {
        title: "Операция",
        width: 150,
        render: (row) => {
            if (row.status === 'DRAFT') {
                return (
                    <>
                        <Button 
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={() => { onEdit(row.id); }}
                            />
                        <Button 
                            icon={<FontAwesomeIcon icon={faTrash} 
                            onClick={() => { onRemove(row.id); }} />} 
                            style={{marginLeft: 10}} 
                            />                        
                    </>
                )
            } else {
                return null
            }
        }
    },
];

const DataEntry = props => {

    const { effects, events } = effector;
    const store = useStore(effector.store);
    const [showModal, setShowModal] = useState<boolean>(false);    
    const [items, setItems] = useState<Array<ModalColumnsType>>([{ isStatic: true, editing: false }]);  
    const [editKey, setEditKey] = useState<number | undefined>(undefined);
    const [removingKey, setRemovingKey] = useState<number | undefined>(undefined);

    useEffect(() => {
        const { match } = props;
        const companyId = match.params.companyId;
        effects.fetchBranchList({ companyId });
        effects.fetchDataEntryTypes();
        effects.fetchDataEntryList({ page: 0, size: 20 });
    }, []);    
    
    useEffect(() => {        
        if (editKey !== undefined) {
            let map: DataEntryModelItem[] = store.itemsMap?.get(editKey) || [];
            let c = [...items];
            map?.forEach(i => {
                c.push({
                    isStatic: false,
                    editing: false,
                    ...i                    
                });                                
            })
            setItems([...c]);
            setShowModal(true);
        }
        if (store.error) {            
            notification.warn({
                message: store.error.message,
                duration: 3,
                onClose: () => {
                    events.resetError()
                }
            })
        }
    }, [store])

    let data = (store.data?.content ?? []).map(d => ({...d, key: d.id}));
    
    return (
        <Card> 
            <Modal 
                visible={removingKey !== undefined}
                destroyOnClose={true}
                onOk={() => {
                    effects.removeDataEntry(removingKey || 0);
                    setRemovingKey(undefined);
                }}
                onCancel={() => {
                    setRemovingKey(undefined);
                }}
                
                okText="Удалить"
                cancelText="Отмена"
            > 
                <p style={{padding: 20}}> 
                    Вы действительно хотите удалить Запись?
                </p>
            </Modal>
            <Modal 
                visible={showModal} 
                destroyOnClose={true}
                onOk={() => { 
                    if (editKey === undefined) {
                        const { match } = props;
                        const companyId = match.params.companyId;
                        if (!items.filter(f => !f.isStatic).length) {
                            notification.warning({ 
                                message: 'Список вводимых данных пуст!',
                                duration: 3
                            })
                            return
                        }
                        effects.createDataEntry({
                            company: {id: companyId},
                            items: items.filter(i => !i.isStatic).map((i): DataEntryModelItem => ({...i}))
                        })
                        setItems([]);
                        setShowModal(false);
                    } else {
                        const { match } = props;
                        const companyId = match.params.companyId;
                        if (!items.filter(f => !f.isStatic).length) {
                            notification.warning({ 
                                message: 'Список вводимых данных пуст!',
                                duration: 3
                            })
                            return
                        }
                        effects.updateDataEntry({
                            id: editKey,
                            company: {id: companyId},
                            items: items.filter(i => !i.isStatic).map((i): DataEntryModelItem => ({...i}))
                        })
                        setItems([]);
                        setShowModal(false);
                        setEditKey(undefined);
                    }
                    
                }} 
                onCancel={() => { setShowModal(false); setItems([]); setEditKey(undefined); }}
                okText="Сохранить"
                cancelText="Отменить"
                title="Создать запрос на заполнение данных"   
                width={900}             
            >
                <Table 
                    columns={[
                        {
                            title: 'Филиал',
                            render: (row: ModalColumnsType, _, index) => {
                                return row.editing || row.isStatic ? (
                                    <Select 
                                        style={{ width: '100%' }} 
                                        placeholder="Филиал"
                                        allowClear
                                        value={row.branchName}
                                        onChange={branchId => {
                                            let i = [...items];                                        
                                            let branch = store.branchList.find(b => b.id === Number(branchId));
                                            console.log('branch', branch)
                                            i[index].branchId = branch?.id;
                                            i[index].branchName = branch?.name;                                                                                
                                            setItems(i);
                                        }}>
                                        { store.branchList.map(branch => (
                                            <Option value={`${branch.id}`}>{branch.name}</Option>
                                        ))}
                                    </Select>
                                ) : row.branchName
                            }
                        },
                        {
                            title: 'Тип',
                            render: (row: ModalColumnsType, _, index) => row.editing || row.isStatic ? (
                                <Select 
                                    style={{ width: '100%' }}                             
                                    placeholder="Выберите раздел"
                                    allowClear
                                    value={row.type}
                                    onChange={type => {
                                        let i = [...items];
                                        let foundType = store.dataEntryTypes.find(t => t.description === type);
                                        i[index].typeName = foundType?.name;
                                        i[index].type = foundType?.description;
                                        setItems(i);
                                    }}
                                    >
                                    {store.dataEntryTypes.map(dataEntryType => (
                                        <Option value={`${dataEntryType.description}`}>{dataEntryType.name}</Option>
                                    ))}
                                </Select>
                            ) : row.typeName
                        },
                        {
                            title: 'Количество операций',
                            render: (row: ModalColumnsType, _, index) => row.editing || row.isStatic ? (
                                <InputNumber 
                                    placeholder="Количество"
                                    style={{width: '100%'}}
                                    value={row.count}
                                    onChange={count => {
                                        let i = [...items];                                        
                                        i[index].count = count as number;                                        
                                        setItems(i);
                                    }}                            
                                />
                            ) : row.count
                        },
                        {
                            title: 'Операция',
                            render: (row: ModalColumnsType, _, index) => 
                                row.isStatic ? <Button type="text" disabled={!row.branchId || !row.type || !row.count} onClick={() => {
                                    let i = [...items];
                                    i.unshift({...row, isStatic: false, editing: false});
                                    row.branchId = undefined;
                                    row.branchName = undefined;
                                    row.type = undefined;
                                    row.typeName = undefined;
                                    row.count = 0;
                                    row.editing = false;
                                    row.existingCount = undefined;
                                    row.isStatic = true;
                                    setItems(i);
                                }}> Сохранить </Button>  : (row.editing ? <Button type="text" onClick={() => {                                    
                                    let i = [...items];
                                    i[index] = row;
                                    i[index].editing = false;
                                    setItems(i);
                                }}> Обновить </Button> : 
                                    <div>
                                        <Button type="text" onClick={() => {
                                            let i = [...items];
                                            i[index].editing = true
                                            setItems(i);
                                        }}> Изменить </Button>
                                        <Button type="text" danger style={{marginLeft: 10}} onClick={() => {
                                            let i = [...items];
                                            i.splice(index, 1);
                                            setItems(i);
                                        }}> Удалить </Button>
                                    </div>
                                )
                        },
                    ]}
                    dataSource={items}
                    pagination={false}
                />                
            </Modal>
            <div className="CP__data_entry">                 
                <Row style={{marginTop: 10}}>
                    <Col style={{fontWeight: 'bold', fontSize: 17}}>
                        Ввод данных
                    </Col>
                </Row>
                <Row style={{marginTop: 10}} align="middle">
                    <Col md={6}>
                        <Select 
                            style={{ width: '100%' }} 
                            onChange={(value) => { 
                                events.updateFilter({...store.filters, branchId: value ? value as number : undefined})
                            }}
                            allowClear
                            placeholder="Филиал">
                            { store.branchList.map(branch => (
                                <Option value={`${branch.id}`}>{branch.name}</Option>
                            )) }
                        </Select>
                    </Col>
                    <Col md={16} />
                    <Col md={2}> 
                        <Button 
                            type="primary"
                            style={{width: '100%'}}
                            onClick={() => {
                                setShowModal(true);
                            }}
                        > Создать </Button>
                    </Col>
                </Row>
                <div className="CP__data_entry__table">
                    <Table
                        dataSource={data}
                        columns={
                            columns(
                                (editId) => {
                                    let map = store.itemsMap?.get(editId);
                                    if (!map) {
                                        setEditKey(editId);
                                        effects.fetchDataEntryById(editId)
                                    } else {
                                        let map: DataEntryModelItem[] = store.itemsMap?.get(editId) || [];
                                        let c = [...items];
                                        map?.forEach(i => {
                                            c.push({
                                                isStatic: false,
                                                editing: false,
                                                ...i                    
                                            });                                
                                        })
                                        setItems([...c]);
                                        setShowModal(true);
                                    }
                                }, 
                                (removeId) => {
                                    setRemovingKey(removeId);
                                }
                            )
                        }                        
                        loading={false}
                        expandable={{                            
                            expandedRowRender: record => {
                                let items = store.itemsMap?.get(record.key || 0) || [];
                                if (items.length === 0) {
                                    return (<div style={{padding: 20}}>Загрузка...</div>)
                                } else {
                                    return (
                                        <div style={{padding: '10px 0 10px 20px'}}>
                                            <Table 
                                                dataSource={items}
                                                columns={
                                                    [
                                                        {
                                                            title: 'Филиал',
                                                            dataIndex: 'branchName',
                                                        },
                                                        {
                                                            title: 'Операция',
                                                            dataIndex: 'type',
                                                            render: (value) => store.dataEntryTypes.find(type => type.description === value)?.name
                                                        },
                                                        {
                                                            title: 'Кол-во изпользовано',
                                                            dataIndex: 'existingCount'
                                                        },
                                                        {
                                                            title: 'Кол-во заказано',
                                                            dataIndex: 'count',
                                                        },
                                                    ]
                                                }
                                                pagination={false}
                                            />
                                        </div>
                                    )
                                }                                
                            },
                            rowExpandable: () => true,
                            onExpand: (expanded, record) => {
                                if ((record.key || 0) >= 0 && expanded && !store.itemsMap?.get(record.key || 0)) {
                                    effects.fetchDataEntryById(record.id || 0)
                                }
                            },
                        }}
                        pagination={{
                            total: store.data?.totalPages || 0,
                            pageSize: store.data?.size || 20,
                            current: store.data?.number || 1,
                            hideOnSinglePage: true,
                            pageSizeOptions: [ "50", "100", "150", "250", "500" ],
                            onChange: (page, size) => {
                                events.updateFilter({...store.filters, page, size})
                            },
                        }}
                    />
                </div>
            </div>
        </Card>
    )
};

export default DataEntry;