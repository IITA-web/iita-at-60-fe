import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "IITA @60 | Six Decades of Impact",
  description:
    "Celebrate IITA's 60th anniversary. Share your message and memories with the IITA community.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            classNames: {
              toast: "iita-toast",
              title: "iita-toast-title",
              description: "iita-toast-description",
            },
          }}
        />
      </body>
    </html>
  );
}
