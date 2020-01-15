import {Menu, Icon} from 'antd'
import { Route } from 'react-router-dom'
import React from 'react'
import { GEN_MENUS, GEN_ROUTES } from '../actions'

function generateRoutes(config, parentPath = '') {
  if (config.hasOwnProperty('routes')) {
      parentPath = config.path
    return <Route key={config.name} path={config.path}>{config.routes.map(item => generateRoutes(item, parentPath))}</Route>
  } else {
    return <Route key={config.name} path={parentPath + config.path} component={config.component}/>
  }

}

function generateMenuItem(menu) {
  if (menu.hasOwnProperty('routes')) {
    return (<Menu.SubMenu key={menu.name} title={
      <span>
          <Icon type={menu.meta.icon}/>
          <span>{menu.name}</span>
      </span>
    }>{menu.routes.map(item => generateMenuItem(item))}</Menu.SubMenu>);
  } else {
    return (<Menu.Item key={menu.name}>
      <Icon type={menu.meta.icon} />
      <span>{menu.name}</span>
    </Menu.Item>);
  }
}

export default (state = {
    base: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: require('../pages/dashboard/index').default,
          meta: {
            icon: 'dashboard',
            roles: [1, 2, 3, 4, 5, 6]
          },
        },
        {
          name: 'Table',
          path: '/table',
          meta: {
            icon: 'table',
            roles: [1, 2, 3, 4, 5, 6]
          },
          routes: [
            {
              name: 'Users',
              path: '/users',
              component: require('../pages/table/users').default,
              meta: {
                icon: 'idcard',
                roles: [1, 2, 3, 4, 5, 6]
              },
            }
          ]
        },
        {
          name: 'Article',
          path: '/article',
          meta: {
            icon: 'file-markdown',
            roles: [1, 2, 3, 4, 5, 6]
          },
          routes: [
            {
              name: 'Posts',
              path: '/posts',
              component: require('../pages/article/posts').default,
              meta: {
                icon: 'file-protect',
                roles: [1, 2, 3, 4, 5, 6]
              },
            },
            {
              name: 'Editor',
              path: '/editor',
              component: require('../pages/article/editor').default,
              meta: {
                icon: 'edit',
                roles: [1, 2, 3, 4, 5, 6]
              },
            }
          ]
        },
        {
          name: 'Tool',
          path: '/tool',
          meta: {
            icon: 'tool',
            roles: [1, 2, 3, 4, 5, 6]
          },
          routes: [
            {
              name: 'Notes',
              path: '/notes',
              component: require('../pages/tool/notes').default,
              meta: {
                icon: 'book',
                roles: [1, 2, 3, 4, 5, 6]
              },
            },
            {
              name: 'Board',
              path: '/board',
              component: require('../pages/tool/board').default,
              meta: {
                icon: 'project',
                roles: [1, 2, 3, 4, 5, 6]
              },
            },
          ]
        },
        {
          name: 'Permission',
          path: '/permission',
          component: require('../pages/permission/index').default,
          meta: {
            icon: 'team',
            roles: [1, 2, 3, 4, 5, 6]
          },
        }
      ],
    menus: null,
    routes: null
}, action) => {
    switch (action.type) {
        case GEN_MENUS:
            return state = Object.assign(state, {menus: state.base.map(item => generateMenuItem(item))});
        case GEN_ROUTES:
            return state = Object.assign(state, {routes: state.base.map(item => generateRoutes(item))});
        default: return state
    }
}
