import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TagIcon from '@mui/icons-material/Tag'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import BarChartIcon from '@mui/icons-material/BarChart'
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export enum EIconToNameMap {
    schedule = 'schedule',
    calendar = 'calendar',
    tag = 'tag',
    keyBoardArrowLeft = 'keyBoardArrowLeft',
    keyBoardArrowRight = 'keyBoardArrowRight',
    manageAccounts = 'manageAccounts',
    barChart = 'barChart',
    link = 'link',
    assignment = 'assignment'
}

type TIconToNameMap = {
    [key in EIconToNameMap]: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
}

export const IconToNameMap: TIconToNameMap = {
    schedule: ScheduleIcon,
    calendar: CalendarMonthIcon,
    tag: TagIcon,
    keyBoardArrowLeft: KeyboardArrowLeftIcon,
    keyBoardArrowRight: KeyboardArrowRightIcon,
    manageAccounts: ManageAccountsIcon,
    barChart: BarChartIcon,
    link: LinkIcon,
    assignment: AssignmentIndIcon
}