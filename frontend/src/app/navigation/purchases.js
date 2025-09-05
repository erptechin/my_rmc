import DualApplicationsIcon from 'assets/dualicons/applications.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/purchases'

const path = (root, item) => `${root}${item}`;

export const purchases = {
    id: 'purchases',
    type: NAV_TYPE_ROOT,
    path: '/purchases',
    title: 'Purchases',
    transKey: 'nav.purchases.purchases',
    Icon: DualApplicationsIcon,
    childs: [
        {
            id: 'purchases.supplier',
            path: path(ROOT_MASTERS, '/supplier'),
            type: NAV_TYPE_ITEM,
            title: 'Supplier',
            transKey: 'nav.purchases.supplier',
            Icon: StatisticIcon,
        },
        {
            id: 'purchases.purchase-order',
            path: path(ROOT_MASTERS, '/purchase-order'),
            type: NAV_TYPE_ITEM,
            title: 'Purchase Order',
            transKey: 'nav.purchases.purchase-order',
            Icon: StatisticIcon,
        },
        {
            id: 'purchases.purchase-receipt',
            path: path(ROOT_MASTERS, '/purchase-receipt'),
            type: NAV_TYPE_ITEM,
            title: 'Purchase Receipt',
            transKey: 'nav.purchases.purchase-receipt',
            Icon: StatisticIcon,
        },
        {
            id: 'purchases.purchase-invoice',
            path: path(ROOT_MASTERS, '/purchase-invoice'),
            type: NAV_TYPE_ITEM,
            title: 'Purchase Invoice',
            transKey: 'nav.purchases.purchase-invoice',
            Icon: StatisticIcon,
        },
    ]
}
