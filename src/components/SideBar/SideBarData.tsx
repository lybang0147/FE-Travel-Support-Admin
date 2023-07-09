import { Room, RoomService } from '@mui/icons-material'
import React from 'react'
import * as FaIcons from 'react-icons/fa' 

export const SidebarData = [
    {
        title: 'Quản lý người dùng',
        path: '/user',
        icon: <FaIcons.FaUsers />
    },
    {
        title: 'Quản lý tỉnh thành',
        path: '/province',
        icon: <FaIcons.FaSearchLocation />
    },
    {
        title: 'Dịch vụ khách sạn',
        path: '/amenities',
        icon: <FaIcons.FaTasks />
    },
    {
        title: 'Dịch vụ phòng',
        path: '/roomservice',
        icon: <RoomService />
    },
    {
        title: 'Quản lý địa điểm',
        path: '/place',
        icon: <FaIcons.FaRegChartBar />
    }
]
