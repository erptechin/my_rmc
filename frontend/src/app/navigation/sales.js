import DualFormsIcon from 'assets/dualicons/forms.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/sales'

const path = (root, item) => `${root}${item}`;

export const sales = {
    id: 'sales',
    type: NAV_TYPE_ROOT,
    path: '/sales',
    title: 'Sales',
    transKey: 'nav.sales.sales',
    Icon: DualFormsIcon,
    childs: [
        {
            id: 'sales.customer',
            path: path(ROOT_MASTERS, '/customer'),
            type: NAV_TYPE_ITEM,
            title: 'Customer',
            transKey: 'nav.sales.customer',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.site',
            path: path(ROOT_MASTERS, '/site'),
            type: NAV_TYPE_ITEM,
            title: 'Site',
            transKey: 'nav.sales.site',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.quotation',
            path: path(ROOT_MASTERS, '/quotation'),
            type: NAV_TYPE_ITEM,
            title: 'Quotation',
            transKey: 'nav.sales.quotation',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.sales-order',
            path: path(ROOT_MASTERS, '/sales-order'),
            type: NAV_TYPE_ITEM,
            title: 'Sales Order',
            transKey: 'nav.sales.sales-order',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.schedule',
            path: path(ROOT_MASTERS, '/schedule'),
            type: NAV_TYPE_ITEM,
            title: 'Schedule',
            transKey: 'nav.sales.schedule',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.delivery-challan',
            path: path(ROOT_MASTERS, '/delivery-challan'),
            type: NAV_TYPE_ITEM,
            title: 'Delivery Challan',
            transKey: 'nav.sales.delivery-challan',
            Icon: StatisticIcon,
        },
        {
            id: 'sales.sales-invoice',
            path: path(ROOT_MASTERS, '/sales-invoice'),
            type: NAV_TYPE_ITEM,
            title: 'Sales Invoice',
            transKey: 'nav.sales.sales-invoice',
            Icon: StatisticIcon,
        },
    ]
}
