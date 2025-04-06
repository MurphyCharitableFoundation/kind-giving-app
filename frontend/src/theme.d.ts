import { PaletteColor, PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      surface: {
        main?: string;
        dim?: string;
        onColor?: string;
        variant?: string;
        onColorVariant?: string;
        tint?: string;
      };
      surfaceContainer: {
        highest?: string;
        high?: string;
        default?: string;
        low?: string;
        lowest?: string;
      };
      inverseSurface: {
        main?: string;
        primary?: string;
        onSurface?: string;
      };
      misc: {
        outline?: string;
        outlineVariant?: string;
        shadow?: string;
        background?: string;
        onBackground?: string;
      };
    };
    status: {
      success: {
        main?: string;
        dark?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      };
      error: {
        main?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      };
      warning: {
        main?: string;
        container?: string;
        onContainer?: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      surface?: {
        main?: string;
        dim?: string;
        onColor?: string;
        variant?: string;
        onColorVariant?: string;
        tint?: string;
      };
      surfaceContainer?: {
        highest?: string;
        high?: string;
        default?: string;
        low?: string;
        lowest?: string;
      };
      inverseSurface?: {
        main?: string;
        primary?: string;
        onSurface?: string;
      };
      misc?: {
        outline?: string;
        outlineVariant?: string;
        shadow?: string;
        background?: string;
        onBackground?: string;
      };
    };
    status?: {
      success?: {
        main?: string;
        dark?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      };
      error?: {
        main?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      };
      warning?: {
        main?: string;
        container?: string;
        onContainer?: string;
      };
    };
  }
  interface PaletteColor {
    onColor?: string;
    onColorVariant?: string;
    fixedDim?: string;
    container?: string;
    onContainer?: string;
    opacity8?: string;
  }
  interface SimplePaletteColorOptions {
    onColor?: string;
    onColorVariant?: string;
    fixedDim?: string;
    container?: string;
    onContainer?: string;
    opacity8?: string;
  }
  interface Palette {
    tertiary?: PaletteColor;
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
  }
  interface TypographyVariants {
    displayLarge?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    displayMedium?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    displaySmall?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXlargeTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXlargeTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineLargeTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineLargeTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineMediumTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineMediumTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineSmallTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineSmallTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXsmallTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXsmallTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyXLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodySmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyXSmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelSmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXLargetextSemibold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXLargetextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleLargetextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleLargetextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleMediumtextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleMediumtextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleSmalltextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleSmalltextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXSmalltextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXSmalltextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
  }

  interface TypographyVariantsOptions {
    displayLarge?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    displayMedium?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    displaySmall?: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXlargeTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXlargeTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineLargeTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineLargeTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineMediumTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineMediumTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineSmallTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineSmallTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXsmallTextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    headlineXsmallTextRegular: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyXLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodySmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    bodyXSmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelLarge: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    labelSmall: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXLargetextSemibold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXLargetextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleLargetextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleLargetextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleMediumtextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleMediumtextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleSmalltextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleSmalltextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXSmalltextSemiBold: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    titleXSmalltextMedium: {
      fontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
  }
}
