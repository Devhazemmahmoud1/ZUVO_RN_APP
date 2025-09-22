// import { API_URL } from '@env';

export const handleSignIn = async (form: any) => {
    const response = await fetch('http://localhost:4000/api/auth/customer-login', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: form.email,
            password: form.password,
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