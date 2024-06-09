import {useEffect, useState} from 'react';
import {Button, Form, Input, message, Typography} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import axios from '../config/axios';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/LoginPage.css';
import Cookies from 'js-cookie';

const {Title} = Typography;

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const history = useNavigate();
    useEffect(() => {
        if (Cookies.get('token')) {
            history('/mainPage');
        }
    }, []);
    
    const onFinish = async (values) => {
        try {
            const response = await axios.post('/user/login', {
                username: values.username,
                password: values.password,
            });
            
            if (response.status === 200) {
                message.success('Login successful!');
                localStorage.setItem('username', values.username);
                localStorage.setItem('user_id', response.data.user_id);
                history('/mainPage');
            }
        } catch (error) {
            setErrorMessage('Login failed! ' + (error.response?.data.message || error.message));
        }
    };
    
    return (
        <div
        style={{
            width: '100vw',
            height: '100vh',
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
        >
            <div className="login-container">
                <Title level={2} style={{color: '#AF73F5'}}>Login</Title>
                <Form name="login" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please enter your username!'}]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="Username"
                            className="input-field"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please enter your password!'}]}
                    >
                        <Input.Password
                            prefix={<LockOutlined/>}
                            placeholder="Password"
                            className="input-field"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button"
                                style={{
                                    background: '#CF96F1',
                                    color: '#FFF',
                                    transition: 'background-color 0.3s ease'
                                }}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <p className="error-message">{errorMessage}</p>
                <div className="signUp-link">
                    Don't have an account? <Link to="/signUp">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

