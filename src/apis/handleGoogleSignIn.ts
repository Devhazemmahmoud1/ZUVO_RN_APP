// import { API_URL } from '@env';

import { Platform } from "react-native";


const BASE_URL = Platform.select({
      ios: 'http://localhost:4000',   // iOS simulator -> Mac host
      android: 'http://10.0.2.2:4000' // Android emulator -> Mac host
})! // change this


export const handleGoogleSignIn = async (userInfo: any) => {
    const response = await fetch(`${BASE_URL}/api/auth/google`, {
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