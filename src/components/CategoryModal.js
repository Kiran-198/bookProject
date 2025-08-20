import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from "react-native";

export default function CategoryModal({
  visible,
  categories,
  selectedCategory,
  onSelect,
  onClose
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Outer touch to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Inner touch to prevent closing */}
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.selectedCategory
                  ]}
                  onPress={() => {
                    onSelect(cat);
                    onClose();
                  }}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 6,
  },
  selectedCategory: {
    backgroundColor: "#f5be84",
  },
  categoryText: {
    textAlign: "center",
    fontSize: 16,
  },
});
