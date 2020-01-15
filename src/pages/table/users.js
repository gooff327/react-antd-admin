import React, {useEffect, useState} from 'react'
import api from "../../request";
import {Table, Switch, Button, message} from "antd";
import confirm from "antd/es/modal/confirm";
import './users.scss'
export default function () {
    const [columnHeader, setColumnHeader] = useState(true);
    const [bordered, setBordered] = useState(true);
    const [footer, setFooter] = useState(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({total: 200});
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            render: name => `${name.first} ${name.last}`,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
        },
        {
            title: 'Address',
            children: [
                {
                    title: 'City',
                    dataIndex: 'location.city',
                    key: 'city',
                },
                {
                    title: 'State',
                    dataIndex: 'location.state',
                    key: 'state',
                },
            ],
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Age',
            dataIndex: 'dob.age',
        },
        {
            title: 'Phone',
            dataIndex: 'phone'
        }
    ];
    function fetch (params = {}) {
        api.permission.fetchUserList({
            results: 10,
            ...params
        }).then(res => {
            setTableData(res.data.results);
            setLoading(false);
        })
    }
    function onSelectChange (keys) {
        setSelectedRowKeys(keys)
    }
    function handleTableChange(pagination, filters, sorter) {
        setLoading(true);
        setPagination (pagination);
        fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        })
    }
    function confirmDelete () {
        confirm({
            title: 'Delete Selected items ?',
            onOk: handleDelete,
        })
    }
    function handleDelete () {
        setTableData(tableData.filter(item => !selectedRowKeys.includes(item.login.uuid)));
        message.success('Deleted !')
    }

    useEffect(() => {
        fetch();
    },[]);

    return(
        <section className="table-wrapper">
            <div className="toolbar">
                <strong>Bordered <Switch defaultChecked onChange={() => {setBordered(!bordered)}}/></strong>
                <strong>Loading <Switch onChange={() => {setLoading(!loading)}}/></strong>
                <strong>Header <Switch onChange={() => {setColumnHeader(!columnHeader)}}/></strong>
                <strong>Footer <Switch onChange={() => {footer === undefined ? setFooter(() => () => 'Footer') : setFooter(undefined)}}/></strong>
                <Button disabled={selectedRowKeys.length < 1} icon="delete" type="danger" onClick={confirmDelete}/>
            </div>
            <br/>
            <Table rowSelection={{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}}
                   dataSource={tableData}
                   columns={columns}
                   showHeader={columnHeader}
                   footer={footer}
                   bordered={bordered}
                   loading={loading}
                   pagination={pagination}
                   rowKey={record => record.login.uuid}
                   onChange={handleTableChange}
            />
        </section>
    )

}
