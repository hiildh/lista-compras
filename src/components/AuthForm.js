import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { validateName, validateEmail, validatePassword } from "../utils/validation";
import { login, register } from "../services/api";

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        let error;

        if (!isLogin) {
            error = validateName(name);
            if (error) return Alert.alert("Erro", error);
        }

        error = validateEmail(email);
        if (error) return Alert.alert("Erro", error);

        error = validatePassword(password);
        if (error) return Alert.alert("Erro", error);

        try {
            if (isLogin) {
                const data = await login(email, password);
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                console.log(data); // Substitua por navegação ou lógica adicional
            } else {
                const data = await register(name, email, password);
                Alert.alert("Sucesso", "Conta criada com sucesso!");
                console.log(data); // Substitua por navegação ou lógica adicional
            }
        } catch (err) {
            Alert.alert("Erro", err);
        }
    };

    return (
        <View>
            <Text style={styles.title}>{isLogin ? "Entrar" : "Criar uma conta"}</Text>
            <Text style={styles.description}>
                {isLogin
                    ? "Digite suas credenciais para acessar sua conta"
                    : "Digite seus dados para criar sua conta"}
            </Text>

            {!isLogin && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.togglePassword}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.togglePasswordText}>
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isLogin ? "Entrar" : "Continuar"}
                </Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                <Text style={styles.link} onPress={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Cadastre-se" : "Entre"}
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: "#333",
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    togglePassword: {
        position: "absolute",
        right: 12,
        top: 12,
    },
    togglePasswordText: {
        color: "#9b87f5",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#9b87f5",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    footerText: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        marginTop: 16,
    },
    link: {
        color: "#9b87f5",
        fontWeight: "bold",
    },
});