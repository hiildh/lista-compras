import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { ShoppingNavBar } from "../components/ShoppingNavBar";
import { Plus, X, ArrowRight } from "lucide-react-native";

const FamilySettings = ({ navigation }) => {
    const [familyCode, setFamilyCode] = useState("FAM-123456");
    const [inviteEmail, setInviteEmail] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [familyMembers, setFamilyMembers] = useState([
        {
        id: "1",
        name: "João Silva",
        email: "joao@example.com",
        },
        {
        id: "2",
        name: "Maria Oliveira",
        email: "maria@example.com",
        },
    ]);

    const handleInvite = () => {
        if (!inviteEmail) {
        Alert.alert("Erro", "Por favor, insira um email válido.");
        return;
        }
        Alert.alert("Convite enviado", `Convite enviado para ${inviteEmail}`);
        setInviteEmail("");
    };

    const handleJoinFamily = () => {
        if (!joinCode) {
            Alert.alert("Erro", "Por favor, insira um código de família válido.");
            return;
        }
        Alert.alert("Família encontrada", `Você foi adicionado à família com o código ${joinCode}`);
        setJoinCode("");
    };

    const handleRemoveMember = (id) => {
        setFamilyMembers(familyMembers.filter((member) => member.id !== id));
        Alert.alert("Membro removido", "Membro removido da família com sucesso.");
    };

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Configurações da Família</Text>

            {/* Código da Família */}
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
                onPress={() => {
                    Alert.alert("Código copiado", "Código copiado para a área de transferência.");
                }}
                >
                <Text style={styles.buttonText}>Copiar</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* Entrar em uma Família */}
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
                <ArrowRight size={18} color="#6c757d" />
                </TouchableOpacity>
            </View>
            </View>

            {/* Convidar Membro */}
            <View style={styles.card}>
            <Text style={styles.cardTitle}>Convidar Membro</Text>
            <Text style={styles.cardDescription}>Envie um convite por email</Text>
            <View style={styles.row}>
                <TextInput
                style={styles.input}
                placeholder="Email"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                />
                <TouchableOpacity style={styles.buttonDefault} onPress={handleInvite}>
                <Plus size={18} color="#fff" />
                </TouchableOpacity>
            </View>
            </View>

            {/* Membros da Família */}
            <View style={styles.card}>
            <Text style={styles.cardTitle}>Membros da Família</Text>
            <Text style={styles.cardDescription}>Gerenciar membros da família</Text>
            {familyMembers.map((member) => (
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
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMember(member.id)}
                >
                    <X size={18} color="#ef4444" />
                </TouchableOpacity>
                </View>
            ))}
            </View>
        </ScrollView>

        <ShoppingNavBar navigation={navigation} />
        </View>
    );
};

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