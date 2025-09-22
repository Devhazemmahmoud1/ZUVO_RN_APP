


import { apiRequest } from "../ultis/api"

export const handleDeleteAddress = async (id: any) => {
    console.log(id)
    const res = await apiRequest({
        path: '/api/customer-account/addresses-delete',
        method: 'delete',
        body: {
            id: id
        }
    })

    return res
}