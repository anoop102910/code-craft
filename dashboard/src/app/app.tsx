import { Refine, Authenticated, useLogout } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { Button, ConfigProvider } from "antd";
import { authProvider } from "./providers/auth-provider";
import Login from "./auth/login";
import Register from "./auth/register";
import { ThemedLayoutV2, useNotificationProvider, RefineThemes } from "@refinedev/antd";
import { dataProvider } from "./providers/data-provider";


export default function App() {
  const notificationProvider = useNotificationProvider();
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Green}>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          notificationProvider={notificationProvider}
          resources={[]}
        >
          <Routes>
            <Route
              element={
                <Authenticated key="authenticated-routes" redirectOnFail="/login">
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route index element={<Home />} />
            </Route>

            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  <Navigate to="/" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const Home = () => {
  const { mutate: logout } = useLogout();
  return (
    <div>
      <h1>Welcome Home, Anoop Singh!</h1>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
