import DualLampIcon from 'assets/dualicons/lamp.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/employee'

const path = (root, item) => `${root}${item}`;

export const employee = {
    id: 'employee',
    type: NAV_TYPE_ROOT,
    path: '/employee',
    title: 'employee',
    transKey: 'nav.employee.employee',
    Icon: DualLampIcon,
    childs: [
        {
            id: 'employee.expense-claim',
            path: path(ROOT_MASTERS, '/expense-claim'),
            type: NAV_TYPE_ITEM,
            title: 'Expense Claim',
            transKey: 'nav.employee.expense-claim',
            Icon: StatisticIcon,
        },
        {
            id: 'employee.leave-application',
            path: path(ROOT_MASTERS, '/leave-application'),
            type: NAV_TYPE_ITEM,
            title: 'Leave Application',
            transKey: 'nav.employee.leave-application',
            Icon: StatisticIcon,
        }
    ]
}
