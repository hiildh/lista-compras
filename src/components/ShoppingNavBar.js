import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, History, Users, UserCircle, Plus } from "lucide-react-native";

export const ShoppingNavBar = ({ onAdd, navigation, isDetailScreen = false }) => {
    const isActive = (routeName) => {
        return navigation.getState().routes[navigation.getState().index].name === routeName;
    };

    if (isDetailScreen == false) {
        return (
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Home size={24} color={isActive("Home") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("Home") && styles.activeText]}>Listas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
                    <History size={24} color={isActive("History") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("History") && styles.activeText]}>Histórico</Text>
                </TouchableOpacity>

                <View style={styles.createButtonContainer}>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={onAdd}
                    >
                        <Plus size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FamilySettings")}>
                    <Users size={24} color={isActive("FamilySettings") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("FamilySettings") && styles.activeText]}>Família</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <UserCircle size={24} color={isActive("Profile") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("Profile") && styles.activeText]}>Perfil</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
                return (
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Home size={24} color={isActive("Home") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("Home") && styles.activeText]}>Listas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
                    <History size={24} color={isActive("History") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("History") && styles.activeText]}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FamilySettings")}>
                    <Users size={24} color={isActive("FamilySettings") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("FamilySettings") && styles.activeText]}>Família</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <UserCircle size={24} color={isActive("Profile") ? "#9b87f5" : "#6c757d"} />
                    <Text style={[styles.navText, isActive("Profile") && styles.activeText]}>Perfil</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: "#6c757d",
        marginTop: 4,
    },
    activeText: {
        color: "#9b87f5",
    },
    createButtonContainer: {
        alignItems: "center",
        marginTop: -28, // Eleva o botão acima da Navbar
    },
    createButton: {
        backgroundColor: "#9b87f5",
        height: 56,
        width: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
});