import React, { useEffect, useRef, useState } from "react";
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
  Pressable,
  Animated,
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

  // Animated rotation values for arrows per-category
  const arrowAnims = useRef(new Map<string, Animated.Value>()).current;
  const getArrow = (id: string) => {
    if (!arrowAnims.has(id)) arrowAnims.set(id, new Animated.Value(0));
    return arrowAnims.get(id)!;
  };

  const animateToggle = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
  };

  const handleCategoryPress = (id: string) => {
    const currentlyOpen = selectedCategory;
    // Animate list layout changes
    animateToggle();
    // Rotate arrows: close previous, open new
    if (currentlyOpen && currentlyOpen !== id) {
      Animated.timing(getArrow(currentlyOpen), {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
    const willOpen = currentlyOpen !== id;
    Animated.timing(getArrow(id), {
      toValue: willOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();

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
          placeholder={t('search')}
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
            <Pressable
              style={[
                styles.categoryRow,
                selectedCategory === item.id && styles.categoryRowActive,
              ]}
              onPress={() => handleCategoryPress(item.id)}
              android_ripple={{ color: '#EAEAEA' }}
            >
              {/* <Image source={item.image} style={styles.categoryIcon} /> */}
              <Text style={[styles.categoryLabel, isRTL ? { textAlign: 'left' } : undefined]}>{isRTL ? item.name_ar : item.name_en}</Text>
              {/* <AntDesign
                name={selectedCategory === item.id ? "up" : "down"}
                size={18}
                color="#666"
                style={{ marginLeft: "auto" }}
              /> */}
              <View style={{ flex: 1 }} /> 
              <Animated.View
                style={{
                  transform: [{
                    rotate: getArrow(item.id).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
                  }]
                }}
              >
                <ArrowDownIcon color='#A0A0A0' size={20} />
              </Animated.View>
            </Pressable>

            {/* Subcategories */}
            {selectedCategory === item.id && (
              <View style={styles.subcategoryContainer}>
                {item.subCategories.map((sub, i) => (
                  <Pressable
                    key={i}
                    style={[styles.subcategoryRow, i === item.subCategories.length - 1 ? { borderBottomWidth: 0 } : null]}
                    onPress={() => handleSelectSubCategory(sub)}
                    android_ripple={{ color: '#E3E3E3' }}
                  >
                    {/* <Image source={sub.image} style={styles.subcategoryIcon} /> */}
                    <Text style={[styles.subcategoryText, isRTL ? { textAlign: 'left' } : undefined]}>{isRTL ? sub.name_ar :sub.name_en}</Text>
                  </Pressable>
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
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
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categoryRowActive: { backgroundColor: '#F8FAFC' },
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
    backgroundColor: "#F8F9FB",
    marginTop: 5,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  subcategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
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
