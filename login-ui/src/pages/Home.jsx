import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import ProTable from "@ant-design/pro-table";
//config provider
import { Space, notification } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProFormSelect,
    ProFormText,

    ProFormDateTimePicker,
    PageContainer,

} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { Checkbox } from 'antd';
//import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function App() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect (() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);



    return (


        <PageContainer>
            <div>Hello</div>

        </PageContainer>

    );
}
