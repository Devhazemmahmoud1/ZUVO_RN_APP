// screens/ProductReviewWithItemScreen.tsx
import React, {useMemo, useState} from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable,
  TextInput, Image, ScrollView, StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RatingStars from './RatingStars';
import Uploader from './Uploader';
import type {Asset} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function ProductReviewWithItemScreen() {
  const nav = useNavigation<any>();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);

  const canSubmit = useMemo(
    () => rating > 0 && title.trim().length >= 3 && body.trim().length >= 10,
    [rating, title, body],
  );

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Product review</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 110}}>

        {/* Product mini card */}
        <View style={S.productRow}>
          <View style={S.pThumbBox}>
            <Image
              source={{uri: 'https://images.ugreen.com/upload/product/10990/en/fea.png'}}
              style={S.pThumb}
              resizeMode="contain"
            />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={S.brand}>Ugreen</Text>
            <Text numberOfLines={2} style={S.title}>
              iPhone 15 Magsafe Case Clear 【N52 Stronger Magnets】【Shockproof Military-…
            </Text>
            <Text style={S.delivered}>Delivered on Thu, Nov 16</Text>
          </View>
        </View>
        <View style={S.sep} />

        {/* Rating (title then stars on next line) */}
        <View style={S.ratingBlock}>
          <Text style={S.h2}>How do you rate this product?</Text>
          <View style={S.starsRow}>
            <RatingStars value={rating} onChange={setRating} size={26} />
          </View>
        </View>

        {/* Review form */}
        <Text style={[S.h2, {marginTop: 18}]}>Write a product review</Text>

        <Text style={S.label}>Review title</Text>
        <TextInput
          placeholder="What would you like to highlight?"
          placeholderTextColor="#B7BFCC"
          value={title}
          onChangeText={setTitle}
          style={S.input}
        />

        <Text style={[S.label, {marginTop: 12}]}>Your review</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder=""
          placeholderTextColor="#B7BFCC"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={[S.input, {height: 140}]}
        />

        {/* Upload */}
        <View style={S.uploadBox}>
          <Text style={S.uploadTitle}>Upload images <Text style={{color: '#7B8294'}}>(Optional)</Text></Text>
          <Uploader assets={assets} setAssets={setAssets} />
        </View>
      </ScrollView>

      {/* Submit */}
      <Pressable
        disabled={!canSubmit}
        onPress={() => {}}
        style={[S.submit, !canSubmit ? S.submitDisabled : S.submitEnabled]}
      >
        <Text style={[S.submitText, !canSubmit && {color: '#A9B0BF'}]}>
          SUBMIT REVIEW
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#E8ECF3',
    backgroundColor: '#FFF',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},

  productRow: {flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center'},
  pThumbBox: {width: 72, height: 72, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'},
  pThumb: {width: '100%', height: '100%'},
  brand: {color: '#6D7690', fontWeight: '800', fontSize: 12},
  title: {color: '#2F3440', fontSize: 14},
  delivered: {color: '#9AA1AE', marginTop: 6, fontSize: 12},
  sep: {height: 1, backgroundColor: '#EDEFF3'},

  ratingBlock: { marginTop: 12 },
  starsRow: { marginHorizontal: 16 },
  h2: {fontSize: 16, fontWeight: '800', color: '#2F3440', marginHorizontal: 16},
  label: {marginTop: 12, color: '#384152', marginHorizontal: 16, fontWeight: '700', fontSize: 13},
  input: {
    marginTop: 8, marginHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF', color: '#2F3440',
  },

  uploadBox: {marginTop: 16, backgroundColor: '#F7F8FB', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB'},
  uploadTitle: {fontSize: 16, fontWeight: '800', color: '#2F3440', marginBottom: 10},
  submit: {position: 'absolute', left: 16, right: 16, bottom: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  submitEnabled: {backgroundColor: '#2563EB'},
  submitDisabled: {backgroundColor: '#E6E9F0'},
  submitText: {fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.6},
});
