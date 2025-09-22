// inside your component (top of file imports are unchanged)
import { t } from 'i18next';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';
import { useLanguage } from '../../../LanguageProvider';

// put near the top of your file
const ICON_LEFT = 12; // searchBox paddingHorizontal
const ICON_SIZE = 18; // Ionicons search size
const ICON_GAP = 8; // marginRight on the icon
const OVERLAY_LEFT = ICON_LEFT + ICON_SIZE + ICON_GAP; // 12 + 18 + 8 = 38
const LINE_H = 18; // matches your input font size nicely

export default function CyclingPlaceholder({
  visible,
  left = OVERLAY_LEFT,
}: {
  visible: boolean;
  left?: number;
}) {

  const { isRTL } = useLanguage()

  const KEYWORDS = !isRTL ? [
    t('ec'),
    t('gbc'),
    t('brake'),
    t('tires'),
    t('wiper'),
    t('steering'),
    t('cooling'),
  ] : ['ما الذي تبحث عنه؟'];
  const [idx, setIdx] = useState(0);
  const next = (idx + 1) % KEYWORDS.length;

  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return; // pause when user types/focuses
    let mounted = true;

    const run = () => {
      // slide current -> up, next -> in
      Animated.timing(y, {
        toValue: -LINE_H,
        duration: 280,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!mounted) return;
        if (finished) {
          y.setValue(0);
          setIdx(prev => (prev + 1) % KEYWORDS.length);
        }
        // hold before next cycle
        if (mounted) setTimeout(run, 1400);
      });
    };

    const t = setTimeout(run, 800); // initial delay
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [visible, y, KEYWORDS.length]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        right: 12, // same as searchBox horizontal padding on the right
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#8A94A6', fontSize: 15 /* same as input */ }}>
        {isRTL ? undefined : t('search')}
      </Text>
      <View style={{ height: LINE_H, overflow: 'hidden' }}>
        <Animated.View style={{ transform: [{ translateY: y }] }}>
          <Text style={{ color: '#8A94A6', fontSize: 15, lineHeight: LINE_H }}>
            {KEYWORDS[idx]}
          </Text>
          <Text style={{ color: '#8A94A6', fontSize: 15, lineHeight: LINE_H }}>
            {KEYWORDS[next]}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
