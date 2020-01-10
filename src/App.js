import React, {useState} from "react";
import { generateMenus } from './actions'
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from "react-router-dom";
import { createStore } from 'redux'
import reducers from './reducers'
import './App.css'

const { Header, Sider, Content } = Layout;
const store = createStore(reducers);
function App(props) {
  store.dispatch(generateMenus())
  const [collapsed, setCollapsed] = useState(false);
  // useEffect(() => router.push('/dashboard'), []);
  function handleLink(item) {
    const path = '/' + item.keyPath.reverse().join('/').toLowerCase();
    if (props.location.pathname === path) {
      return
    }
    props.history.push(path)
  }
  return (
      <Layout className={'container'}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={'logo'} />
          <Menu onClick={handleLink} theme="dark" mode="inline" defaultSelectedKeys={['Dashboard']}>
            {
              store.getState().menus
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
                className={'trigger'}
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => setCollapsed(!collapsed)}
            />
          </Header>
          <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>);
}

export default withRouter(App);
