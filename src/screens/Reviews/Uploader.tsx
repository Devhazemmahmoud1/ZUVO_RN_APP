// components/Uploader.tsx
import React from 'react';
import {View, Text, Pressable, Image, StyleSheet, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, Asset} from 'react-native-image-picker';

export default function Uploader({
  assets, setAssets, max = 5, label = 'Upload',
}: { assets: Asset[]; setAssets: (a: Asset[]) => void; max?: number; label?: string }) {
  const pick = async () => {
    const res = await launchImageLibrary({
      selectionLimit: max - assets.length,
      mediaType: 'photo',
      includeBase64: false,
    });
    if (res.assets?.length) setAssets([...assets, ...res.assets].slice(0, max));
  };

  return (
    <View>
      <Pressable style={U.box} onPress={pick}>
        <Ionicons name="camera-outline" size={22} color="#5C6476" />
        <Text style={U.boxText}>{label}</Text>
      </Pressable>

      {assets.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
          {assets.map(a => (
            <Image key={a.uri} source={{uri: a.uri}} style={U.thumb} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const U = StyleSheet.create({
  box: {
    height: 96, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed',
    borderColor: '#C9CFDA', backgroundColor: '#F7F9FC',
    alignItems: 'center', justifyContent: 'center', gap: 8, flexDirection: 'row',
  },
  boxText: {color: '#5C6476', fontWeight: '700'},
  thumb: {width: 72, height: 72, borderRadius: 10, marginRight: 10, backgroundColor: '#EDEFF3'},
});
