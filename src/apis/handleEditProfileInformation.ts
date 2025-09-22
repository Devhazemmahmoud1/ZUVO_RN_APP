import { apiRequest } from "../ultis/api"

export const handleEditProfile = async (userIfo: any) => {
    const res = await apiRequest({
        path: '/api/customer-account/edit-profile',
        method: 'post',
        body: {
            firstName: userIfo.firstName || undefined,
            lastName: userIfo.lastName || undefined,
            phone: userIfo.phone || undefined,
        }
    })

    return res
}