import axios from "axios";

const api = axios.create({
    baseURL: "https://sua-api.com", // Substitua pela URL da sua API
});

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erro ao fazer login.";
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await api.post("/register", { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erro ao criar conta.";
    }
};