import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Container, Breadcrumb, Button, ListGroup, Spinner, Form } from 'react-bootstrap';
import logo from '../images/streamflix-logo.png';

export default function ViewMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchMovie = async () => {
    try {
      const res = await fetch(
        `https://rmantonio-movieappserver.onrender.com/movies/getMovie/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch movie details');
        const data = await res.json();
        setMovie(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMovie();
  }, [id, token]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch(
        `https://rmantonio-movieappserver.onrender.com/movies/addComment/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!res.ok) throw new Error('Failed to add comment');
        setComment('');
        fetchMovie();
    } catch (err) {
        alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">Error</h4>
        <p>{error}</p>
        <Button variant="dark" onClick={() => navigate('/movies')}>
          &larr; Back to Movies
        </Button>
      </Container>
    );

  if (!movie) return null;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Container className="py-4" style={{ maxWidth: '800px' }}>
        <div className="mb-4 d-flex align-items-center">
          <img src={logo} alt="StreamFlix Logo" style={{ width: '160px' }} />
        </div>

        <div className="mb-4 p-3 shadow-sm rounded">
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/movies' }}>
              Movies
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {movie.title || 'Untitled'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card className="border-0 shadow rounded">
        <Card.Body className="p-3">
          <h4 className="fw-bold mb-2">{movie.title}</h4>

          <div className="mb-1">
            <strong>Directed by:</strong> {movie.director}
          </div>
          <div className="mb-1">
            <strong>Year:</strong> {movie.year}
          </div>
          <div className="mb-1">
            <strong>Genre:</strong> {movie.genre}
          </div>
          <div className="mb-2">
            <strong>Description:</strong> {movie.description}
          </div>

          {/* COMMENTS */}
          <div className="mb-2">
            <strong>Comments:</strong>
            <ListGroup variant="flush" className="mt-1">
              {movie.comments?.length > 0 ? (
                [...movie.comments].reverse().map((c) => (
                  <ListGroup.Item key={c._id} className="py-1">
                    {c.comment}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted py-1">
                  No comments yet. Be the first to comment!
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          {/* ADD COMMENT */}
          <Form.Group className="mb-2">
            <Form.Label className="mb-1">Add Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
            />
          </Form.Group>

          <Button size="sm" variant="danger" onClick={handleAddComment}>
            Submit
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="ms-2"
            onClick={() => navigate('/movies')}
          >
            Back
          </Button>
        </Card.Body>
      </Card>

      </Container>
    </div>
  );
}
