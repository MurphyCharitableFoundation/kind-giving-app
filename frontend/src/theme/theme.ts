import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#034792",
      onColor: "#FFFFFF",
      onColorVariant: "#284777",
      fixedDim: "#AAC7FF",
      container: "#D7E3FF",
      onContainer: "#001B3E",
      opacity8: "#E5EBF7",
    },
    secondary: {
      main: "#565E71",
      onColor: "#FFFFFF",
      onColorVariant: "#3E4759",
      fixedDim: "#BEC6DC",
      container: "#DAE2F9",
      onContainer: "#131C2B",
      opacity8: "#ECECF4",
    },
    tertiary: {
      main: "#4C8422",
      onColor: "#FFFFFF",
      onColorVariant: "#2A4F1F",
      fixedDim: "#A7D394",
      container: "#C2EFAE",
      onContainer: "#032100",
      opacity8: "#EBF0EE",
    },
  },
  custom: {
    surface: {
      main: "#F9F9FF",
      dim: "#D9D9E0",
      onColor: "#191C20",
      variant: "#E0E2EC",
      onColorVariant: "#44474E",
      tint: "#415F91",
    },
    surfaceContainer: {
      highest: "#E2E2E9",
      high: "#E7E8EE",
      default: "#EDEDF4",
      low: "#F3F3FA",
      lowest: "#FFFFFF",
    },
    inverseSurface: {
      main: "#2E3036",
      primary: "#F0F0F7",
      onSurface: "#AAC7FF",
    },
    misc: {
      outline: "#74777F",
      outlineVariant: "#C4C6D0",
      shadow: "#000000",
      background: "#F9F9FF",
      onBackground: "#191C20",
    },
  },
  status: {
    success: {
      main: "#34821B",
      dark: "#426834",
      onColor: "#FFFFFF",
      container: "#C3EFAD",
      onContainer: "#042100",
    },
    error: {
      main: "#BA1A1A",
      onColor: "#FFFFFF",
      container: "#FFDAD6",
      onContainer: "#410002",
    },
    warning: {
      main: "#E5A721",
      container: "#FFEDBB",
      onContainer: "#A86200",
    },
  },

  typography: {
    // fontFamily: "'Inter', sans-serif",
    displayLarge: {
      fontSize: "57px",
      lineHeight: "64px",
      letterSpacing: "-0.25%",
    },
    displayMedium: {
      fontSize: "45px",
      lineHeight: "52px",
      letterSpacing: "0",
    },
    displaySmall: {
      fontSize: "36px",
      lineHeight: "44px",
      letterSpacing: "0",
    },
    headlineXlargeTextMedium: {
      fontSize: "32px",
      lineHeight: "32px",
      letterSpacing: "-6.3%",
    },
    headlineXlargeTextRegular: {
      fontSize: "32px",
      lineHeight: "40px",
      letterSpacing: "0",
    },
    headlineLargeTextMedium: {
      fontSize: "30px",
      lineHeight: "30px",
      letterSpacing: "-6.6%",
    },
    headlineLargeTextRegular: {
      fontSize: "30px",
      lineHeight: "38px",
      letterSpacing: "0",
    },
    headlineMediumTextMedium: {
      fontSize: "28px",
      lineHeight: "28px",
      letterSpacing: "-7%",
    },
    headlineMediumTextRegular: {
      fontSize: "28px",
      lineHeight: "36px",
      letterSpacing: "0",
    },
    headlineSmallTextMedium: {
      fontSize: "26px",
      lineHeight: "26px",
      letterSpacing: "-7.4%",
    },
    headlineSmallTextRegular: {
      fontSize: "26px",
      lineHeight: "34px",
      letterSpacing: "0",
    },
    headlineXsmallTextMedium: {
      fontSize: "24px",
      lineHeight: "24px",
      letterSpacing: "-7.8%",
    },
    headlineXsmallTextRegular: {
      fontSize: "24px",
      lineHeight: "32px",
      letterSpacing: "0",
    },
    bodyXLarge: {
      fontSize: "20px",
      lineHeight: "30px",
      letterSpacing: "0",
    },
    bodyLarge: {
      fontSize: "18px",
      lineHeight: "27px",
      letterSpacing: "0.4%",
    },
    bodyMedium: {
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0",
    },
    bodySmall: {
      fontSize: "14px",
      lineHeight: "21px",
      letterSpacing: "1.7%",
    },
    bodyXSmall: {
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "3.5%",
    },
    labelLarge: {
      fontSize: "14px",
      lineHeight: "20px",
      letterSpacing: "0.1",
    },
    labelMedium: {
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "3%",
    },
    labelSmall: {
      fontSize: "11px",
      lineHeight: "16px",
      letterSpacing: "3%",
    },
    titleXLargetextSemibold: {
      fontSize: "22px",
      lineHeight: "28px",
      letterSpacing: "0",
    },
    titleXLargetextMedium: {
      fontSize: "22px",
      lineHeight: "28px",
      letterSpacing: "0",
    },
    titleLargetextSemiBold: {
      fontSize: "20px",
      lineHeight: "24px",
      letterSpacing: "0.15%",
    },
    titleLargetextMedium: {
      fontSize: "20px",
      lineHeight: "24px",
      letterSpacing: "0.15%",
    },
    titleMediumtextSemiBold: {
      fontSize: "18px",
      lineHeight: "24px",
      letterSpacing: "0.15%",
    },
    titleMediumtextMedium: {
      fontSize: "18px",
      lineHeight: "21px",
      letterSpacing: ".2%",
    },
    titleSmalltextSemiBold: {
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0.75%",
    },
    titleSmalltextMedium: {
      fontSize: "16px",
      lineHeight: "18px",
      letterSpacing: "3%",
    },
    titleXSmalltextSemiBold: {
      fontSize: "14px",
      lineHeight: "21px",
      letterSpacing: "1%",
    },
    titleXSmalltextMedium: {
      fontSize: "14px",
      lineHeight: "16px",
      letterSpacing: "5%",
    },
  },
});

export default theme;
