import {useEffect, useReducer, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Card, Col, Divider, Form, Input, Layout, message, Modal, Row, Typography} from 'antd';
import axios from '../Config/axios';
import Cookies from "js-cookie";

const {Header, Content} = Layout;

const {Title} = Typography;

const MainPage = () => {
    const [notes, setNotes] = useState([]);
    const [formCreateNote] = Form.useForm();
    const [formEditNote] = Form.useForm();
    const history = useNavigate();
    
    const [state, setState] = useReducer((oldValue, newValue) => {
        return {...oldValue, ...newValue};
    }, {});
    
    useEffect(() => {
        fetchNotes();
    }, []);
    
    const fetchNotes = async () => {
        try {
            const response = await axios.get('/notes/getAllNotes');
            const postsData = response.data;
            setNotes(postsData);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
    
    const createNote = async () => {
        try {
            const values = await formCreateNote.validateFields();
            const {title, content} = values;
            
            const response = await axios.post('/notes/createNote', {title, content});
            if (response.status === 201) {
                message.success('Note created successfully!');
                formCreateNote.resetFields();
                fetchNotes();
            } else {
                message.error('Error creating notes!');
            }
        } catch (error) {
            console.error('Error creating notes:', error);
        }
    };
    
    const saveEditedNote = async (values) => {
        try {
            const {title, content} = values;
            const response = await axios.put(`/notes/editNote/${state.currentNoteId}`, {title, content});
            if (response.status === 200) {
                setState({
                    setModalOpen: false
                });
                message.success('Note updated successfully');
                fetchNotes();
            } else {
                message.error('Error updating note');
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }
    
    const logout = () => {
        Cookies.remove('token');
        history('/');
    };
    
    return (<Layout
        style = {{
            width: '100%', minHeight: '100vh'
        }}
    >
        <Header style = {{
            background: '#CF96F1',
            color: '#FFF',
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
        }}>
            <div
                style = {{
                    width: '100%', display: "flex", flexDirection: "row", justifyContent: 'center'
                }}
            ><Title level = {3} style = {{margin: 0, color: '#FFF'}}>Notes</Title></div>
            <Button className = "logout" onClick = {logout}
                    style = {{marginLeft: 'auto', background: '#AF73F5', color: '#FFF'}}>Log Out</Button>
        </Header>
        <Content>
            <Card
                style = {{
                    margin: 10,
                }}
            >
                <Form form = {formCreateNote} onFinish = {createNote}>
                    <Form.Item name = "title" rules = {[{required: true, message: 'Please enter a title'}]}>
                        <Input placeholder = "Title"/>
                    </Form.Item>
                    <Form.Item name = "content" rules = {[{required: true, message: 'Please enter content'}]}>
                        <Input.TextArea className = "contentTextArea" placeholder = "Content"/>
                    </Form.Item>
                    <Form.Item>
                        <Button block = {true} type = "primary" htmlType = "submit"
                                style = {{background: '#AF73F5', color: '#FFF'}}>Create Note</Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card
                style = {{
                    margin: 10,
                }}
            ><Row
                styles = {{
                    height: '100%'
                }}
                gutter = {10}>
                {notes.map(post => (<Col span = {8}>
                    <Card key = {post.note_id} style = {{marginBottom: 10}}>
                        <Col>
                            <Title level = {4}>{post.title}</Title>
                            <Typography>{post.content}</Typography>
                            <Divider/>
                            <Row gutter = {10}>
                                <Col span = {12}>
                                    <Button
                                        onClick = {async () => {
                                            formEditNote.setFieldsValue(post);
                                            setState({
                                                currentNoteId: post.note_id, setModalOpen: true, note: post
                                            });
                                        }}
                                        block = {true} type = {"primary"}
                                        style = {{background: '#AF73F5', color: '#FFF'}}>Edit</Button>
                                </Col>
                                <Col span = {12}>
                                    <Button
                                        block = {true} type = {"primary"}
                                        onClick = {async () => {
                                            await axios.delete(`/notes/deleteNote/${post.note_id}`);
                                            fetchNotes();
                                        }}
                                        style = {{background: '#FF0000', color: '#FFF'}}>Delete</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Card>
                </Col>))}
                <Modal
                    onCancel = {() => {
                        setState({
                            setModalOpen: false
                        });
                    }}
                    cancelButtonProps = {{style: {display: 'none'}}}
                    okButtonProps = {{style: {display: 'none'}}}
                    title = "Edit Note"
                    open = {state.setModalOpen}>
                    <Form
                        form = {formEditNote}
                        onFinish = {saveEditedNote}
                    >
                        <Form.Item
                            name = "title"
                            rules = {[{required: true, message: 'Please enter a title'}]}>
                            <Input placeholder = "Title"/>
                        </Form.Item>
                        <Form.Item
                            name = "content"
                            rules = {[{required: true, message: 'Please enter content'}]}>
                            <Input.TextArea className = "contentTextArea" placeholder = "Content"/>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                block = {true} type = "primary" htmlType = "submit"
                                style = {{background: '#AF73F5', color: '#FFF'}}>Edit
                                Note</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Row>
            </Card>
        </Content>
    </Layout>);
};

export default MainPage;
