export const handleResetPassword = async (data: any) => {
    const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            newPassword: data.password, // Replace with the actual new password
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