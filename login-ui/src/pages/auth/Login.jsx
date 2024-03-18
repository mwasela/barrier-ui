import { ConfigProvider, notification } from "antd";
import { LoginForm, ProFormCheckbox, ProFormText } from "@ant-design/pro-form";
import bsicon from "../../public/GIL_LOGO.png";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "../../helpers/axios";


export default function Login() {

  const navigation = useNavigate();

  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
  }

  return (
    <ConfigProvider
      locale={{
        locale: "en",
        //gmt +3
        
        
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw"

        }}
        
      >
        <LoginForm
          //logo={gbhlIcon}
          //resize logo
          style={{
            paddingTop: 60
          }}
          logo={<img src={bsicon} />}
          //title="Barrier APP"
          subTitle={<h1
            style={{
            marginBlockStart: "0.2em !important",
            marginBlockEnd: "0.2em !important",

          }}
          ><strong>Barrier Control</strong></h1>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={(values) => {

            axios.post('/user/login', values).then((response) => {
              console.log("response", response);
              localStorage.setItem("token", response.data.token);
              navigation("/", { replace: true });
            }).catch((error) => {
              console.log("error--", error);
              notification.error({
                message: "Login Failed",
                description: error.response.data.message,
              });
            });
          }}

        >
          <ProFormText
            name="email"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}

            placeholder={"Email Address"}
            rules={[
              {
                required: true,
                message: "Please enter your username!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"Password"}
            rules={[
              {
                required: true,
                message: "Please enter your password！",
              },
            ]}
          />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="rememberme">
              Remember me
            </ProFormCheckbox>
            <Link
              style={{
                float: "right",
              }}
              to="/auth/forgot-password"
            >
              Forgot password
            </Link>
          </div>
        </LoginForm>
      </div>
    </ConfigProvider>
  );
}
