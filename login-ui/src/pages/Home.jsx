import React, { useState, useEffect } from "react";
import axios from "../helpers/axios";
import ProTable from "@ant-design/pro-table";
import {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProForm,
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
    const [comment, setComment] = useState("");


    // useEffect(() => {
    //     if (!platedata.length) { // Check if platedata is empty
    //       fetchPlateData();
    //     }
    //    // fetchPlateData(); // Call the fetchPlateData function when component mounts

    //   }, [platedata]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPlateData();
        }, 10000); // 10000 milliseconds = 10 seconds

        // Fetch initially when the component mounts
        fetchPlateData();

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Generate options based on platedata
    const options = platedata.map((item) => ({
        label: item.blk_plates, // Display plateNumber
        value: item.blk_plates, // Use plateNumber as value
    }));


    const fetchPlateData = async () => {
        try {
            const response = await axios.get('/Plates');
            const data = response.data; // Assuming the response data is an array
            //console.log("plate data", data);
            setPlatedata(data);
        } catch (error) {
            console.error('Error fetching plate info:', error);
        }
    };



    const handleButtonClick = (record) => {
        // Check if the button for this record is already disabled
        if (!disabledButtons.includes(record.id)) {
            // If not disabled, disable it
            setDisabledButtons([...disabledButtons, record.id]);
        }
    };


    const overidePlate = async (p_id, p_text) => {

        try {
            const request = await axios.put('/plate', {
                _plate: p_text,
                _id: p_id
            });
            //console.log("request", request);
            plateRef.current.reload();
            message.success("Number Plate Updated");
            setIsModalVisible(false);
            handleButtonClick(p_id);


        } catch (err) {
            //message.error("Number Plate Update Failed");
            //console.log(err);
        }

    }


    const showModal = (record) => {
        setPlateid(record);
        setIsModalVisible(true);
    };


    const gateOut = async (platetext, dir, _comment) => {
        // console.log("dir", dir);
        // console.log("platetext", platetext);
        // console.log("_comment", _comment);
        try {
            const request = await axios.post('/barrierLogs', {
                plateNumber: platetext,
                direction: dir,
                comment: JSON.stringify(_comment.currentTarget.value)
            });
            plateRef.current.reload();

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
                            onCancel: () => setIsModalVisible(false),


                        }}
                        onFinish={(value) => {
                            // console.log("plateid", plateid)
                            // console.log("plateText", value.platetext);
                            overidePlate(plateid, value.platetext);
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
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        }
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
                            //console.log(values);
                            gateOut(plate, direction, comment);
                            message.success(`${plate} gated out successfully`);
                            plateRef.current.reload();
                        }
                    }

                >
                    <ProForm.Group>
                        <ProFormSelect

                            name="plate"
                            label="License Plate No:"
                            placeholder="Please select a type"
                            options={options}
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


                        <ProFormText
                            name="blk_comment"
                            label="Comment"
                            placeholder="Please enter a comment"
                            onChange={(value) => {
                                setComment(value)
                            }}
                        />

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
                    pageSize: 10,
                    defaultCurrent: 1
                }}


            />
        </PageContainer>

    );
}