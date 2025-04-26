import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { clearAuthData } from "../services/storage";

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
        await clearAuthData(); // Limpa os dados do AsyncStorage
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Redireciona para a tela de login
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à FamilyShop!</Text>
            <Text style={styles.subtitle}>Aqui será sua página inicial.</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9ff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#9b87f5",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6c757d",
        textAlign: "center",
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#9b87f5",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;