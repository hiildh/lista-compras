import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import api from "../services/api";

const CreateItemModal = ({ visible, onClose, onAddItem, items }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Função para buscar sugestões
    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            setLoadingSuggestions(true);
            const response = await api.get("/items/suggestions", {
                params: { q: query },
            });
            setSuggestions(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Atualiza as sugestões conforme o usuário digita
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions(searchQuery);
        }, 300); // Aguarda 300ms antes de buscar sugestões

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Função para adicionar o item
    const handleAddItem = (itemName) => {
        if (!itemName.trim()) {
            alert("Por favor, insira um nome para o item.");
            return;
        }
        const itemExists = Array.isArray(items) && items.some(
            (item) => item.nome.toLowerCase() === itemName.trim().toLowerCase()
        );
        if (itemExists) {
            alert("Item já existe na lista.");
            return;
        }
        onAddItem(itemName);
        setSearchQuery("");
        setSuggestions([]);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Adicionar Item</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome do item"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {loadingSuggestions ? (
                        <ActivityIndicator size="small" color="#9b87f5" />
                    ) : (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => handleAddItem(item.nome)}
                                >
                                    <Text style={styles.suggestionText}>{item.nome}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                searchQuery.trim() && (
                                    <Text style={styles.noSuggestionsText}>
                                        Nenhuma sugestão encontrada.
                                    </Text>
                                )
                            }
                        />
                    )}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddItem(searchQuery)}
                    >
                        <Text style={styles.addButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    suggestionText: {
        fontSize: 16,
        color: "#333",
    },
    noSuggestionsText: {
        textAlign: "center",
        fontSize: 14,
        color: "#6c757d",
        marginVertical: 8,
    },
    addButton: {
        backgroundColor: "#9b87f5",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 8,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default CreateItemModal;