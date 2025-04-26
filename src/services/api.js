import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.3.9:8000", // Substitua pela URL da sua API
});

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data; // Retorna os dados da API
    } catch (error) {
        console.error(error); // Exibe o erro no console para depuração
        const errorMessage = error.response?.data?.message || "Erro ao fazer login.";
        throw errorMessage; // Lança uma mensagem de erro como string
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await api.post("/register", { name, email, password }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; // Retorna os dados da API
    } catch (error) {
        console.error(error); // Exibe o erro no console para depuração
        const errorMessage = error.response?.data?.message || "Erro ao criar conta.";
        throw errorMessage; // Lança uma mensagem de erro como string
    }
};