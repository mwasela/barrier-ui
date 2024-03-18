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

    const [plate, setPlate] = useState([]);
    const [direction, setDirection] = useState([]);
    const [vehicle, setVehicles] = useState([]);

//     const ColorText = styled.span`
//           color: ${({ color }) => color};
// `;

    const gateOut = async (plateNumber, theDirection, deviceID, plateColor) => {
        try {
            const response = await axios.post('barrierLogs', {
                plateNumber: plateNumber,
                direction: theDirection, // Changed TheDirection to theDirection
                deviceID: deviceID,
                plateColor: plateColor,
            });
            console.log("gate out", response.data);
            message.success(plateNumber, " gated out successfully");
            return response;
        } catch (err) {
            console.error("Error in gateOut:", err);
            throw err; // Throw error to handle it wherever the gateOut function is called
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
            // render: (plateColor) => {
            //     let color;
            //     // Determine the color based on the plateColor value
            //     switch (plateColor) {
            //       case 'red':
            //         color = 'red';
            //         break;
            //       case 'blue':
            //         color = 'blue';
            //         break;
            //       case 'green':
            //         color = 'green';
            //         break;
            //       // Add more cases for other plate colors as needed
            //       default:
            //         color = 'black';
            //         break;
            //     }
            //     return <ColorText color={color}>{plateColor}</ColorText>;
            //   }

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
        }
    ]




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
                            console.log("plate", plate);
                            console.log("directions", direction);
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
                                    console.log("res", data);
                                    // Map the data to options correctly, extracting only plateNumber
                                    const options = data.map((item) => ({
                                        label: item.plateNumber, // Display plateNumber
                                        value: item.plateNumber, // Use plateNumber as value
                                    }));

                                    return options;
                                } catch (error) {
                                    console.error('Error fetching plate info:', error);
                                    return []; // Return an empty array in case of error
                                }
                            }}
                        />

                        {/* <ProFormSelect
                        name="plate"
                        label="License Plate No:"
                        placeholder="Please select a type"
                        request={async (params) => {
                            try {
                                const response = await axios.get('/plateInfo');
                                const data = response.data;
                                // Filter out empty strings and map them to options
                                const options = data.filter(item => item.trim() !== '').map((plate, index) => ({
                                    label: plate,
                                    value: option.plateNumber, // You can use the index as the value if needed
                                }));

                                return options;
                            } catch (error) {
                                console.error('Error fetching plate info:', error);
                                return []; // Return an empty array in case of error
                            }
                        }}
                        onChange={(value, option) => {
                            console.log("plate", value)
                            setPlate(option.value)
                        }}
                    /> */}


                        <ProFormSelect
                            name="type"
                            label="Gate Operation"
                            valueEnum={{
                                1: 'Gated In',
                                2: 'Gated Out',
                            }}
                            placeholder="Please select a type"
                            onChange={(value) => {
                                console.log("value", value)
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