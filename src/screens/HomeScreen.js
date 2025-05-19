import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingNavBar } from "../components/ShoppingNavBar";
import CreateListModal from "../components/CreateListModal";
import { fetchFamilies, fetchShoppingLists, createShoppingList, deleteShoppingList } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from 'react-native-gesture-handler';

const HomeScreen = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [families, setFamilies] = useState([]);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Função para carregar as listas de compras
    const loadShoppingLists = async (familyId, forceUpdate = false) => {
        if (!familyId) return;
        try {
            setLoading(true);

            // Limpa a lista de compras antes de carregar novas
            const cacheKey = `shopping_lists_${familyId}`;
            if (!forceUpdate) {
                // Tente buscar do cache
                const cachedData = await AsyncStorage.getItem(cacheKey);
                if (cachedData) {
                    console.log("Usando dados do cache para listas de compras.");
                    setShoppingLists(Object.values(JSON.parse(cachedData).lists));
                    return;
                }
            }
            // Limpa o cache antes de salvar novos dados
            await AsyncStorage.removeItem(cacheKey);
            // Busca os dados da API
            const data = await fetchShoppingLists(familyId, searchQuery);
            setShoppingLists(Object.values(data.lists));
        } catch (error) {
            console.error("Erro ao buscar listas de compras:", error);
            Alert.alert("Erro", "Não foi possível carregar as listas de compras.");
        } finally {
            setLoading(false);
        }
    };

    // Função para recarregar as listas (Pull to Refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        if (families.length > 0) {
            const uniqueFamilyIds = [...new Set(families.map((family) => family.id))];
            for (const familyId of uniqueFamilyIds) {
                await loadShoppingLists(familyId, true); // Força a atualização
            }
        }
        setRefreshing(false);
    };

    // Carregar dados ao focar na tela
    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialData = async () => {
                setLoading(true);
                try {
                    // Carrega as famílias
                    const data = await fetchFamilies();
                    const parsedData = JSON.parse(data);
                    const loadedFamilies = Array.isArray(parsedData.families) ? parsedData.families : [];
                    setFamilies(loadedFamilies);

                    // Carrega as listas de compras para cada família
                    if (loadedFamilies.length > 0) {
                        const uniqueFamilyIds = [...new Set(loadedFamilies.map((family) => family.id))];
                        const allLists = [];
                        for (const familyId of uniqueFamilyIds) {
                            const data = await fetchShoppingLists(familyId, searchQuery);
                            allLists.push(...Object.values(data.lists));
                        }
                        setShoppingLists(allLists);
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados iniciais:", error);
                    Alert.alert("Erro", "Não foi possível carregar os dados.");
                } finally {
                    setLoading(false);
                }
            };

            fetchInitialData();
        }, [searchQuery]) // Apenas `searchQuery` como dependência
    );

    // Função para criar uma nova lista
    const handleCreateList = async (newList) => {
        try {
            // Tenta criar a lista no servidor primeiro para verificar conectividade
            let response;
            let isOffline = false;
            try {
                response = await createShoppingList(newList.name, newList.familyId);
            } catch (e) {
                isOffline = true;
            }

            const tempId = (isOffline ? "temp-" : "") + Date.now().toString();

            const newListData = {
                id: isOffline ? tempId : response?.id,
                nome: newList.name,
                familia: newList.familyId,
                itens: [],
                data: new Date().toISOString(),
                usuarios_vinculados_lista: [],
                family_name: families.find((family) => family.id === newList.familyId)?.name || "",
                status: "incompleta",
            };
            setShoppingLists((prevLists) => [newListData, ...prevLists]);

            // Salva no AsyncStorage
            const cacheKey = `shopping_lists_${newList.familyId}`;
            let cachedLists = [];
            const cachedRaw = await AsyncStorage.getItem(cacheKey);
            if (cachedRaw) {
                try {
                    const parsed = JSON.parse(cachedRaw);
                    cachedLists = Array.isArray(parsed) ? parsed : Object.values(parsed.lists || {});
                } catch (e) {
                    cachedLists = [];
                }
            }
            await AsyncStorage.setItem(cacheKey, JSON.stringify([newListData, ...cachedLists]));

            // Se estava offline, não tenta atualizar o ID
            if (!isOffline && response?.id) {
                setShoppingLists((prevLists) =>
                    prevLists.map((list) =>
                        list.id === tempId ? { ...list, id: response.id } : list
                    )
                );
            }
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            Alert.alert("Erro", "Não foi possível sincronizar a lista.");
        }
    };

    const handleDeleteList = async (item) => {
        try {
            // Chame sua função de exclusão
            await deleteShoppingList(item.familia, item.id);
            // Remova do estado local
            setShoppingLists((prev) => prev.filter((list) => list.id !== item.id));
        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a lista.");
        }
    };

    const renderRightActions = (progress, dragX, onDelete) => (
        <TouchableOpacity
            style={{
                backgroundColor: '#DA291C',
                justifyContent: 'center',
                alignItems: 'center',
                width: 70,
                height: '90%',
                borderRadius: 8,
            }}
            onPress={onDelete}
        >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                <Path d="M3 6h18" />
                <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </Svg>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suas Listas</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar lista..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={() => {
                    if (families.length > 0) {
                        const uniqueFamilyIds = [...new Set(families.map((family) => family.id))];
                        uniqueFamilyIds.forEach((familyId) => {
                            loadShoppingLists(familyId);
                        });
                    }
                }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#9b87f5" />
            ) : shoppingLists.length > 0 ? (
                <FlatList
                    style={styles.list}
                    data={shoppingLists.filter((list) => list && list.nome)} // Filtra listas inválidas
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Swipeable
                            renderRightActions={(progress, dragX) =>
                                renderRightActions(progress, dragX, () => handleDeleteList(item))
                            }
                            overshootRight={false}
                        >
                            <TouchableOpacity
                                style={styles.listItem}
                                onPress={() =>
                                    navigation.navigate("ListDetails", {
                                        familyId: item.familia,
                                        listId: item.id,
                                        listName: item.nome,
                                        collaborators: item.usuarios_vinculados_lista || [],
                                    })
                                }
                            >
                                <View style={styles.listItemHeader}>
                                    <View style={{ flexDirection: "row", alignItems: "center", overflow: "hidden" }}>
                                        <View style={styles.iconContainer}>
                                            <Svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#9b87f5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                                <Path d="M3 6h18" />
                                                <Path d="M16 10a4 4 0 0 1-8 0" />
                                            </Svg>
                                        </View>
                                        <Text style={styles.listName}>{item.nome}</Text>
                                    </View>
                                    <View style={styles.familyIndicator}>
                                        <Text style={{ color: "#fff" }}>{item.family_name}</Text>
                                    </View>
                                </View>
                                <View style={styles.listDetails}>
                                    <View style={styles.metaInfo}>
                                        <Svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#6E7CA0"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <Path d="M8 2v4" />
                                            <Path d="M16 2v4" />
                                            <Rect x="3" y="4" width="18" height="18" rx="2" />
                                            <Path d="M3 10h18" />
                                        </Svg>
                                        <Text style={styles.listDate}>{new Date(item.data).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={styles.metaInfo}>
                                        <Svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#000"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <Circle cx="9" cy="7" r="4" />
                                            <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </Svg>
                                        <Text style={styles.listMembers}>
                                            {Object.keys(item.usuarios_vinculados_lista || {}).length} membros
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Swipeable>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma lista encontrada.</Text>
                    <Text style={styles.emptySubText}>
                        Crie uma nova lista clicando no botão abaixo.
                    </Text>
                </View>
            )}

            <ShoppingNavBar
                onAdd={() => setModalVisible(true)}
                navigation={navigation}
                isDetailScreen={false} // Indica que não estamos na tela de detalhamento
            />
            <CreateListModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={handleCreateList}
                families={families}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f9f9ff",
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "bold",
        color: "#9b87f5",
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    list: {
        flex: 1,
        marginBottom: 50,
    },
    listItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: "column",
    },
    listItemHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    familyIndicator: {
        backgroundColor: "#A7A4E0",
        borderRadius: 10,
        padding: 3,
        alignSelf: "flex-start",
    },
    iconContainer: {
        backgroundColor: "rgba(155, 135, 245, 0.1)",
        borderRadius: 20,
        padding: 8,
        marginRight: 12,
    },
    listName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        // adicionar um truncate para o texto
        whiteSpace: "normal",
        maxWidth: "80%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    listDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    listDate: {
        fontSize: 14,
        color: "#6c757d",
        marginLeft: 4,
    },
    listMembers: {
        fontSize: 14,
        color: "#6c757d",
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6c757d",
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: "#6c757d",
        textAlign: "center",
    },
});

export default HomeScreen;