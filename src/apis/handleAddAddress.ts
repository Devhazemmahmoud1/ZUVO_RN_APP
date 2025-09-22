import { apiRequest } from "../ultis/api"

export const handleAddAddress = async (addressInfo: any) => {
    const res = await apiRequest({
        path: '/api/customer-account/add-address',
        method: 'post',
        body: {
            firstName: addressInfo.firstName || undefined,
            lastName: addressInfo.lastName || undefined,
            phone: addressInfo.mobileNumber || undefined,
            additionalAddress: addressInfo.additionalAddress || undefined,
            address: addressInfo.address || undefined,
            location: addressInfo.location || undefined,
        }
    })

    console.log(res)

    return res
}