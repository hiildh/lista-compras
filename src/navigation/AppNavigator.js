import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import HomeScreen from "../screens/HomeScreen";
import FamilySettings from "../screens/FamilySettings"; // Importar a nova tela
import ListDetailsScreen from "../screens/ListDetailsScreen"; // Importar a nova tela
import HistoryScreen from "../screens/HistoryScreen"; // Importar a nova tela
import { getAuthData } from "../services/storage";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { token } = await getAuthData();
            setIsAuthenticated(!!token); // Define se o usuário está autenticado
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        // Exibe uma tela de carregamento enquanto verifica a autenticação
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="FamilySettings" component={FamilySettings} options={{ title: "Configurações da Família" }}/>
                <Stack.Screen name="ListDetails" component={ListDetailsScreen} options={{ title: "Detalhes da Lista" }}/>
                <Stack.Screen name="History" component={HistoryScreen} options={{ title: "Histórico de Listas" }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;