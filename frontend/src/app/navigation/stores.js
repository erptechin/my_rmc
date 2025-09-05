import DualComponentsIcon from 'assets/dualicons/components.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/stores'

const path = (root, item) => `${root}${item}`;

export const stores = {
    id: 'stores',
    type: NAV_TYPE_ROOT,
    path: '/stores',
    title: 'Stores',
    transKey: 'nav.stores.stores',
    Icon: DualComponentsIcon,
    childs: [
        {
            id: 'stores.item',
            path: path(ROOT_MASTERS, '/item'),
            type: NAV_TYPE_ITEM,
            title: 'Item',
            transKey: 'nav.stores.item',
            Icon: StatisticIcon,
        },
        {
            id: 'stores.stock-entry',
            path: path(ROOT_MASTERS, '/stock-entry'),
            type: NAV_TYPE_ITEM,
            title: 'Stock Entry',
            transKey: 'nav.stores.stock-entry',
            Icon: StatisticIcon,
        }
    ]
}
