import { Platform, TextStyle } from 'react-native';

type W = '100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|'normal'|'bold';

export const getCairoFont = (weight: W = '400'): TextStyle => {
  const norm = (w: W): '100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900' =>
    w === 'normal' ? '400' : w === 'bold' ? '700' : w;

  const w = norm(weight);

  // iOS typically uses dashed names (Cairo-Bold, …)
  const iosMap: Record<string, string> = {
    '100': 'Cairo-Thin',
    '200': 'Cairo-ExtraLight',
    '300': 'Cairo-Light',
    '400': 'Cairo-Regular',
    '500': 'Cairo-Medium',
    '600': 'Cairo-SemiBold',
    '700': 'Cairo-Bold',
    '800': 'Cairo-ExtraBold',
    '900': 'Cairo-Black',
  };

  // ANDROID: filenames without dashes (CairoBold.ttf → "CairoBold")
  const androidMap: Record<string, string> = {
    '100': 'CairoThin',
    '200': 'CairoExtraLight',
    '300': 'CairoLight',
    '400': 'CairoRegular',
    '500': 'CairoMedium',
    '600': 'CairoSemiBold',
    '700': 'CairoBold',
    '800': 'CairoExtraBold',
    '900': 'CairoBlack',
  };

  const fontFamily =
    Platform.OS === 'ios' ? iosMap[w] : androidMap[w];

  // Fallback: if a face is missing, return base family + weight so it still renders
  if (!fontFamily) {
    return Platform.select<TextStyle>({
      ios: { fontFamily: 'Cairo', fontWeight: w as TextStyle['fontWeight'] },
      android: { fontFamily: 'CairoRegular' },
    })!;
  }

  return { fontFamily };
};
