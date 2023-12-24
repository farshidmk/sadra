import React from "react";
import { createTheme } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import AuthProvider from "./context/AuthProvider";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "context/SnackbarContext";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {}, mode: "light" });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">(
    useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light"
  );

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        direction: "rtl",
        typography: {
          fontFamily: `Vazirmatn`,
        },
        palette: {
          mode,
          primary: {
            // main: "#cddc39",
            main: "#023e8a",
            // dark: "#006368",
            // light: "#00bdc7",
          },
          secondary: {
            main: "#ffbe0b",
            // light: "#e7cb8c",
            // dark: "#e7cb8c",
          },
          // primary: {
          //   main: "#009199",
          //   dark: "#006368",
          //   light: "#00bdc7",
          // },
          // secondary: {
          //   main: "#e7cb8c",
          //   light: "#e7cb8c",
          //   dark: "#e7cb8c",
          // },
        },
      }),
    [mode]
  );
  // const theme = createTheme({
  //   direction: "rtl",
  //   typography: {
  //     fontFamily: `Vazirmatn`,
  //   },
  //   palette: {
  //     primary: {
  //       main: "#009199",
  //       dark: "#006368",
  //       light: "#00bdc7",
  //     },
  //     secondary: {
  //       main: "#e7cb8c",
  //       light: "#e7cb8c",
  //       dark: "#e7cb8c",
  //     },
  //   },
  // });

  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <SnackbarProvider>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <ColorModeContext.Provider value={{ ...colorMode, mode }}>
                  <AppRoutes />
                </ColorModeContext.Provider>
              </QueryClientProvider>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;
