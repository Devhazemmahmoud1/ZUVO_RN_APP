import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { handleGetCategories } from "../../../../apis/handleGetCategories";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CategoriesFilter = ({ visible, setVisible, handleSelectValue }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleGetCategories().then((res) => {
      setCategories(res);
      setLoading(false);
    });
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) {
        return prev.filter((s) => s.id !== id);
      }
      return [...prev, { id, name }];
    });
  };

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  // Recursive render
  const renderCategory = (item: any, level = 0) => {
    const isExpanded = expanded[item.id];
    const hasChildren = item.subCategories && item.subCategories.length > 0;

    return (
      <View key={item.id} style={{ marginLeft: level * 16 }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              toggleSelect(item.id, item.name_en);
            }
          }}
        >
          <Text style={styles.rowTitle}>{item.name_en}</Text>
          {hasChildren ? (
            <Text style={styles.expandIcon}>{isExpanded ? "−" : "+"}</Text>
          ) : (
            <View
              style={[
                styles.checkbox,
                isSelected(item.id) && styles.checkboxSelected,
              ]}
            >
              {isSelected(item.id) && <View style={styles.checkboxInner} />}
            </View>
          )}
        </TouchableOpacity>

        {isExpanded &&
          item.subCategories?.map((sub: any) =>
            renderCategory(sub, level + 1)
          )}
      </View>
    );
  };

  // Flatten categories for searching
  const flattenCategories = useCallback(
    (cats: any[], parentExpanded: string[] = []) => {
      let result: any[] = [];
      cats.forEach((cat) => {
        result.push({ ...cat, parentExpanded });
        if (cat.subCategories?.length > 0) {
          result = result.concat(
            flattenCategories(cat.subCategories, [...parentExpanded, cat.id])
          );
        }
      });
      return result;
    },
    [] // Add dependencies here if flattenCategories uses any variables from the component
  );

  const allCategories = useMemo(() => flattenCategories(categories), [categories, flattenCategories]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const match = allCategories.filter((c) =>
      c.name_en.toLowerCase().includes(search.toLowerCase())
    );
    if (match.length === 0) return [];
    // auto-expand parents of first match
    const first = match[0];
    first.parentExpanded.forEach((id: string) => {
      setExpanded((prev) => ({ ...prev, [id]: true }));
    });
    return categories;
  }, [allCategories, search, categories]);

  const resetSelection = () => setSelected([]);
  const applySelection = () => {
    handleSelectValue("category", selected);
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nestedContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Categories</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search categories..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* Content */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCategory(item)}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}

          {/* Footer */}
          <SafeAreaView style={styles.footerSafeArea}>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetSelection}
              >
                <Text style={styles.footerTextReset}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={applySelection}
              >
                <Text style={styles.footerText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  nestedContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600" },
  cancel: { marginTop: 3, fontSize: 15, color: "tomato" },
  searchContainer: { marginVertical: 10 },
  searchInput: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowTitle: { fontSize: 15, fontWeight: "500", color: "#152032" },
  expandIcon: { fontSize: 20, fontWeight: "bold", color: "#007bff" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#007bff",
    backgroundColor: "#007bff",
  },
  checkboxInner: { width: 10, height: 10, backgroundColor: "#fff" },
  footerSafeArea: {
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 0,
  },
  resetBtn: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 6,
    marginRight: 8,
  },
  applyBtn: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 6,
    marginLeft: 8,
  },
  footerText: { color: "#fff", fontWeight: "600" },
  footerTextReset: { color: "#007bff", fontWeight: "600", fontSize: 15 },
});

export default CategoriesFilter;
