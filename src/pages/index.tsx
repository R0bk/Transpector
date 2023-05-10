// import Image from 'next/image'
// import { Inter } from 'next/font/google'
import { Layout } from '../app/Layout'
import "allotment/dist/style.css";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`bg-gray-950 flex min-h-screen flex-col items-center justify-between `}
    >
      <Layout />
      
    </main>
  )
}
