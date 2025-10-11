import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { getCairoFont } from '../../../ultis/getFont';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLS = 4;
const ROWS = 2;
const PER_PAGE = COLS * ROWS;

type Category = {
  id: string;
  label: string;
  img?: ImageSourcePropType | string;
  bg?: string;
};

type Props = {
  items: Category[];
  onPressItem?: (c: Category) => void;
  style?: ViewStyle;
};

export default function CategoriesPager({ items, onPressItem, style }: Props) {
  const [page, setPage] = useState(0);
  const pages = useMemo(
    () => Array.from({ length: Math.ceil(items.length / PER_PAGE) }, (_, i) => items.slice(i * PER_PAGE, i * PER_PAGE + PER_PAGE)),
    [items]
  );
  const listRef = useRef<FlatList>(null);

  const renderPage = ({ item: pageItems }: { item: Category[] }) => {
    const row1 = pageItems.slice(0, COLS);
    const row2 = pageItems.slice(COLS, PER_PAGE);
    return (
      <View style={{ width: SCREEN_WIDTH }}>
        <View style={styles.row}>{row1.map(renderTile)}</View>
        <View style={{ height: 15 }} />
        <View style={styles.row}>{row2.map(renderTile)}</View>
      </View>
    );
  };

  const renderTile = (c: Category) => {
    const source: ImageSourcePropType =
      typeof c.img === 'string'
        ? { uri: c.img }
        : c.img ?? require('../../../assets/main_logo.png');

    return (
      <TouchableOpacity
        key={c.id}
        style={styles.tile}
        onPress={() => onPressItem?.(c)}
        activeOpacity={0.8}
      >
        <View style={[styles.circle, { backgroundColor: c.bg ?? '#EFE7FF' }]}>
          <Image source={source} style={styles.tileImage} resizeMode="contain" />
        </View>
        <Text style={[styles.tileLabel, getCairoFont('700')]} numberOfLines={1}>
          {c.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={style}>
      <FlatList
        ref={listRef}
        data={pages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const p = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setPage(p);
        }}
      />
      <View style={styles.dotsRow}>
        {pages.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const TILE_W = SCREEN_WIDTH / COLS;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tile: {
    width: TILE_W,
    alignItems: 'center',
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileImage: {
    width: 40,
    height: 40,
  },
  tileLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#2F3B4A',
    lineHeight: 18
  },
  dotsRow: {
    marginTop: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 16,
    borderRadius: 8,
    backgroundColor: 'tomato',
  },
});
