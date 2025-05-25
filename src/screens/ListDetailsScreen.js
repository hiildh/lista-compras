import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import Svg, { Path, Line, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    fetchShoppingListItems,
    updateShoppingListItem,
    deleteShoppingListItem,
    cancelShoppingList,
    addShoppingListItems,
    fetchItemDetails,
} from "../services/api";
import CreateItemModal from "../components/CreateItemModal";
import { db } from "../../firebaseConfig";
import { ref, onValue, off, get } from "firebase/database";

const ListDetailsScreen = ({ route, navigation }) => {
    const { familyId, listId, listName, collaborators } = route.params; // Recebe o nome da lista e os colaboradores
    const { fromHistory } = route.params || {};
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [hideCheckedItems, setHideCheckedItems] = useState(false);
    const [currentUser, setCurrentUser] = useState({name: ""});
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDetails, setItemDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setCurrentUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("Erro ao carregar usuário do AsyncStorage:", error);
            }
        };
        loadUser();
    }, []);
    handleCancelList = () => {
        Alert.alert(
            "Cancelar Lista",
            "Tem certeza de que deseja cancelar esta lista?",
            [
                { text: "Não", style: "cancel" },
                { text: "Sim", onPress: cancelList },
            ]
        );
    };

    // Configura o cabeçalho da navegação
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View>
                    <Text style={styles.headerTitle}>{listName}</Text>
                    <View style={styles.headerSubtitle}>
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
                        <Text style={styles.headerSubtitle}>
                            {collaborators
                                ? Object.values(collaborators)
                                    .map((user) => user.name)
                                    .join(", ")
                                : ""}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={styles.teste} onPress={() => setOptionsModalVisible(true)}>
                    <Svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <Circle cx="12" cy="5" r="1" />
                        <Circle cx="12" cy="12" r="1" />
                        <Circle cx="12" cy="19" r="1" />
                    </Svg>
                </TouchableOpacity>
            ),
        });
    }, [navigation, listName, collaborators, fromHistory]);

    // Função para carregar os itens da lista
    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await fetchShoppingListItems(familyId, listId);
            setItems(data.items || data || []);
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
            Alert.alert("Erro", "Não foi possível carregar os itens da lista.");
        } finally {
            setLoading(false);
        }
    };

    // Função para adicionar um novo item
    const handleAddItem = async (itemName) => {
        if (!itemName.trim()) {
            Alert.alert("Erro", "O nome do item não pode estar vazio.");
            return;
        }
        try {
            // Adiciona o item localmente
            const newItem = { nome: itemName, by_user: currentUser, checado: false };
            setItems((prevItems) => [...prevItems, newItem]);

            // Salva no AsyncStorage
            const cacheKey = `shopping_list_items_${listId}`;
            let cached = await AsyncStorage.getItem(cacheKey);
            let items = [];
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed)) {
                        items = parsed;
                    } else if (parsed && Array.isArray(parsed.items)) {
                        items = parsed.items;
                    }
                } catch (e) {}
            }
            const updatedItems = [...items, newItem];
            await AsyncStorage.setItem(cacheKey, JSON.stringify({ items: updatedItems }));

            // Tenta sincronizar com o servidor
            await addShoppingListItems(familyId, listId, [newItem]);
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            Alert.alert("Erro", "Não foi possível sincronizar o item.");
        }
    };

    // Função para marcar um item como concluído
    const toggleItemCheck = async (itemIndex, currentChecked) => {
        try {
            // Atualiza o estado local diretamente
            setItems((prevItems) =>
                prevItems.map((item, index) =>
                    index === itemIndex ? { ...item, checado: !currentChecked } : item
                )
            );

            // Salva a alteração no AsyncStorage
            const cacheKey = `shopping_list_items_${listId}`;
            const updatedItems = items.map((item, index) =>
                index === itemIndex ? { ...item, checado: !currentChecked } : item
            );
            await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedItems));

            // Tenta sincronizar com o servidor
            await updateShoppingListItem(familyId, listId, itemIndex, {
                checado: !currentChecked,
            });
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
            Alert.alert("Erro", "Não foi possível sincronizar a alteração.");
        }
    };

    // Função para excluir um item
    const deleteItem = async (itemIndex) => {
        try {
            setLoading(true);
            await deleteShoppingListItem(familyId, listId, itemIndex);
            loadItems(); // Recarrega os itens
        } catch (error) {
            console.error("Erro ao excluir item:", error);
            Alert.alert("Erro", "Não foi possível excluir o item.");
        } finally {
            setLoading(false);
        }
    };

    // Função para cancelar a lista
    const cancelList = async () => {
        try {
            setLoading(true);
            await cancelShoppingList(familyId, listId);
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao cancelar lista:", error);
            Alert.alert("Erro", "Não foi possível cancelar a lista.");
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar os detalhes do item
    const fetchItemDetailsHandler = async (itemName) => {
        try {
            setLoadingDetails(true);
            const response = await fetchItemDetails(itemName);
            setItemDetails( response|| []);
        } catch (error) {
            console.error("Erro ao buscar detalhes do item:", error);
            Alert.alert("Erro", "Não foi possível carregar os detalhes do item.");
        } finally {
            setLoadingDetails(false);
        }
    };

    // Função para abrir o modal
    const openDetailModal = (item) => {
        setSelectedItem(item);
        setDetailModalVisible(true);
        fetchItemDetailsHandler(item.nome);
    };

    useEffect(() => {
        if (!familyId || !listId || !collaborators) return;

        // Carrega os itens uma vez (API/cache)
        loadItems();

        setLoading(true);
        const itemsRef = ref(db, `shopping_lists/${familyId}/${listId}/itens`);
        console.log("Referência do Firebase:", itemsRef);

        const handleValueChange = (snapshot) => {
            console.log("Dados recebidos do Firebase:", snapshot.val());
            const data = snapshot.val() || {};
            let itemsArray = Array.isArray(data) ? data : Object.values(data);
            console.log("Itens recebidos:", itemsArray);
            itemsArray = itemsArray
                .filter(Boolean) // remove nulos/undefined
                .map(item => ({
                    ...item,
                    by_user: collaborators && collaborators[item.by_user]
                        ? collaborators[item.by_user]
                        : { name: item.by_user }
                }));

            setItems(itemsArray);
            setLoading(false);
        };

        onValue(itemsRef, handleValueChange);
        console.log("Listener adicionado com sucesso!");

        return () => {
            off(itemsRef, "value", handleValueChange);
            console.log("Listener removido!");
        };
    }, [familyId, listId, collaborators]);

    const filteredItems = (hideCheckedItems
        ? items.filter((item) => !item.checado)
        : items
    ).filter(Boolean); // <-- remove nulos/undefined

    return (
        <View style={styles.container}>
            {/* Modal de Detalhes do Item */}
            <Modal
                visible={isDetailModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setDetailModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedItem?.nome}</Text>
                        {loadingDetails ? (
                            <ActivityIndicator size="large" color="#9b87f5" />
                        ) : itemDetails.length > 0 ? (
                            <FlatList
                                data={itemDetails}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailText}>
                                            {item.SUPERMERCADO} - R${item.PRECO}
                                        </Text>
                                        <Text style={styles.detailSubText}>
                                            {item.TIPO_PRODUTO} • {item.DEPARTAMENTO}
                                        </Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={styles.noDetailsText}>
                                Nenhum dado de preço disponível para este item.
                            </Text>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setDetailModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Opções */}
            <Modal
                visible={optionsModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setOptionsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setOptionsModalVisible(false)}
                >
                    <View style={styles.optionsModal}>
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                setHideCheckedItems((prev) => !prev);
                                setOptionsModalVisible(false);
                            }}
                        >
                            <Text style={styles.optionText}>
                                {hideCheckedItems ? "Mostrar completados" : "Ocultar completados"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                setOptionsModalVisible(false);
                                // Lógica para compartilhar a lista
                            }}
                        >
                            <Text style={styles.optionText}>Compartilhar lista</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionItem, styles.optionDanger]}
                            onPress={() => {
                                setOptionsModalVisible(false);
                                handleCancelList();
                            }}
                        >
                            <Text style={[styles.optionText, styles.optionDangerText]}>
                                Cancelar lista
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {loading ? (
                <ActivityIndicator size="large" color="#9b87f5" />
            ) : (
                <FlatList
                    style={{ padding: 5 }}
                    data={filteredItems}
                    keyExtractor={(item, index) => (item && item.nome ? item.nome + index : index.toString())}
                    renderItem={({ item, index }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.checkbox,
                                    item.checado && styles.checkboxChecked,
                                ]}
                                onPress={() => toggleItemCheck(index, item.checado)}
                            >
                                {item.checado && (
                                    <Svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <Path d="M5 12l5 5L20 7" />
                                    </Svg>
                                )}
                            </TouchableOpacity>
                            <View style={styles.itemDetails}>
                                <Text
                                    style={[
                                        styles.itemText,
                                        item.checado && styles.itemChecked,
                                    ]}
                                >
                                    {item.nome}
                                </Text>
                                <Text style={styles.itemCreator}>{item.by_user.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => openDetailModal(item)}>
                                <Svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#9b87f5"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <Path d="M12 1v22" />
                                    <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
                                </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteItem(index)}>
                                <Svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#DA291C"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <Path d="M3 6h18" />
                                    <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <Line x1="10" y1="11" x2="10" y2="17" />
                                    <Line x1="14" y1="11" x2="14" y2="17" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)} // Abre o modal para adicionar itens
            >
                <Svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <Path d="M12 5v14M5 12h14" />
                </Svg>
            </TouchableOpacity>

            <CreateItemModal
                addShoppingListItems={addShoppingListItems}
                visible={isModalVisible}
                items={items}
                onClose={() => setModalVisible(false)}
                onAddItem={handleAddItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    teste: {
        marginRight: 10,
    },
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#f9f9ff",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    itemText: {
        fontSize: 16,
        color: "#333",
    },
    itemCreator: {
        fontSize: 12,
        color: "#666",
    },
    itemChecked: {
        textDecorationLine: "line-through",
        color: "#aaa",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#9b87f5",
        borderRadius: 50,
        width: 56,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#9b87f5",
        borderColor: "#9b87f5",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    optionsModal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },
    optionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
    optionDanger: {
        borderBottomWidth: 0,
    },
    optionDangerText: {
        color: "#DA291C",
    },
    detailModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    detailModal: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    detailModalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    detailItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    detailText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    detailSubText: {
        fontSize: 14,
        color: "#666",
    },
    closeButton: {
        backgroundColor: "#9b87f5",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    noDetailsText: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 10,
    },
});

export default ListDetailsScreen;