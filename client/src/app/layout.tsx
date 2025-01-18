import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import { FacebookPixel, MixpanelTracking } from "@/components/integrations";
import Script from "next/script";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const switzer = localFont({
    src: "./Switzer-Variable.ttf",
    display: "swap",
    variable: "--font-switzer",
});
const popppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://turtlex.in"),
    title: "Turtle: Land your dream job with 1:1 mentorship",
    description:
        "Turtle is a results-focused platform where techies can upskill and grow with guidance from experienced mentors",
    openGraph: {
        title: "Turtle: Land your dream job with 1:1 mentorship",
        description:
            "Turtle is a results-focused platform where techies can upskill and grow with guidance from experienced mentors",
        images: "https://www.turtlex.in/turtle/og_image.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${popppins.className}`}>
                <AuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="light">
                        {children}
                    </ThemeProvider>
                    <ToastContainer />
                </AuthProvider>
            </body>
            <FacebookPixel />
            {process.env.NEXT_PUBLIC_NODE_ENV !== "dev" ? (
                <MixpanelTracking />
            ) : null}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
                `}
            </Script>
            <Script id="clarity-script" strategy="afterInteractive">
                {`
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
                `}
            </Script>
            <Script>
                {`
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
            </Script>
        </html>
    );
}
