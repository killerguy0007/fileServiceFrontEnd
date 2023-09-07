import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'
import App from './App'


const theme = createTheme({

})

const ThemedApp = () => {
  return (
    <ThemeProvider theme={theme} >
        <App />
    </ThemeProvider >
    
  )
}

export default ThemedApp