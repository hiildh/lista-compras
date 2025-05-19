import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "access_token";
const FAMILY_ID_KEY = "family_id";
const User = "user";

export const saveAuthData = async (token, familyId, user) => {
    try {
        await AsyncStorage.multiSet([
            [TOKEN_KEY, token],
            [FAMILY_ID_KEY, familyId],
            [User, JSON.stringify(user)],
        ]);
    } catch (error) {
        console.error("Erro ao salvar dados de autenticação:", error);
    }
};

export const getAuthData = async () => {
    try {
        const values = await AsyncStorage.multiGet([TOKEN_KEY, FAMILY_ID_KEY]);
        const data = Object.fromEntries(values);
        return {
            token: data[TOKEN_KEY] || null,
            familyId: data[FAMILY_ID_KEY] || null,
        };
    } catch (error) {
        console.error("Erro ao recuperar dados de autenticação:", error);
        return { token: null, familyId: null };
    }
};

export const clearAuthData = async () => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, FAMILY_ID_KEY]);
    } catch (error) {
        console.error("Erro ao limpar dados de autenticação:", error);
    }
};