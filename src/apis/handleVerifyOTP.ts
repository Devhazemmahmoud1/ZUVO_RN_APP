export const verifyOTP = async (data: any) => {

    const response = await fetch('http://localhost:4000/api/auth/vendor/verify-otp', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            code: data.code
        }),
    })

    if (response.ok) {
        return await response.json();
    }

    return {
        error: true,
        message: await response.json()
    }
}