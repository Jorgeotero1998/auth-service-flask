import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./ui/AppShell";
import { DashboardPage } from "./views/DashboardPage";
import { LoginPage } from "./views/LoginPage";
import { DemoPage } from "./views/DemoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "demo", element: <DemoPage /> }
    ]
  }
]);

