"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { ThemeProvider } from "next-themes";

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
        {children}
      </ThemeProvider>
    </Provider>
  );
}
