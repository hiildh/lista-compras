import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const CreateListModal = ({ visible, onClose, onCreate, families }) => {
    const [listName, setListName] = useState("");
    const [selectedFamily, setSelectedFamily] = useState(families?.[0]?.id || "");

    const handleCreate = () => {
        if (!listName.trim()) {
            alert("Por favor, insira um nome para a lista.");
            return;
        }
        if (!selectedFamily) {
            alert("Por favor, selecione uma família.");
            return;
        }
        onCreate({ name: listName, familyId: selectedFamily });
        setListName("");
        setSelectedFamily(families?.[0]?.id || "");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Nova Lista de Compras</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da lista (ex: Compras do mês)"
                        value={listName}
                        onChangeText={setListName}
                    />
                    <Picker
                        selectedValue={selectedFamily}
                        onValueChange={(itemValue) => setSelectedFamily(itemValue)}
                        style={styles.picker}
                    >
                        {families.map((family) => (
                            <Picker.Item
                                key={family.id}
                                label={family.name} // Exibe o nome da família
                                value={family.id} // Usa o ID da família como valor
                            />
                        ))}
                    </Picker>
                    <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                        <Text style={styles.createButtonText}>Criar Lista</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    createButton: {
        backgroundColor: "#9b87f5",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 8,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default CreateListModal;