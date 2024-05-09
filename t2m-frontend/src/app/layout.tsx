import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css'
import ReduxProvider from '@/redux/provider';

export const metadata: Metadata = {
  openGraph: {
    title: 'T2M Invest',
    description: 'Định vị dòng tiền chứng khoán',
    type: 'website',
    images: [`https://i.imgur.com/9lRPcqt.png`],
  }
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ReduxProvider>
            <div>
              {children}
            </div>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
