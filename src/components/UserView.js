import { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../images/streamflix-logo.png';

export default function UserView() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = [...movies].reverse().slice(indexOfFirstMovie, indexOfLastMovie);

  useEffect(() => {
    const fetchMovies = async () => {

      try {
        const res = await fetch('https://rmantonio-movieappserver.onrender.com/movies/getMovies', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch movies');

	        const data = await res.json();

	        setMovies(Array.isArray(data.movies) ? data.movies : []);

      } catch (err) {

	        console.error('Error loading movies:', err);

	        alert('Could not load movies.');
      }
    };

    fetchMovies();
  }, [token]);

  const handlePageChange = (page) => {

    setCurrentPage(page);
    
    window.scrollTo(0, 0);
  };

  const handleViewMovie = (movieId) => {

    navigate(`/movie/${movieId}`);

  };

const handleLogout = () => {

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';

};

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="StreamFlix Logo"
              style={{ width: '180px', height: 'auto', marginRight: '10px' }}
            />
          </div>
          <Button variant="dark" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark">Welcome to StreamFlix 🎬</h1>
          <p className="text-muted fs-5">
            Sit back, relax, and enjoy the latest blockbusters and timeless classics.
          </p>
        </div>

        {currentMovies.length === 0 ? (
          <p className="text-center text-muted">No movies found.</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {currentMovies.map((movie) => (
                <Col key={movie._id || movie.id}>
                  <Card
                    className="h-100 border-0"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow:
                        '0 4px 8px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.10)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 16px rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title className="mb-2 fs-5 text-dark fw-bold">
                        {movie.title || movie.name || 'Untitled'}
                      </Card.Title>

                      <Card.Text className="mb-1 text-dark small">
                        <strong>Director:</strong> {movie.director || 'Unknown'}
                      </Card.Text>

                      <Card.Text className="mb-1 text-dark small">
                        <strong>Year:</strong> {movie.year || 'N/A'}
                      </Card.Text>

                      <Card.Text className="mb-1 text-dark small">
                        <strong>Description:</strong>{' '}
                        {movie.description
                          ? movie.description.length > 80
                            ? movie.description.slice(0, 80) + '...'
                            : movie.description
                          : 'No description available.'}
                      </Card.Text>

                      <Card.Text className="mb-1 text-dark small">
                        <strong>Genre:</strong> {movie.genre || 'N/A'}
                      </Card.Text>

                      {movie.comments && movie.comments.length > 0 && (
                        <div className="mb-1 text-dark small">
                          <strong>Comments:</strong>
                          <ul
                            className="mb-1"
                            style={{
                              maxHeight: '60px',
                              overflowY: 'auto',
                              paddingLeft: '18px',
                            }}
                          >
                            {[...movie.comments].reverse().map((c) => (
                              <li key={c._id}>{c.comment}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        variant="danger"
                        className="mt-auto py-2 px-2 rounded-3"
                        onClick={() => handleViewMovie(movie._id || movie.id)}
                      >
                        Watch Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-5">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const isActive = page === currentPage;

                  return (
                    <Pagination.Item
                      key={page}
                      active={isActive}
                      onClick={() => handlePageChange(page)}
                      className={
                        isActive
                          ? 'bg-danger text-white border-danger'
                          : 'bg-dark text-white'
                      }
                      style={{
                        border: 'none',
                        margin: '0 4px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      {page}
                    </Pagination.Item>
                  );
                })}
              </Pagination>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
