import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#034792',
            onColor: '#FFFFFF',
            onColorVariant: '#284777',
            fixedDim: '#AAC7FF',
            container: '#D7E3FF',
            onContainer: '#001B3E',
            opacity8: '#E5EBF7',
        },
        secondary: {
            main: '#565E71',
            onColor: '#FFFFFF',
            onColorVariant: '#3E4759',
            fixedDim: '#BEC6DC',
            container: '#DAE2F9',
            onContainer: '#131C2B',
            opacity8: '#ECECF4',
        },
        tertiary: {
            main: '#4C8422',
            onColor: '#FFFFFF',
            onColorVariant: '#2A4F1F',
            fixedDim: '#A7D394',
            container: '#C2EFAE',
            onContainer: '#032100',
            opacity8: '#EBF0EE',
        },
    },
    custom: {
        surface: {
            main: '#F9F9FF',
            dim: '#D9D9E0',
            onColor: '#191C20',
            variant: '#E0E2EC',
            onColorVariant: '#44474E',
            tint: '#415F91',
        },
        surfaceContainer: {
            highest: '#E2E2E9',
            high: '#E7E8EE',
            main: '#EDEDF4',
            low: '#F3F3FA',
            lowest: '#FFFFFF',
        },
        inverseSurface: {
            main: '#2E3036',
            primary: '#F0F0F7',
            onSurface: '#AAC7FF',
        },
        misc: {
            outline: '#74777F',
            outlineVariant: '#C4C6D0',
            shadow: '#000000',
            background: '#F9F9FF',
            onBackround: '#191C20'
        },
    },
    status: {
        success: {
            main: '#34821B',
            dark: '#426834',
            onColor: '#FFFFFF',
            container: '#C3EFAD',
            onContainer: '#042100',
        },
        error: {
            main: '#BA1A1A',
            onColor: '#FFFFFF',
            container: '#FFDAD6',
            onContainer: '#410002',
        },
        warning: {
            main: '#E5A721',
            container: '#FFEDBB',
            onContainer: '#A86200',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;