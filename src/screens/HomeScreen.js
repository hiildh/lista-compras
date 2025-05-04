import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { ShoppingNavBar } from "../components/ShoppingNavBar";
import CreateListModal from "../components/CreateListModal";
import { fetchFamilies, fetchShoppingLists, createShoppingList } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [families, setFamilies] = useState([]);
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Função para carregar as famílias
    const loadFamilies = async () => {
        try {
            setLoading(true);
            const data = await fetchFamilies();
            const parsedData = JSON.parse(data);
            setFamilies(Array.isArray(parsedData.families) ? parsedData.families : []);
        } catch (error) {
            console.error("Erro ao buscar famílias:", error);
            Alert.alert("Erro", "Não foi possível carregar as famílias.");
            setFamilies([]);
        } finally {
            setLoading(false);
        }
    };

    // Função para carregar as listas de compras
    const loadShoppingLists = async (familyId) => {
        if (!familyId) return;
        try {
            setLoading(true);
            const data = await fetchShoppingLists(familyId, searchQuery);
            setShoppingLists(Object.values(data.lists));
        } catch (error) {
            console.error("Erro ao buscar listas de compras:", error);
            Alert.alert("Erro", "Não foi possível carregar as listas de compras.");
        } finally {
            setLoading(false);
        }
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
            setLoading(true);
            await createShoppingList(newList.name, newList.familyId);
            Alert.alert("Sucesso", "Lista criada com sucesso!");
            loadShoppingLists(newList.familyId);
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            Alert.alert("Erro", "Não foi possível criar a lista.");
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

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
                <View>
                    {shoppingLists.map((list, index) => (
                        <TouchableOpacity
                            key={list.id || index}
                            style={styles.listItem}
                            onPress={() =>
                                console.log("List clicked:", list) ||
                                navigation.navigate("ListDetails", {
                                    familyId: list.familia,
                                    listId: list.id,
                                    listName: list.nome,
                                    collaborators: list.usuarios_vinculados_lista || [],
                                })
                            }
                        >
                            <View style={styles.listItemHeader}>
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
                                <Text style={styles.listName}>{list.nome}</Text>
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
                                    <Text style={styles.listDate}>{new Date(list.data).toLocaleDateString()}</Text>
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
                                    <Text style={styles.listMembers}>{Object.keys(list.usuarios_vinculados_lista).length} membros</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
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
        padding: 10,
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
        marginBottom: 8,
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