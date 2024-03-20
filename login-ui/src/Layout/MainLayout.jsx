import ProLayout from "@ant-design/pro-layout";
import gbhlIcon from "../public/GIL_LOGO.png";
import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { FiBriefcase, FiLogOut, FiUsers } from "react-icons/fi";
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import axios from "../helpers/axios";
import { Dropdown } from "antd"



export default function MainLayout() {

    const [user, setUser] = useState(null);
    
    //dfd
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);


    const getUser = () => {
        const request =  axios.get("/user/current");
         request.then((response) => {
             setUser(response.data);
             console.log("User", response);
             return response;
         }).catch((error) => {
             console.log(error);
         });
     
     }

     useEffect(()=>{
        if(user) return 
        getUser()
     }, [user])

    


    return (
    <ProLayout
            logo={gbhlIcon}
            title="Barrier App"
            layout="top"   
            avatarProps={{
                src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
                size: "small",
                title: user?.user_?.blk_users_fname + " " + user?.user_?.blk_users_surname,
                render: (props, dom) => {
                    return (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: "logout",
                                        icon: <LogoutOutlined />,
                                        label: "Log Out",
                                        onClick: () => {
                                            navigate("/login")
                                        },
                                    },
                                ],
                            }}
                        >
                            {dom}
                        </Dropdown>
                    );
                },
            }}      
            menuDataRender={() => [
                {
                    path: "/",
                    name: "",
                    icon: <FiBriefcase />,
                },
                // {
                //     path: "/login",
                //     name: "Logout",
                //     icon: <FiLogOut />
    

                // }
        
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
