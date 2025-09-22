

import { apiRequest } from "../ultis/api"

export const handleGetCategories = async () => {
    const res = await apiRequest({
        path: '/api/category/',
        method: 'get',
    })

    return res
}