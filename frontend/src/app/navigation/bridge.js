import DualFormsIcon from 'assets/dualicons/forms.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/bridge'

const path = (root, item) => `${root}${item}`;

export const bridge = {
    id: 'bridge',
    type: NAV_TYPE_ROOT,
    path: '/bridge',
    title: 'Bridge',
    transKey: 'nav.bridge.bridge',
    Icon: DualFormsIcon,
    childs: [
        {
            id: 'bridge.weight-bridge',
            path: path(ROOT_MASTERS, '/weight-bridge'),
            type: NAV_TYPE_ITEM,
            title: 'Weight Bridge',
            transKey: 'nav.bridge.weight-bridge',
            Icon: StatisticIcon,
        },
    ]
}
