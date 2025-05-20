import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { validateName, validateEmail, validatePassword } from "../utils/validation";
import { login, register } from "../services/api";
import { saveAuthData } from "../services/storage";
import axios from "axios";

export const AuthForm = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true); // agora inicia em login
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");

    const handleSubmit = async () => {
        let error;

        if (showReset) {
            // Validação para reset de senha
            error = validateEmail(resetEmail);
            if (error) return Alert.alert("Erro", error);

            error = validatePassword(resetNewPassword);
            if (error) return Alert.alert("Erro", error);

            try {
                await axios.post("/auth/reset-password", {
                    email: resetEmail,
                    new_password: resetNewPassword,
                });
                Alert.alert("Sucesso", "Senha redefinida! Faça login com a nova senha.");
                setShowReset(false);
                setResetEmail("");
                setResetNewPassword("");
            } catch (err) {
                Alert.alert("Erro", "Não foi possível redefinir a senha.");
            }
            return;
        }

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
                const { access_token, family_id, user } = data;
                await saveAuthData(access_token, family_id, user);
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                navigation.navigate("Home");
            } else {
                const data = await register(name, email, password);
                const { access_token, family_id } = data;
                await saveAuthData(access_token, family_id);
                Alert.alert("Sucesso", "Conta criada com sucesso!");
                navigation.navigate("Home");
            }
        } catch (err) {
            Alert.alert("Erro", "Ocorreu um erro ao processar sua solicitação.");
        }
    };

    return (
        <View>
            <Text style={styles.title}>
                {showReset
                    ? "Redefinir senha"
                    : isLogin
                    ? "Entrar"
                    : "Criar uma conta"}
            </Text>
            <Text style={styles.description}>
                {showReset
                    ? "Informe seu email e a nova senha"
                    : isLogin
                    ? "Digite suas credenciais para acessar sua conta"
                    : "Digite seus dados para criar sua conta"}
            </Text>

            {showReset ? (
                <>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={resetEmail}
                            onChangeText={setResetEmail}
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nova senha"
                            value={resetNewPassword}
                            onChangeText={setResetNewPassword}
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
                </>
            ) : (
                <>
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
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {showReset
                        ? "Redefinir senha"
                        : isLogin
                        ? "Entrar"
                        : "Continuar"}
                </Text>
            </TouchableOpacity>

            {!showReset && isLogin && (
                <TouchableOpacity
                    style={{ marginTop: 12, alignSelf: "center" }}
                    onPress={() => setShowReset(true)}
                >
                    <Text style={[styles.link, { fontSize: 14 }]}>
                        Esqueci minha senha
                    </Text>
                </TouchableOpacity>
            )}

            {!showReset && (
                <Text style={styles.footerText}>
                    {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                    <Text style={styles.link} onPress={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Cadastre-se" : "Entre"}
                    </Text>
                </Text>
            )}

            {showReset && (
                <TouchableOpacity
                    style={{ marginTop: 12, alignSelf: "center" }}
                    onPress={() => setShowReset(false)}
                >
                    <Text style={[styles.link, { fontSize: 14 }]}>
                        Voltar para o login
                    </Text>
                </TouchableOpacity>
            )}
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