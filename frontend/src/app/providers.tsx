'use client';

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { ThemeProvider } from "next-themes";
import MainLayout from "@/components/layouts/MainLayout";

// Create a new store instance for each request
const store = makeStore();

export function Providers({ children }: { children: React.ReactNode }) {
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
