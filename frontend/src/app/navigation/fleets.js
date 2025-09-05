import DualsStatsUpIcon from 'assets/dualicons/stats-up.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/fleets'

const path = (root, item) => `${root}${item}`;

export const fleets = {
    id: 'fleets',
    type: NAV_TYPE_ROOT,
    path: '/fleets',
    title: 'Fleets',
    transKey: 'nav.fleets.fleets',
    Icon: DualsStatsUpIcon,
    childs: [
        {
            id: 'fleets.driver',
            path: path(ROOT_MASTERS, '/driver'),
            type: NAV_TYPE_ITEM,
            title: 'Driver',
            transKey: 'nav.fleets.driver',
            Icon: StatisticIcon,
        },
        {
            id: 'fleets.vehicle',
            path: path(ROOT_MASTERS, '/vehicle'),
            type: NAV_TYPE_ITEM,
            title: 'Vehicle',
            transKey: 'nav.fleets.vehicle',
            Icon: StatisticIcon,
        }
    ]
}
