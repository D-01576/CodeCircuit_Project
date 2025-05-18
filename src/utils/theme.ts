import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    success: {
      50: '#E3F9E5',
      100: '#C1F2C7',
      200: '#91E697',
      300: '#51CA58',
      400: '#31B237',
      500: '#18981D',
      600: '#0F8613',
      700: '#0E7817',
      800: '#07600E',
      900: '#014807',
    },
    error: {
      50: '#FFE3E3',
      100: '#FFBDBD',
      200: '#FF9B9B',
      300: '#F86A6A',
      400: '#EF4E4E',
      500: '#E12D39',
      600: '#CF1124',
      700: '#AB091E',
      800: '#8A041A',
      900: '#610316',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'lg',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export const cardStyles = {
  container: {
    position: 'relative',
    perspective: '1000px',
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 'lg',
    padding: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bg: 'white',
    boxShadow: 'lg',
  },
  back: {
    transform: 'rotateY(180deg)',
  },
};

export const buttonStyles = {
  primary: {
    bg: 'brand.500',
    color: 'white',
    _hover: {
      bg: 'brand.600',
    },
  },
  secondary: {
    bg: 'gray.100',
    color: 'gray.800',
    _hover: {
      bg: 'gray.200',
    },
  },
  success: {
    bg: 'success.500',
    color: 'white',
    _hover: {
      bg: 'success.600',
    },
  },
  error: {
    bg: 'error.500',
    color: 'white',
    _hover: {
      bg: 'error.600',
    },
  },
}; 