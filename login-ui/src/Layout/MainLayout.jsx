import ProLayout from "@ant-design/pro-layout";
import gbhlIcon from "../public/GIL_LOGO.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiBriefcase, FiLogOut, FiUsers } from "react-icons/fi";
import React, { useEffect } from "react";
import axios from "../helpers/axios";



export default function MainLayout() {


    //const [user_id, setUser_id] = React.useState(null);

    // const getUser = () => {
    //    const request =  axios.get("/user/current");
    //     request.then((response) => {
    //         setUser_id(response.data.user_.blk_unittracker_users_status);
    //         //console.log("User", response);
    //         return response;
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    
    // }
    // useEffect(() => {
    //     getUser();
    // }, []);

    

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);




    return (
    <ProLayout
            logo={gbhlIcon}
            title="Barrier App"
            layout="top"         
            menuDataRender={() => [
                {
                    path: "/",
                    name: "",
                    icon: <FiBriefcase />,
                },
                {
                    path: "/login",
                    name: "Logout",
                    icon: <FiLogOut />
    

                }
        
                // Sample Role based views
                // user_id && user_id === 1 &&  {
                //     path: "/Units",
                //     name: "Container Units",
                //     icon: <FiUsers />,
                // },
                // user_id && user_id === 1 && {
                //     path: "/Stations",
                //     name: "Station Management",
                //     icon: <FiUsers />,
                // },
        
            ]}
            menuItemRender={(item, dom) => <Link to={item.path} onClick={()=>{
                navigate(item.path);
              }}>{dom}</Link>}
            >
            <Outlet />

        </ProLayout>

    )
}
