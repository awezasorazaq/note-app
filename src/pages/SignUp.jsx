import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import axios from '../Config/axios';

const { Title } = Typography;

const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const history = useNavigate();

    const onFinish = async (values) => {
        if (values.username && values.email && values.password) {
            setErrorMessage('');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(values.email)) {
                setErrorMessage('Please enter a valid email address.');
                return;
            }

            try {
                const response = await axios.post('/user/signup', {
                    username: values.username,
                    password: values.password,
                    email: values.email,
                });

                if (response.status === 200) {
                    message.success('Registration successful!');
                    history('/');
                }
            } catch (error) {
                setErrorMessage('Registration failed! ' + (error.response?.data.message || error.message));
            }
        } else {
            setErrorMessage('Please fill in all fields.');
        }
    };

    return (
        <div className="signup-container">
            <Title level={2} style={{color:'#af73f5'}}>Sign Up</Title>
            <Form name="signup" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{background:'#cf96f1', color:'#FFF', transition: 'background-color 0.3s ease'}}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
            <p className="error-message">{errorMessage}</p>
            <div className="login-link">
                Already have an account? <Link to="/">Login</Link>
            </div>
        </div>
    );
};

export default SignUp;
