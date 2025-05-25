import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { ShoppingNavBar } from "../components/ShoppingNavBar";
import { Plus, X, ArrowRight } from "lucide-react-native";
import { fetchFamilies, fetchFamilyMembers, joinFamily } from "../services/api";
import * as Clipboard from "expo-clipboard";
import { db } from "../../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const FamilySettings = ({ navigation }) => {
    const [familyCode, setFamilyCode] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [currentUserId, setCurrentUserId] = useState("");
    const [loadingFamilies, setLoadingFamilies] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => {
        const loadFamilies = async () => {
            setLoadingFamilies(true);
            try {
                const res = await fetchFamilies();
                const parsed = JSON.parse(res);
                setFamilies(parsed.families || []);
                if (parsed.families && parsed.families.length > 0) {
                    setSelectedFamily(parsed.families[0]);
                    setFamilyCode(parsed.families[0].code || "");
                    setCurrentUserId(parsed.families[0].owner || "");
                }
            } catch (e) {
                Alert.alert("Erro", "Não foi possível carregar as famílias.");
            } finally {
                setLoadingFamilies(false);
            }
        };
        loadFamilies();
    }, []);

    useEffect(() => {
        const loadMembers = async () => {
            if (!selectedFamily) return;
            setLoadingMembers(true);
            try {
                const res = await fetchFamilyMembers(selectedFamily.id);
                setFamilyMembers(Object.values(res.members || {}));
                setFamilyCode(selectedFamily.code || "");
                if (selectedFamily.owner) setCurrentUserId(selectedFamily.owner);
            } catch (e) {
                setFamilyMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        };
        loadMembers();
    }, [selectedFamily]);

    useEffect(() => {
        if (!selectedFamily) return;

        // Referência para os membros da família no Realtime Database
        const membersRef = ref(db, `families/${selectedFamily.id}/members`);

        // Função que será chamada sempre que houver mudança
        const handleValueChange = (snapshot) => {
            const data = snapshot.val() || {};
            setFamilyMembers(Object.values(data));
        };

        // Adiciona o listener
        onValue(membersRef, handleValueChange);

        // Remove o listener ao desmontar ou trocar de família
        return () => {
            off(membersRef, "value", handleValueChange);
        };
    }, [selectedFamily]);

    const handleInvite = () => {
        if (!inviteEmail.trim()) {
            Alert.alert("Erro", "Por favor, insira um email válido.");
            return;
        }
        Alert.alert("Convite enviado", `Convite enviado para ${inviteEmail}`);
        setInviteEmail("");
    };

    const handleJoinFamily = async () => {
        if (!joinCode.trim()) {
            Alert.alert("Erro", "Por favor, insira um código de família válido.");
            return;
        }
        try {
            setLoadingFamilies(true);
            await joinFamily(joinCode);
            Alert.alert("Sucesso", "Você entrou na família!");
            setJoinCode("");
            const res = await fetchFamilies();
            const parsed = JSON.parse(res);
            setFamilies(parsed.families || []);
            if (parsed.families && parsed.families.length > 0) {
                setSelectedFamily(parsed.families[0]);
                setFamilyCode(parsed.families[0].code || "");
                setCurrentUserId(parsed.families[0].owner || "");
            }
        } catch (e) {
            Alert.alert("Erro", "Não foi possível entrar na família.");
        } finally {
            setLoadingFamilies(false);
        }
    };

    const handleRemoveMember = (id) => {
        if (!id) return;
        setFamilyMembers(familyMembers.filter((member) => member.id !== id));
        Alert.alert("Membro removido", "Membro removido da família com sucesso.");
    };

    const handleCopyCode = async () => {
        if (!familyCode.trim()) {
            Alert.alert("Erro", "Nenhum código para copiar.");
            return;
        }
        await Clipboard.setStringAsync(familyCode);
        Alert.alert("Código copiado", "Código copiado para a área de transferência.");
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {loadingFamilies ? (
                    <ActivityIndicator size="large" color="#9b87f5" style={{ marginVertical: 32 }} />
                ) : (
                    <>
                        {families.length > 1 && (
                            <ScrollView horizontal style={{ marginBottom: 16 }}>
                                {families.map(fam => (
                                    <TouchableOpacity
                                        key={fam.id}
                                        style={[
                                            styles.buttonOutline,
                                            selectedFamily?.id === fam.id && { backgroundColor: "#9b87f5" }
                                        ]}
                                        onPress={() => setSelectedFamily(fam)}
                                    >
                                        <Text style={{ color: selectedFamily?.id === fam.id ? "#fff" : "#9b87f5" }}>
                                            {fam.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Código da Família</Text>
                            <Text style={styles.cardDescription}>
                                Compartilhe este código para convidar pessoas para sua família
                            </Text>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, styles.readOnlyInput]}
                                    value={familyCode}
                                    editable={false}
                                />
                                <TouchableOpacity
                                    style={styles.buttonOutline}
                                    onPress={handleCopyCode}
                                >
                                    <Text style={styles.buttonText}>Copiar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Entrar em uma Família</Text>
                            <Text style={styles.cardDescription}>
                                Insira o código da família que deseja participar
                            </Text>
                            <View style={styles.row}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Código da família"
                                    value={joinCode}
                                    onChangeText={setJoinCode}
                                />
                                <TouchableOpacity style={styles.buttonOutline} onPress={handleJoinFamily}>
                                    <ArrowRight size={18} color="#9b87f5" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Membros da Família</Text>
                            <Text style={styles.cardDescription}>Gerenciar membros da família</Text>
                            {loadingMembers ? (
                                <ActivityIndicator size="small" color="#9b87f5" style={{ marginVertical: 16 }} />
                            ) : (
                                familyMembers.map((member) => (
                                    <View key={member.id} style={styles.memberRow}>
                                        <View style={styles.memberInfo}>
                                            <View style={styles.avatar}>
                                                <Text style={styles.avatarText}>
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.memberName}>{member.name}</Text>
                                                <Text style={styles.memberEmail}>{member.email}</Text>
                                            </View>
                                        </View>
                                        {member.id !== currentUserId && (
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveMember(member.id)}
                                            >
                                                <X size={18} color="#ef4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
            <ShoppingNavBar navigation={navigation} isDetailScreen={true} />
        </View>
    );
};
// Verificar pusher do firebase para modificar o estado de novos membros
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9ff",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#9b87f5",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: "#6c757d",
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: "#fff",
        marginRight: 8,
    },
    readOnlyInput: {
        backgroundColor: "#f1f5f9",
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: "#9b87f5",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonDefault: {
        backgroundColor: "#9b87f5",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#9b87f5",
        fontWeight: "bold",
    },
    memberRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 8,
    },
    memberInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        backgroundColor: "#9b87f5",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    memberName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    memberEmail: {
        fontSize: 14,
        color: "#6c757d",
    },
    removeButton: {
        padding: 8,
    },
});

export default FamilySettings;