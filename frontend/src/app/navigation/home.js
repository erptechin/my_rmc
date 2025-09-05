import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import PeopleIcon from 'assets/nav-icons/people.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Home',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.home',
            path: path(ROOT_DASHBOARDS, '/home'),
            type: NAV_TYPE_ITEM,
            title: 'Home',
            transKey: 'nav.dashboards.home',
            Icon: StatisticIcon,
        },
        {
            id: 'dashboards.task',
            path: path(ROOT_DASHBOARDS, '/task'),
            type: NAV_TYPE_ITEM,
            title: 'Task',
            transKey: 'nav.dashboards.task',
            Icon: PeopleIcon,
        },
        {
            id: 'dashboards.opportunity',
            path: path(ROOT_DASHBOARDS, '/opportunity'),
            type: NAV_TYPE_ITEM,
            title: 'opportunity',
            transKey: 'nav.dashboards.opportunity',
            Icon: PeopleIcon,
        },
        {
            id: 'dashboards.crm',
            path: path(ROOT_DASHBOARDS, '/crm'),
            type: NAV_TYPE_ITEM,
            title: 'Crm',
            transKey: 'nav.dashboards.crm',
            Icon: PeopleIcon,
        },
    ]
}