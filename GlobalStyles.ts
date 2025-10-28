// src/constants/GlobalStyles.ts
import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  // Spacing
  m4: { margin: 4 },
  m8: { margin: 8 },
  m16: { margin: 16 },
  m20: { margin: 20 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  ml4: { marginLeft: 4 },
  ml8: { marginLeft: 8 },
  ml16: { marginLeft: 16 },
  mr4: { marginRight: 4 },
  mr8: { marginRight: 8 },
  mr16: { marginRight: 16 },
  p4: { padding: 4 },
  p8: { padding: 8 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  pt4: { paddingTop: 4 },
  pt8: { paddingTop: 8 },
  pt16: { paddingTop: 16 },
  pb4: { paddingBottom: 4 },
  pb8: { paddingBottom: 8 },
  pb16: { paddingBottom: 16 },
  pl4: { paddingLeft: 4 },
  pl8: { paddingLeft: 8 },
  pl16: { paddingLeft: 16 },
  pr4: { paddingRight: 4 },
  pr8: { paddingRight: 8 },
  pr16: { paddingRight: 16 },
  // Text
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  textBold: { fontWeight: 'bold' },
  textMedium: { fontWeight: '500' },
  textLight: { fontWeight: '300' },
  // Flex
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flexGrow1: { flexGrow: 1 },
  flexShrink1: { flexShrink: 1 },
  // Border radius
  roundedSm: { borderRadius: 4 },
  rounded: { borderRadius: 8 },
  roundedLg: { borderRadius: 12 },
  roundedXl: { borderRadius: 16 },
  roundedFull: { borderRadius: 9999 },
});

// Динамические стили с учетом темы
export const createDynamicStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    input: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    text: {
      color: colors.text,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    border: {
      borderColor: colors.border,
    },
  });
};

// Хук для использования динамических стилей
export const useDynamicStyles = (colors: any) => {
  return createDynamicStyles(colors);
};