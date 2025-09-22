import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
//   Image,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchIcon } from "../../icons/SearchIcon";
import { handleGetCategories } from "../../apis/handleGetCategories";
import { ArrowDownIcon } from "../../icons/ArrowDownIcon";
import LoadingSpinner from "../../components/Loading";
import { useLanguage } from "../../LanguageProvider";
import { t } from "i18next";
// import { AntDesign } from "@expo/vector-icons"; // for arrow icon

type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  image: any;
  subCategories: { name_en: string; name_ar: string; image: any }[];
};

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Categories({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isRTL } = useLanguage()

  const handleCategoryPress = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategory(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    setLoading(true)
    handleGetCategories().then((res: any) => {
        setLoading(false)
        setCategoriesData(res)
    });
  }, []);

  const handleSelectSubCategory = (item) => {
    console.log("Selected Subcategory:", item);

    navigation.navigate('ProductsList', {
        params: {
            categoryId: item.parentId ? item.parentId : item.id,
            subCategoryId: item.id,
            subCategoryName_en: item.name_en,
            subCategoryName_ar: item.name_ar,
        }
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingSpinner overlay/> }
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#999" />
        <TextInput
          placeholder="Search categories"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Header */}
      <Text style={styles.header}>{t('categories')}</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {categoriesData.map(item => (
          <View key={item.id} style={styles.categoryBlock}>
            {/* Category Row */}
            <TouchableOpacity
              style={[
                styles.categoryRow,
                selectedCategory === item.id && { backgroundColor: "#F3F3F3" },
              ]}
              onPress={() => handleCategoryPress(item.id)}
              activeOpacity={0.8}
            >
              {/* <Image source={item.image} style={styles.categoryIcon} /> */}
              <Text style={styles.categoryLabel}>{isRTL ? item.name_ar : item.name_en}</Text>
              {/* <AntDesign
                name={selectedCategory === item.id ? "up" : "down"}
                size={18}
                color="#666"
                style={{ marginLeft: "auto" }}
              /> */}
              <View style={{ flex: 1 }} /> 
              <ArrowDownIcon color='#E0E0E0' size={22} /> 
            </TouchableOpacity>

            {/* Subcategories */}
            {selectedCategory === item.id && (
              <View style={styles.subcategoryContainer}>
                {item.subCategories.map((sub, i) => (
                  <TouchableOpacity key={i} style={styles.subcategoryRow} onPress={() => handleSelectSubCategory(sub)}>
                    {/* <Image source={sub.image} style={styles.subcategoryIcon} /> */}
                    <Text style={styles.subcategoryText}>{isRTL ? sub.name_ar :sub.name_en}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    color: "#000",
    marginLeft: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: 'left'
  },
  categoryBlock: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    resizeMode: "contain",
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  subcategoryContainer: {
    backgroundColor: "#F8F8F8",
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  subcategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  subcategoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: '600'
  },
  subcategoryIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
});
