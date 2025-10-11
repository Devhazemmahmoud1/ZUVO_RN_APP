import React from 'react';
import {View, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RatingStars({
  value, onChange, size = 28, disabled = false,
}: { value: number; onChange: (v: number) => void; size?: number; disabled?: boolean }) {
  return (
    <View style={{flexDirection: 'row', gap: 12}}>
      {[1,2,3,4,5].map(i => (
        <Pressable key={i} onPress={() => !disabled && onChange(i)} hitSlop={6}>
          <Ionicons
            name={i <= value ? 'star' : 'star-outline'}
            size={size}
            color={i <= value ? '#FFB800' : '#B8BFCC'}
          />
        </Pressable>
      ))}
    </View>
  );
}