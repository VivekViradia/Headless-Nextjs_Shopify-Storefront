
import './globals.css'
import { AppProvider } from '@/lib/AppContext'

export const metadata = {
  title: 'Custom-StoreFront',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='relative'>

        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
