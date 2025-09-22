export const getCairoFont = (weight: string) => {
    const fontMap: Record<string, string> = {
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
  
    return { fontFamily: fontMap[weight] || 'Cairo-Regular' };
  };