import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthForm } from '../components/AuthForm';

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>FamilyShop</Text>
                <Text style={styles.subtitle}>
                    Listas de compras compartilhadas com sua família
                </Text>
            </View>
            <View style={styles.formContainer}>
                <AuthForm navigation={navigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9ff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9b87f5',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default Login;