import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2890BD',
    },
    secondary: {
      main: '#D1F3FF',
    },
    background: {
      default: '#F8F9FA',
    },
    text: {
      primary: '#1A1A1A',
    }
  },
  typography: {
    fontFamily: 'Raleway, sans-serif',
    h1: { fontFamily: 'Lato, sans-serif' },
    h2: { fontFamily: 'Lato, sans-serif' },
    h3: { fontFamily: 'Lato, sans-serif' },
    h4: { fontFamily: 'Lato, sans-serif' },
    h5: { fontFamily: 'Lato, sans-serif' },
    h6: { fontFamily: 'Lato, sans-serif' },
  }
})

export default theme