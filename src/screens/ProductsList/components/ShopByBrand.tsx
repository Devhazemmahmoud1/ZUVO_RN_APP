import { View, Image, StyleSheet, Dimensions, Text, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { getCairoFont } from '../../../ultis/getFont';

const { width } = Dimensions.get('window');
const itemsPerView = 5;
const horizontalPadding = 16;
const brandItemWidth = (width - horizontalPadding * 2) / itemsPerView;

const brands = [
    { id: 2, name: 'BMW', logo: require('../../../assets/BMW.png') },
    { id: 6, name: 'Mercedes', logo: require('../../../assets/mercedes.png') },
    { id: 4, name: 'Audi', logo: require('../../../assets/Audi.png') },
    { id: 3, name: 'Honda', logo: require('../../../assets/Honda.png') },
    { id: 5, name: 'Ford', logo: require('../../../assets/ford.png') },
    { id: 7, name: 'Nissan', logo: require('../../../assets/nisssan.png') },
    { id: 8, name: 'Kia', logo: require('../../../assets/kia.png') },
    { id: 9, name: 'Hyundai', logo: require('../../../assets/hyundai.png') },
    { id: 10, name: 'Chevrolet', logo: require('../../../assets/chevrolet.png') },
    { id: 11, name: 'Volkswagen', logo: require('../../../assets/volks.png') },
    { id: 12, name: 'Lexus', logo: require('../../../assets/lexus.png') },
    { id: 13, name: 'Mazda', logo: require('../../../assets/mazda.png') },
    { id: 14, name: 'Subaru', logo: require('../../../assets/subaru.png') },
    { id: 15, name: 'Jaguar', logo: require('../../../assets/jaguar.png') },
    { id: 16, name: 'Porsche', logo: require('../../../assets/porsche.png') },
    { id: 17, name: 'Tesla', logo: require('../../../assets/tesla.png') },
    { id: 18, name: 'Volvo', logo: require('../../../assets/volvo.png') },
    { id: 19, name: 'Mitsubishi', logo: require('../../../assets/mitsubishi.png') },
    { id: 20, name: 'Land Rover', logo: require('../../../assets/landrover.png') },
    { id: 1, name: 'Toyota', logo: require('../../../assets/toyota.png') },
];

const ShopByBrand = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= brands.length) nextIndex = 0;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * brandItemWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / brandItemWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.brandSection}>
      <Text style={styles.sectionTitle}>Shop by Brand</Text>

      <FlatList
        ref={flatListRef}
        data={brands}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        renderItem={({ item }) => (
          <View style={styles.brandItem}>
            <View style={styles.brandLogoContainer}>
              <Image source={ item.logo } style={styles.brandLogo} resizeMode="contain" />
            </View>
            <Text style={[styles.brandName, getCairoFont('600')]}>{item.name}</Text>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled={false}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {brands.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  brandSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  brandItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: brandItemWidth,
  },
  brandLogoContainer: {
    backgroundColor: '#f5f5f5',
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandLogo: {
    width: 50,
    height: 70,
  },
  brandName: {
    fontSize: 12,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default ShopByBrand;
