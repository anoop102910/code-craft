import { Refine, Authenticated, useLogout } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { Button, ConfigProvider } from "antd";
import { authProvider } from "./providers/auth-provider";
import Login from "./auth/login";
import Register from "./auth/register";
import { ThemedLayoutV2, useNotificationProvider, RefineThemes } from "@refinedev/antd";
import { dataProvider } from "./providers/data-provider";
import { ProblemList } from "./problems/list";
import { ProblemCreate } from "./problems/create";
import { ProblemEdit } from "./problems/edit";
import { ProblemShow } from "./problems/show";


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
          resources={[
            {
              name: "problems",
              list: "/problems",
              create: "/problems/create",
              edit: "/problems/edit/:id",
              show: "/problems/show/:id",
            },
          ]}
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
              <Route path="/problems">
                <Route index element={<ProblemList />} />
                <Route path="create" element={<ProblemCreate />} />
                <Route path="edit/:id" element={<ProblemEdit />} />
                <Route path="show/:id" element={<ProblemShow />} />
              </Route>
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
