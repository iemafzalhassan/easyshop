'use client';

import { Provider } from "react-redux";
import { initializeStore } from "@/lib/store";
import { ThemeProvider } from "next-themes";
import MainLayout from "@/components/layouts/MainLayout";

// Create a new store instance for each request
export function Providers({ children }: { children: React.ReactNode }) {
  const store = initializeStore();

  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MainLayout>{children}</MainLayout>
      </ThemeProvider>
    </Provider>
  );
}
