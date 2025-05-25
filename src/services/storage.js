import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "access_token";
const ID_TOKEN = "id_token";
const FIREBASE_CUSTOM_TOKEN = "firebase_custom_token";
const FAMILY_ID_KEY = "family_id";
const User = "user";

export const saveAuthData = async (token, id_token, firebase_custom_token, familyId, user) => {
    try {
        await AsyncStorage.multiSet([
            [TOKEN_KEY, token],
            [ID_TOKEN, id_token],
            [FIREBASE_CUSTOM_TOKEN, firebase_custom_token],
            [FAMILY_ID_KEY, familyId],
            [User, JSON.stringify(user)],
        ]);
    } catch (error) {
        console.error("Erro ao salvar dados de autenticação:", error);
    }
};

export const getAuthData = async () => {
    try {
        const values = await AsyncStorage.multiGet([TOKEN_KEY, ID_TOKEN, FIREBASE_CUSTOM_TOKEN, FAMILY_ID_KEY, User]);
        const data = Object.fromEntries(values);
        return {
            token: data[TOKEN_KEY] || null,
            id_token: data[ID_TOKEN] || null,
            firebase_custom_token: data[FIREBASE_CUSTOM_TOKEN] || null,
            familyId: data[FAMILY_ID_KEY] || null,
            user: data[User] ? JSON.parse(data[User]) : null,
        };
    } catch (error) {
        console.error("Erro ao recuperar dados de autenticação:", error);
        return { token: null, id_token: null, firebase_custom_token: null, familyId: null, user: null };
    }
};

export const clearAuthData = async () => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, FAMILY_ID_KEY]);
    } catch (error) {
        console.error("Erro ao limpar dados de autenticação:", error);
    }
};