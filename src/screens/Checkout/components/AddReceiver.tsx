import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { getCairoFont } from "../../../ultis/getFont";

const ReceiverModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) {
      alert("Please enter both name and phone number");
      return;
    }
    onAdd({ name, phone });
    setName("");
    setPhone("");
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={() => console.log('requested close')} transparent animationType="fade">
      <Pressable onPress={onClose} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={[styles.header, getCairoFont('700')]}>Receiver Information</Text>

          <TextInput
            style={[styles.input, getCairoFont('600')]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, getCairoFont('600')]}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={[styles.buttonText,getCairoFont('600')]}>Add Receiver</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ReceiverModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "tomato",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
