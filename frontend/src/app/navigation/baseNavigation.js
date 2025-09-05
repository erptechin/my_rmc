import { NAV_TYPE_ITEM, } from "constants/app.constant";
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import DualComponentsIcon from 'assets/dualicons/components.svg?react'
import DualApplicationsIcon from 'assets/dualicons/applications.svg?react'
import DualFormsIcon from 'assets/dualicons/forms.svg?react'
import DualElementsIcon from 'assets/dualicons/elements.svg?react'
import DualsStatsUpIcon from 'assets/dualicons/stats-up.svg?react'
import DualLampIcon from 'assets/dualicons/lamp.svg?react'

export const baseNavigation = [
    {
        id: 'dashboards',
        type: NAV_TYPE_ITEM,
        path: '/dashboards/home',
        title: 'Dashboards',
        transKey: 'nav.dashboards.dashboards',
        Icon: DashboardsIcon,
    },
    {
        id: 'stores',
        type: NAV_TYPE_ITEM,
        path: '/stores/item',
        title: 'Stores',
        transKey: 'nav.stores.stores',
        Icon: DualComponentsIcon,
    },
    {
        id: 'purchases',
        type: NAV_TYPE_ITEM,
        path: '/purchases/supplier',
        title: 'Purchases',
        transKey: 'nav.purchases.purchases',
        Icon: DualApplicationsIcon,
    },
    {
        id: 'sales',
        type: NAV_TYPE_ITEM,
        path: '/sales/customer',
        title: 'Sales',
        transKey: 'nav.sales.sales',
        Icon: DualFormsIcon,
    },
    {
        id: 'labs',
        type: NAV_TYPE_ITEM,
        path: '/labs/recipe',
        title: 'labs',
        transKey: 'nav.labs.labs',
        Icon: DualElementsIcon,
    },
    {
        id: 'fleets',
        type: NAV_TYPE_ITEM,
        path: '/fleets/driver',
        title: 'Fleets',
        transKey: 'nav.fleets.fleets',
        Icon: DualsStatsUpIcon,
    },
     {
        id: 'employee',
        type: NAV_TYPE_ITEM,
        path: '/employee/expense-claim',
        title: 'Employee',
        transKey: 'nav.employee.expense-claim',
        Icon: DualLampIcon,
    }
]
