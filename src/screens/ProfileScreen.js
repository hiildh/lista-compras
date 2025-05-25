import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { ShoppingNavBar } from "../components/ShoppingNavBar";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Polyline, Line } from "react-native-svg";

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({ name: "", email: "" });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                const userData = await AsyncStorage.getItem("user");
                console.log(userData);
                if (userData) {
                    const parsed = JSON.parse(userData);
                    setUser(parsed);
                    setName(parsed.name);
                    setEmail(parsed.email);
                }
            } catch (e) {
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleEditProfile = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("Erro", "Nome e email não podem estar vazios.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.patch("/users/me", { name, email });
            setUser(res.data.user);
            await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
            setEditing(false);
            console.log(res.data.user);
            setName(res.data.user.name);
            setEmail(res.data.user.email);
            Alert.alert("Sucesso", "Perfil atualizado!");
        } catch (e) {
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#9b87f5" />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                        {user.name ? user.name[0].toUpperCase() : "?"}
                    </Text>
                </View>
                {editing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nome"
                        />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonOutline} onPress={() => setEditing(false)}>
                            <Text style={styles.buttonOutlineText}>Cancelar</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                        <TouchableOpacity style={styles.buttonOutline} onPress={() => setEditing(true)}>
                            <Text style={styles.buttonOutlineText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.row}>
                    <Text style={styles.prefLabel}>Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Gerenciamento de Conta</Text>
                <TouchableOpacity style={styles.logoutRow} onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.navigate("Login");
                    // Alert.alert(
                    //     "Sair",
                    //     "Você tem certeza que deseja sair?",
                    //     [
                    //         { text: "Cancelar", style: "cancel" },
                    //         {
                    //             text: "Sair",
                    //             onPress: async () => {
                    //                 await AsyncStorage.clear();
                    //                 navigation.navigate("Login");
                    //             },
                    //         },
                    //     ],
                    //     { cancelable: false }
                    // );
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.logoutText}>Log Out</Text>
                        {/* SVG Icon */}
                        <Svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ff7f97"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginRight: 8 }}
                        >
                            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <Polyline points="16 17 21 12 16 7" />
                            <Line x1="21" y1="12" x2="9" y2="12" />
                        </Svg>
                    </View>
                </TouchableOpacity>
            </View>

            <ShoppingNavBar navigation={navigation} isDetailScreen={true} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9ff", padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 16, alignSelf: "center" },
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#9b87f5", alignSelf: "center", justifyContent: "center", alignItems: "center", marginBottom: 12 },
    avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
    profileName: { fontSize: 20, fontWeight: "bold", color: "#333", textAlign: "center" },
    profileEmail: { fontSize: 14, color: "#6c757d", textAlign: "center", marginBottom: 12 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f9f9f9", marginBottom: 10 },
    button: { backgroundColor: "#9b87f5", borderRadius: 8, padding: 12, alignItems: "center", marginTop: 8 },
    buttonText: { color: "#fff", fontWeight: "bold" },
    buttonOutline: { borderWidth: 1, borderColor: "#9b87f5", borderRadius: 8, padding: 12, alignItems: "center", marginTop: 8 },
    buttonOutlineText: { color: "#9b87f5", fontWeight: "bold" },
    sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#333" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    prefLabel: { fontSize: 15, color: "#333" },
    accountLabel: { fontSize: 15, color: "#333" },
    logoutRow: { marginTop: 8 },
    logoutText: { color: "#ff7f97", fontWeight: "bold", fontSize: 15 },
});

export default ProfileScreen;