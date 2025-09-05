import DualElementsIcon from 'assets/dualicons/elements.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_MASTERS = '/labs'

const path = (root, item) => `${root}${item}`;

export const labs = {
    id: 'labs',
    type: NAV_TYPE_ROOT,
    path: '/labs',
    title: 'Labs',
    transKey: 'nav.labs.labs',
    Icon: DualElementsIcon,
    childs: [
        {
            id: 'labs.recipe',
            path: path(ROOT_MASTERS, '/recipe'),
            type: NAV_TYPE_ITEM,
            title: 'Recipe',
            transKey: 'nav.labs.recipe',
            Icon: StatisticIcon,
        },
        {
            id: 'labs.grade',
            path: path(ROOT_MASTERS, '/grade'),
            type: NAV_TYPE_ITEM,
            title: 'Grade',
            transKey: 'nav.labs.grade',
            Icon: StatisticIcon,
        },
        {
            id: 'labs.cube-testing-register',
            path: path(ROOT_MASTERS, '/cube-testing-register'),
            type: NAV_TYPE_ITEM,
            title: 'Cube Testing Register',
            transKey: 'nav.labs.cube-testing-register',
            Icon: StatisticIcon,
        },
        
    ]
}
