import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { fetchHistory } from "../services/api";
import { ShoppingNavBar } from "../components/ShoppingNavBar";

const HistoryScreen = ({ navigation }) => {
    const [familyId, setFamilyId] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadFamilyId = async () => {
            try {
                const storedFamilyId = await AsyncStorage.getItem("family_id");
                if (storedFamilyId) {
                    setFamilyId(storedFamilyId);
                } else {
                    Alert.alert("Erro", "ID da família não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao carregar o ID da família:", error);
                Alert.alert("Erro", "Não foi possível carregar o ID da família.");
            }
        };

        loadFamilyId();
    }, []);

    useEffect(() => {
        const loadHistory = async () => {
            if (!familyId) return;

            try {
                setLoading(true);
                const data = await fetchHistory(familyId);

                // Transformar o objeto em um array
                const historyArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                setHistory(historyArray);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
                Alert.alert("Erro", "Não foi possível carregar o histórico.");
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [familyId]);

    const renderHistoryItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("ListDetails", {
                    familyId: item.familia,
                    listId: item.id,
                    listName: item.nome,
                    collaborators: item.usuarios_vinculados_lista || [],
                    fromHistory: true, // <-- Adicione isso!
                })
            }
        >
            <View style={[styles.card, item.status === "cancelada"]}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        <Text style={styles.familyName}>{item.family_name || "Família desconhecida"}</Text>
                    </View>
                    <Text style={[styles.status, item.status === "cancelada" ? styles.cancelledStatus : styles.completedStatus]}>
                        {item.status === "cancelada" ? "Cancelada" : "Concluída"}
                    </Text>
                </View>
                <Text style={styles.cardItems}>{item.itens?.length || 0} itens</Text>
                <View style={styles.cardDetails}>
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
                        <Text style={styles.cardDate}>{new Date(item.data).toLocaleDateString()}</Text>
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
                        <Text style={styles.cardDetailsText}>
                            Por: {item.by_user?.name || "Desconhecido"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#9b87f5" />
            ) : history.length > 0 ? (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderHistoryItem}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum histórico encontrado.</Text>
                </View>
            )}
            <ShoppingNavBar navigation={navigation} isDetailScreen={true} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#f9f9ff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#9b87f5",
        marginBottom: 16,
    },
    list: {
        paddingBottom: 60,
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    familyName: {
        fontSize: 14,
        color: "#6c757d",
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        textAlign: "center",
    },
    completedStatus: {
        backgroundColor: "#d4edda",
        color: "#155724",
    },
    cancelledStatus: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
    },
    cardDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    metaInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardDate: {
        fontSize: 14,
        color: "#6c757d",
        marginLeft: 4,
    },
    cardDetailsText: {
        fontSize: 14,
        color: "#6c757d",
        marginLeft: 4,
    },
    cardItems: {
        fontSize: 14,
        color: "#6c757d",
        marginBottom: 4,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
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
    },
});

export default HistoryScreen;