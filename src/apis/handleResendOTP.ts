// import { API_URL } from '@env';

export const resendOTP = async (email: any) => {

    const response = await fetch('http://localhost:4000/api/auth/vendor/resend-otp', {
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
        success: false,
        message: await response.json()
    }
}