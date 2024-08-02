import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Form, FormControl, Modal, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import axios from "axios";

export default function ProfilePage() {
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    const [posts, setPosts] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", author: "", content: "" });
    const [editPost, setEditPost] = useState({ id: "", title: "", author: "", content: "" });
    const [viewAllClicked, setViewAllClicked] = useState(false);
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();
    const contentURL = "https://252ade67-a896-419f-9d35-239842af9f62-00-3gudfx890km3v.spock.replit.dev";

    useEffect(() => {
        if (!authToken) {
            navigate("/login");
        }
    }, [authToken, navigate]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${contentURL}/posts`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const handleLogout = () => {
        setAuthToken("");
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${contentURL}/posts/${searchId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(response.data.data ? [response.data.data] : []);
            setViewAllClicked(false);
        } catch (error) {
            console.error("Error searching post", error);
            setPosts([]);
            setViewAllClicked(false);
        }
    };

    const handleViewAll = async () => {
        if (viewAllClicked) {
            setPosts([]);
            setViewAllClicked(false);
        } else {
            fetchPosts();
            setViewAllClicked(true);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${contentURL}/posts/${postId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleCreatePost = async () => {
        try {
            const response = await axios.post(`${contentURL}/posts`, newPost, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (viewAllClicked) {
                setPosts([...posts, response.data.data]);
            }
            setNewPost({ title: "", author: "", content: "" });
            handleCloseModal();
        } catch (error) {
            console.error("Error creating post", error);
        }
    };

    const handleShowEditModal = (post) => {
        setEditPost(post);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);

    const handleEditPost = async () => {
        try {
            await axios.put(`${contentURL}/posts/${editPost.id}`, editPost, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setPosts(posts.map(post => (post.id === editPost.id ? editPost : post)));
            setNotification("Post updated successfully");
            handleCloseEditModal();
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">Blog</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="outline-primary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="py-4">
                <Container>
                    <Form className="d-flex mb-3" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Search by ID"
                            className="me-2"
                            aria-label="Search"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Form>
                    <Button variant="primary" onClick={handleShowModal}>
                        Create Post
                    </Button>
                    <Button variant="secondary" onClick={handleViewAll} className="ms-2">
                        {viewAllClicked ? "Hide All" : "View All"}
                    </Button>
                </Container>
                <Container className="mt-3">
                    {notification && <Alert variant="success">{notification}</Alert>}
                    {viewAllClicked ? (
                        posts.length > 0 ? (
                            posts.map(post => (
                                <Card key={post.id} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">ID: {post.id} | Author: {post.author}</Card.Subtitle>
                                        <Card.Text>{post.content}</Card.Text>
                                        <Button variant="outline-danger" onClick={() => handleDelete(post.id)}>Delete</Button>
                                        <Button variant="outline-primary" onClick={() => handleShowEditModal(post)} className="ms-2">Edit</Button>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No posts available</p>
                        )
                    ) : (
                        <p>Search post by ID</p>
                    )}
                </Container>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPost.author}
                                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreatePost}>
                        Create Post
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editPost.title}
                                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                value={editPost.author}
                                onChange={(e) => setEditPost({ ...editPost, author: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editPost.content}
                                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditPost}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
