import { I18nManager } from 'react-native';

export const dir = {
  start: I18nManager.isRTL ? 'right' : 'left',
  end: I18nManager.isRTL ? 'left' : 'right',
};

export const dirStyle = (startProp: string, endProp: string, startVal: any, endVal: any) => {
  // e.g. dirStyle('paddingLeft','paddingRight', 16, 8)
  const s = I18nManager.isRTL ? endProp : startProp;
  const e = I18nManager.isRTL ? startProp : endProp;
  return { [s]: startVal, [e]: endVal } as any;
};