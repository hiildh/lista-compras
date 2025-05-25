import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para armazenar e recuperar o token
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

let isSyncing = false;

NetInfo.addEventListener(async (state) => {
    if (state.isConnected && !isSyncing) {
        isSyncing = true;
        try {
            console.log("Conexão restaurada. Sincronizando dados...");
            // Pode usar Toast ao invés de Alert para não empilhar modais
            Alert.alert(
                "Conexão restaurada",
                "Sincronizando dados com o servidor...",
                [{ text: "OK" }]
            );
            const familyId = await AsyncStorage.getItem("family_id");
            if (familyId) {
                // await syncData(familyId);
            } else {
                console.warn("familyId não encontrado para sincronização.");
            }
        } finally {
            isSyncing = false;
        }
    } else if (!state.isConnected) {
        console.log("Sem conexão com a internet.");
        Alert.alert(
            "Sem conexão",
            "Você está offline. As alterações serão salvas localmente e sincronizadas quando a conexão for restabelecida.",
            [{ text: "OK" }]
        );
    }
});

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

// Função pra buscar membros da família
export const fetchFamilyMembers = async (familyId) => {
    const response = await api.get(`/families/${familyId}/members`);
    return response.data;
};

// Função para entrar em uma família
export const joinFamily = async (joinCode) => {
    const response = await api.post(`/families/join?code=${encodeURIComponent(joinCode)}`);
    return response.data;
};

// Função para buscar listas de compras
export const fetchShoppingLists = async (familyId, query = "", skipCacheUpdate = false) => {
    const cacheKey = `shopping_lists_${familyId}`;
    try {
        // Tente buscar os dados da API
        const response = await api.get("/shopping-lists", {
            params: { family_id: familyId, q: query },
        });

        if (!skipCacheUpdate) {
            // Salve os dados no AsyncStorage
            await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
            console.log("Dados das listas de compras salvos no cache.");
        }
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar listas de compras:", error);

        // Se falhar, tente buscar os dados do AsyncStorage
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
            console.log("Usando dados do cache para listas de compras.");
            return JSON.parse(cachedData);
        }

        throw new Error("Não foi possível carregar as listas de compras.");
    }
};

