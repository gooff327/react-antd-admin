import React, {useEffect, useState} from "react";
import {generateMenus} from './actions'
import {Avatar, Badge, Breadcrumb, Icon, Layout, Menu, Popover} from 'antd';
import {withRouter} from "react-router-dom";
import {createStore} from 'redux'
import reducers from './reducers'
import './App.css'

const {Header, Sider, Content} = Layout;
const store = createStore(reducers);
const routes = store.getState().base;

function App(props) {
    let currentPaths = props.location.pathname.split('/').slice(1);
    currentPaths = currentPaths.map(i => i.replace(/^\S/, s => s.toUpperCase()));
    store.dispatch(generateMenus());
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState(currentPaths);
    useEffect(() => props.location.pathname === '/' ? props.history.push('/dashboard') : undefined, [props.history, props.location]);

    function handleLink(item) {
        const path = '/' + item.keyPath.reverse().join('/').toLowerCase();
        if (props.location.pathname === path) {
            return
        }
        props.history.push(path);
    }


    const breadcrumbs = [];

    function genBreadcrumbItem(routes) {
        routes.forEach(route => {
            if (route.hasOwnProperty('routes')) {
                currentPaths.includes(route.name) && breadcrumbs.push(route);
                genBreadcrumbItem(route.routes)
            } else {
                currentPaths.includes(route.name) && breadcrumbs.push(route)
            }
        })
    }

    genBreadcrumbItem(routes);

    function resetPermission() {

    }

    return (
        <Layout className={'container'}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={"logo"}>
                    <Icon className={"logo-icon"} type="ant-design"/>
                    {collapsed ? '' : <span>React Antd Admin</span>}
                </div>
                <Menu onClick={handleLink} theme="dark" mode="inline" selectedKeys={currentPaths.slice(-1)}
                      onOpenChange={val => setOpenKeys(val)} openKeys={openKeys} defaultSelectedKeys={['Dashboard']}>
                    {
                        store.getState().menus
                    }
                </Menu>
            </Sider>
            <Layout>
                <Header style={{background: '#fff', padding: 0}}>
                    <Icon
                        className={'trigger'}
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Breadcrumb>
                        <Breadcrumb.Item key={"Home"}>
                            <Icon type="home"/>
                            <span>Home</span>
                        </Breadcrumb.Item>
                        {breadcrumbs.map(item => (
                            <Breadcrumb.Item key={item.name}>
                                <Icon type={item.meta.icon}/>
                                <span>{item.name}</span>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <div className="header-right-wrapper">
                        <Badge dot>
                            <Icon type="message"/>
                        </Badge>
                        <Badge dot>
                            <Icon type="notification"/>
                        </Badge>
                        <Popover placement={"bottom"}
                                 content={<a onClick={resetPermission}>Reset Permission</a>}
                                 trigger="click">
                            <Avatar className="avatar" icon="user" style={{backgroundColor: "#87d068"}}/>
                        </Popover>
                    </div>
                </Header>
                <Content className="content"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>);
}

export default withRouter(App);
