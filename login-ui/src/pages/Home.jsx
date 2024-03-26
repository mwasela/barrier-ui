import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../helpers/axios";
import ProTable from "@ant-design/pro-table";
import { useNavigate } from "react-router-dom";
import {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProForm,
    ProFormDateTimePicker,
    PageContainer,
    ProCard,

} from '@ant-design/pro-components';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Tag, message, Button } from 'antd';
//import styled from 'styled-components';






export default function App() {
    const [plateid, setPlateid] = useState(null);
    const [plate, setPlate] = useState([]);
    const [direction, setDirection] = useState([]);
    const [vehicle, setVehicles] = useState([]);
    const [disabledButtons, setDisabledButtons] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const plateRef = React.createRef();
    const [platedata, setPlatedata] = useState([]);


    const handleButtonClick = (record) => {
        // Check if the button for this record is already disabled
        if (!disabledButtons.includes(record.id)) {
            // If not disabled, disable it
            setDisabledButtons([...disabledButtons, record.id]);
        }
    };


    const overidePlate = async (p_id, p_text) => {

        try{
            const request = await axios.put('/plate', {
                _plate: p_text,
                _id : p_id
            });
            //console.log("request", request);
            plateRef.current.reload();
            message.success("Number Plate Updated");
            setIsModalVisible(false);
            handleButtonClick(p_id);
            

        }catch(err){
            //message.error("Number Plate Update Failed");
            //console.log(err);
        }

    }


    const showModal = (record) => {
        setPlateid(record);
        setIsModalVisible(true);
    };




    // const gateOut = async (platetext,  dir) => {
    //     console.log("plate data", platedata);
    //     try{
    //         const request = axios.post('/barrierLogs', {
    //             params: {
    //                 plate: platetext,
    //                 direction: dir

    //             }
    //         });

    //         console.log("gateout success", request);
    //     }catch(err){
    //         console.error(err);

    //     }
    // };

    const gateOut = async (platetext, dir) => {
        //console.log("plate data", platedata);
        try {
            const request = await axios.post('/barrierLogs', {
                plateNumber: platetext,
                direction: dir
            });
    
            //console.log("gateout success", request.data);
        } catch (err) {
            //console.error(err);
        }
    };
    


    const columns_plate = [
        {
            title: 'Vehicle Plate',
            dataIndex: 'plateNumber',
            key: 'plateNumber',
            valueType: 'text',
            render: (text) => {
                return (
                    <Tag color="geekblue">{text}</Tag>
                );
            }

        },
        {
            title: 'Plate Color',
            dataIndex: 'plateColor',
            key: 'plateColor',
        },
        {
            title: 'Device ID',
            dataIndex: 'deviceID',
            key: 'deviceID',
        },
        {
            title: 'Time Gated Out',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                const formattedDate = new Date(createdAt).toLocaleString();
                return formattedDate;
            }

        },
        {
            title: 'User',
            dataIndex: ["blk_user", "blk_users_fname"],
            key: 'blk_user',
            render: (text, record) => {
                const fullName = `${record.blk_user.blk_users_surname} ${record.blk_user.blk_users_fname}`;
                return fullName;
            }
        },
        {
            title: 'Direction',
            dataIndex: "direction",
            key: 'direction',
            valueEnum: {
                1: 'Gated In',
                2: 'Gated Out',
            },
            render: (text, record) => {
                return (
                    <span>
                        {record.direction === 1 ? (
                            <Tag color="green" icon={<CheckCircleOutlined />}>Gated In</Tag>
                        ) : (
                            <Tag color="blue" icon={<ArrowRightOutlined />}>Gated Out</Tag>
                        )}
                    </span>
                );

            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <>
                <Button
                icon={<ArrowRightOutlined />}
                name="action"
                type="primary"
                onClick={
                    () => {
                        showModal(record.id);
                    }
                }
                disabled={isButtonDisabled}
            >
                Manual Override
            </Button>

            <ModalForm
                title="Overide"
                open={isModalVisible}
                
                modalProps={{
                    onCancel: ()=>setIsModalVisible(false),
                    
                    
                }}
                onFinish={(value)=>{
                    // console.log("plateid", plateid)
                    // console.log("plateText", value.platetext);
                    overidePlate(plateid,value.platetext);
                    handleButtonClick(record);


                }}
            >
            <ProFormText
                name="platetext"
                placeholder={record.plateNumber}


                />
            </ModalForm>
            </>
            ),
        },
    ]


    //here

    return (
        <PageContainer>
            <ProCard
                
                style={{
                    //alignContent: "center",
                    marginBottom: "30px",
                    justifyContent: "center"
                }}
            >
                <ProForm
                    style={{
                        //alignContent: "center",
                        marginBottom: "30px",
                        justifyContent: "center"
                    }}
                    layout="horizontal"
                    submitter={{
                        resetButtonProps: {
                            style: {
                                display: 'none',
                            },
                        },
                        submitButtonProps: {
                            style: {
                                display: 'Open Barrier',
                            },
                        },
                    }}
                    onFinish={
                        async (values) => {
                            //console.log("plate", plate);
                            //console.log("directions", direction);
                            gateOut(plate, direction);
                            message.success(`${plate} gated out successfully`);

                            // const plate = values.plate;
                            // const direction = values.direction;
                            // const deviceID = values.deviceID;
                            // const plateColor = values.plateColor;
                            // await gateOut(plate, direction, deviceID, plateColor);
                        }
                    }

                >
                    <ProForm.Group>
                        <ProFormSelect

                            name="plate"
                            label="License Plate No:"
                            placeholder="Please select a type"


                            request={async (params) => {
                                try {
                                    const response = await axios.get('/plateInfo');
                                    const data = response.data; // Assuming the response data is an array
                                    setPlatedata(data);
                                    //console.log("plate data", data);
                                    const options = data.map((item) => ({
                                        label: item.plateNumber, // Display plateNumber
                                        value: item.plateNumber, // Use plateNumber as value
                                    }));

                                    return options;
                                } catch (error) {
                                    //console.error('Error fetching plate info:', error);
                                    return []; // Return an empty array in case of error
                                }
                            }}
                            onChange={(value) => {
                                setPlate(value)
                        
                            }}
                        />



                        <ProFormSelect
                            name="type"
                            label="Gate Operation"
                            valueEnum={{
                                1: 'Gated In',
                                2: 'Gated Out',
                            }}
                            placeholder="Please select a type"
                            onChange={(value) => {
                                //console.log("Gate type", value)
                                setDirection(value)
                            }}
                        />

                        {/* <Button
                    type="primary"
                    style={{
                        width: "120px",
                        marginBottom: "20px",
                    }}
                    onFinnish={() => {
                        //gateOut(plate, direction)
                        console.log(plate, direction);
                    }}
                >
                    Submit
                </Button> */}
                    </ProForm.Group>
                </ProForm>



            </ProCard>


            <ProTable
                columns={columns_plate}
                dataSource={vehicle}
                search={false}
                options={false}
                actionRef={plateRef}
                request={async (value) => {
                    const response = await axios.get('/barrierLogs')
                    const data = response.data;
                    //console.log("vehicle", response.data)
                    
                    setVehicles(data)
                    return data;
                }}
                pagination={{
                    showSizeChanger: true,
                }}


            />
        </PageContainer>

    );
}