// import { API_URL } from '@env';

export const handleGoogleSignIn = async (userInfo: any) => {
    const response = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: userInfo.data.idToken
        }),
    })

    if (response.ok) {
        return await response.json();
    }

    return []
}