// Função para criar uma nova lista
export const createShoppingList = async (name, familyId, itens = []) => {
    const response = await api.post("/shopping-lists", {
        nome: name,
        familia: familyId,
        itens, // pode ser vazio ou um array de itens
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
export const fetchShoppingListItems = async (familyId, listId, saveCache=true) => {
    const cacheKey = `shopping_list_items_${listId}`;
    try {
        // Tente buscar os dados da API
        const response = await api.get(`/shopping-lists/${familyId}/${listId}/items`);
        if(saveCache) {
            // Salve os dados no AsyncStorage
            await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar itens da lista:", error);

        // Se falhar, tente buscar os dados do AsyncStorage
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
            console.log("Usando dados do cache para itens da lista.");
            return JSON.parse(cachedData);
        }
        if (!error.response || error.response.status !== 404) throw new Error("Não foi possível carregar os itens da lista.");
    }
};

// Função pra apagar a lista
export const deleteShoppingList = async (familyId, listId) => {
    if (!listId.startsWith("temp")) {
        const response = await api.delete(`/shopping-lists/${familyId}/${listId}`);
    }
    // Remover o cache da lista
    const cacheListsList = `shopping_lists_${familyId}`;
    const cacheList = await AsyncStorage.getItem(cacheListsList);
    if (cacheList) {
        let parsedCache;
        try {
            parsedCache = JSON.parse(cacheList);
        } catch (e) {
            parsedCache = undefined;
        }

        // Se for array (formato novo)
        if (Array.isArray(parsedCache)) {
            // Se for lista temporária (id começa com temp), só remove do array e salva de volta
            if (listId.startsWith("temp")) {
                const newCache = parsedCache.filter(list => list.id !== listId);
                await AsyncStorage.setItem(cacheListsList, JSON.stringify(newCache));
            } else {
                // Remove do array e salva de volta
                const newCache = parsedCache.filter(list => list.id !== listId);
                await AsyncStorage.setItem(cacheListsList, JSON.stringify(newCache));
            }
        }
        // Se for objeto (formato antigo)
        else if (parsedCache && typeof parsedCache === "object") {
            if (parsedCache.lists && typeof parsedCache.lists === "object") {
                // Remove do objeto lists
                delete parsedCache.lists[listId];
                await AsyncStorage.setItem(cacheListsList, JSON.stringify(parsedCache));
            } else {
                // Caso seja objeto direto (chave = id)
                delete parsedCache[listId];
                await AsyncStorage.setItem(cacheListsList, JSON.stringify(parsedCache));
            }
        }
    }
    return response.data;
};

// Adicionar itens à lista
export const addShoppingListItems = async (familyId, listId, items) => {
    // Remove a chave 'by_user' de cada item antes de enviar para a API
    const sanitizedItems = items.map(({ by_user, ...rest }) => rest);
    const response = await api.post(`/shopping-lists/${familyId}/${listId}/items`, {
        itens: sanitizedItems,
    });
    return response.data;
};

// Buscar preços de itens
export const fetchItemDetails = async (itemName) => {
    const response = await api.get("/products/suggestions", {
        params: { q: itemName },
    });
    return response.data;
}

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

// Buscar histórico
export const fetchHistory = async (familyId) => {
    const response = await api.get("/shopping-lists/history", {});
    return response.data.history || [];
};

// Sincronizar dados entre o AsyncStorage e a API
export const syncData = async (familyId) => {
    try {
        console.log("Iniciando sincronização de dados...");

        // Obtenha todas as chaves do AsyncStorage
        let keys = await AsyncStorage.getAllKeys();
        console.log("Chaves encontradas:", keys);

        console.log("valores das chaves encontradas:");
        for (const key of keys) {
            const value = await AsyncStorage.getItem(key);
            console.log(`Conteúdo da chave "${key}":`, value);
        }

        // 1. Sincronize listas e itens offline primeiro (NÃO sobrescreva o cache aqui!)
        console.log("------------------------------iniciando a sincronização de listas offline------------------------------");
        const listKeys = keys.filter((key) => key.startsWith("shopping_lists_"));
        for (const key of listKeys) {
            const cachedData = JSON.parse(await AsyncStorage.getItem(key)) || {};
            console.log("Conteúdo do cache:", cachedData);

            // Normaliza para array independente do formato
            let cachedLists = [];
            if (Array.isArray(cachedData)) {
                cachedLists = cachedData;
            } else if (cachedData.lists && typeof cachedData.lists === "object") {
                cachedLists = Object.values(cachedData.lists);
            } else if (typeof cachedData === "object" && Object.keys(cachedData).length > 0) {
                cachedLists = Object.values(cachedData);
            }
            console.log("Conteúdo do cache list (normalizado):", cachedLists);
            console.log("Sincronizando listas para a família:", key);
            // a parte de enviar a lista e recolocar o id n tá funfando, falta analizar
            // Obtenha as listas existentes no servidor (mas NÃO atualize o cache ainda!)
            const serverLists = await fetchShoppingLists(familyId, "", true); // true = não atualizar cache

            for (const list of cachedLists) {
                const isOffline = list.id?.startsWith('temp-') || list.offline;
                console.log("Lista encontrada no cache:", list);
                console.log("ID da lista:", list.id);
                console.log("Lista offline:", isOffline);

                if (isOffline) {
                    // Lista criada offline: crie na API já com os itens
                    console.log("Criando lista offline na API:", list.nome);
                    const response = await createShoppingList(list.nome, list.familia, list.itens || []);
                    console.log("Resposta da criação:", response);
                    const newId = response.id;
                    console.log("Novo ID da lista:", newId);
                    console.log("ID antigo da lista:", list.id);
                    // Atualize também os itens do cache para usar o novo id
                    const itemKeyOld = `shopping_list_items_${list.id}`;
                    const itemKeyNew = `shopping_list_items_${newId}`;
                    const cachedItemsRaw = await AsyncStorage.getItem(itemKeyOld);
                    console.log("Conteúdo do cache de itens:", cachedItemsRaw);
                    console.log("testando o if", cachedItemsRaw.length);
                    // Atualize o id da lista no array
                    list.id = newId;
                    list.offline = false;
                    if (cachedItemsRaw.length > 0) {
                        let itemsToMigrate = [];
                        try {
                            const parsed = JSON.parse(cachedItemsRaw);
                            console.log("Conteúdo do cache de itens (parseado):", parsed);
                            if (Array.isArray(parsed)) {
                                itemsToMigrate = parsed;
                            } else if (parsed && Array.isArray(parsed.items)) {
                                itemsToMigrate = parsed.items;
                            }
                            console.log("Itens a migrar:", itemsToMigrate);
                        } catch (e) {
                            console.error("Erro ao parsear itens offline:", e);
                            itemsToMigrate = [];
                        }
                        if (itemsToMigrate.length > 0) {
                            console.log("Migrando itens para o novo ID:", itemsToMigrate);
                            await AsyncStorage.setItem(itemKeyNew, JSON.stringify({ items: itemsToMigrate }));
                            // adicionar na keys tbm
                            keys.push(itemKeyNew);
                            console.log("Chaves atualizadas:", keys);
                        }
                        console.log("Removendo itens offline do cache:", itemKeyOld);
                        await AsyncStorage.removeItem(itemKeyOld);
                        // Atualize a variavel keys pra limpar o itemKeyOld
                        keys = keys.filter((k) => k !== itemKeyOld);
                        console.log("Chaves atualizadas:", keys);
                    }
                } else {
                    // Lista já existe: sincronize apenas os itens novos
                    console.log("Lista já existe no servidor, sincronizando itens:", list.nome);
                    const serverItems = await fetchShoppingListItems(familyId, list.id, false);
                    const itemsToSync = (list.itens || []).filter(
                        (cachedItem) => !serverItems.items.some(
                            (serverItem) => serverItem.nome === cachedItem.nome
                        )
                    );
                    if (itemsToSync.length > 0) {
                        await addShoppingListItems(familyId, list.id, itemsToSync);
                    }
                }
            }
            // Atualize o cache local das listas (apenas as listas, não os itens)
            await AsyncStorage.setItem(key, JSON.stringify({ lists: cachedLists }));
        }
        console.log("------------------------------iniciando a sincronização de itens offline------------------------------");
        // 2. Sincronize itens offline em listas já existentes (igual já faz)
        const itemKeys = keys.filter((key) => key.startsWith("shopping_list_items_"));
        console.log("Chaves de itens encontrados:", itemKeys);
        console.log("valores das chaves de itens encontrados:");
        for (const key of itemKeys) {
            const value = await AsyncStorage.getItem(key);
            console.log(`Conteúdo da chave "${key}":`, value);
        }
        for (const key of itemKeys) {
            console.log("Sincronizando itens para a lista:", key);
            const listId = key.replace("shopping_list_items_", "");
            let cachedData = await AsyncStorage.getItem(key);
            console.log("Conteúdo do cache:", cachedData);
            if (!cachedData) continue;

            // Tratar ambos os formatos: array direto ou objeto { items: [...] }
            let cachedItems = [];
            try {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed)) {
                    cachedItems = parsed;
                } else if (parsed && Array.isArray(parsed.items)) {
                    cachedItems = parsed.items;
                }
            } catch (e) {
                console.error("Erro ao parsear itens offline:", e);
                continue;
            }

            console.log("Itens offline encontrados para sincronizar:", cachedItems);

            if (cachedItems.length > 0) {
                // Busca os itens atuais do servidor para evitar duplicidade
                const serverItems = await fetchShoppingListItems(familyId, listId, false);
                const itemsToSync = cachedItems.filter(
                    (cachedItem) =>
                        !serverItems.items.some(
                            (serverItem) => serverItem.nome === cachedItem.nome
                        )
                );
                if (itemsToSync.length > 0) {
                    console.log(`Sincronizando ${itemsToSync.length} itens offline para a lista ${listId}`);
                    try {
                        await addShoppingListItems(familyId, listId, itemsToSync);
                        // Após sincronizar, remova apenas os itens sincronizados do cache
                        const remainingItems = cachedItems.filter(
                            (item) => !itemsToSync.includes(item)
                        );
                        if (remainingItems.length > 0) {
                            await AsyncStorage.setItem(key, JSON.stringify({ items: remainingItems }));
                        } else {
                            console.log("Todos os itens offline sincronizados, removendo do cache.");
                            console.log("Removendo itens offline do cache:", key);
                            await AsyncStorage.removeItem(key);
                        }
                    } catch (e) {
                        // Se falhar, mantenha todos os itens no cache
                        console.error("Erro ao sincronizar itens offline:", e);
                    }
                } else {
                    // Nenhum item para sincronizar, mas pode ter sobrado lixo no cache
                    console.log("Todos os itens offline já estão sincronizados, removendo do cache.");
                    console.log("Removendo itens offline do cache:", key);
                    await AsyncStorage.removeItem(key);
                }
            }
        }
        
        // 3. Só agora, atualize o cache local com o que veio do servidor
        for (const key of listKeys) {
            const familyIdFromKey = key.replace("shopping_lists_", "");
            const serverData = await fetchShoppingLists(familyIdFromKey);
            await AsyncStorage.setItem(key, JSON.stringify(serverData));
        }

        console.log("Sincronização concluída com sucesso.");
    } catch (error) {
        console.error("Erro ao sincronizar dados:", error);
    }
};

export default api;