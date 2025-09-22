// import { API_URL } from '@env';

export const handleSignUp = async (form: any) => {
    const response = await fetch('http://localhost:4000/api/auth/register/customer', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone || '',
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