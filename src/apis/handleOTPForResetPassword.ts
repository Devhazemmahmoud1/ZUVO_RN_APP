export const handleSendOTPForForgetPassword = async (email: any) => {
    console.log(email)
    const response = await fetch('http://localhost:4000/api/auth/send-otp-forget-password', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
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