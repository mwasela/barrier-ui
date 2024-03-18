import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Login from "./pages/auth/Login";
import { Layout } from "antd";
import Home from "./pages/Home";



const router = createBrowserRouter([


    {
      path: "/",
    //loader: () => import("./Layout/MainLayout"),
      element: <MainLayout />,
      children: [
        
        { path: "/", element: <Home /> },
   
      ],
    },

    {path: "/Login", element: <Layout><Login /></Layout>},

  ]);
  

  export default router;