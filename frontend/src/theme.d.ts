import { PaletteColor, PaletteColorOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {

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
        onBackround?: string;
      };
    }
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
    }
  }

  interface ThemeOptions {
    custom?: {
      surface: {
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
        main?: string;
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
        onBackround?: string;
      };
    }
    status: {
      success: {
        main?: string;
        dark?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      },
      error: {
        main?: string;
        onColor?: string;
        container?: string;
        onContainer?: string;
      },
      warning: {
        main?: string;
        container?: string;
        onContainer?: string;
      }
    }
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
}