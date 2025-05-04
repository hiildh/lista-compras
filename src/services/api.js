import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para armazenar e recuperar o token

const api = axios.create({
    baseURL: "http://192.168.3.9:8000", // Substitua pela URL da sua API
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("access_token"); // Recupera o token do armazenamento
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

// Função para buscar famílias
export const fetchFamilies = async () => {
    const response = await api.get("/users/me/families");
    return JSON.stringify(response.data, null, 2);
};

// Função para buscar listas de compras
export const fetchShoppingLists = async (familyId, query = "") => {
    const response = await api.get("/shopping-lists", {
        params: { family_id: familyId, q: query },
    });
    console.log("Response data:", response.data); // Log para depuração
    return response.data;
};

// Função para criar uma nova lista
export const createShoppingList = async (name, familyId) => {
    const response = await api.post("/shopping-lists", {
        nome: name,
        familia: familyId,
        itens: [],
    });
    return response.data;
};

// Cancelar uma lista
export const cancelShoppingList = async (familyId, listId) => {
    const response = await api.patch(`/shopping-lists/${familyId}/${listId}`, {
        status: "cancelada",
    });
    return response.data;
};

// Buscar itens da lista
export const fetchShoppingListItems = async (familyId, listId) => {
    console.log("Fetching items for list:", listId); // Log para depuração
    const response = await api.get(`/shopping-lists/${familyId}/${listId}/items`);
    console.log("Response data:", response.data); // Log para depuração
    return response.data;
};

// Adicionar itens à lista
export const addShoppingListItems = async (familyId, listId, items) => {
    const response = await api.post(`/shopping-lists/${familyId}/${listId}/items`, {
        itens: items,
    });
    return response.data;
};

// Atualizar (checkar) um item
export const updateShoppingListItem = async (familyId, listId, itemIndex, data) => {
    const response = await api.patch(
        `/shopping-lists/${familyId}/${listId}/items/${itemIndex}`,
        data
    );
    return response.data;
};

// Excluir um item
export const deleteShoppingListItem = async (familyId, listId, itemIndex) => {
    const response = await api.delete(
        `/shopping-lists/${familyId}/${listId}/items/${itemIndex}`
    );
    return response.data;
};

export default api;