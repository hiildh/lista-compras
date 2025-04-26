import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à FamilyShop!</Text>
            <Text style={styles.subtitle}>Aqui será sua página inicial.</Text>
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
    },
});

export default HomeScreen;