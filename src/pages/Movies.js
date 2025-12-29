import { useEffect, useState } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import { useGlobalStore } from '../UserContext';

export default function MoviesPage() {
  const { user } = useGlobalStore();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {

      if (!user.isLoading) {

        try {
          const token = localStorage.getItem('token');
          const endpoint = user.isAdmin
            ? 'https://rmantonio-movieappserver.onrender.com/movies/getMovies'
            : 'https://rmantonio-movieappserver.onrender.com/movies/getMovies';

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {

            throw new Error(`HTTP error! status: ${response.status}`);

          }

          const data = await response.json();

          setMovies(data.movies || data);

        } catch (error) {
            console.error('Error fetching movies:', error);
        }
      }
    };

    fetchMovies();
  }, [user]);

  if (user.isLoading) return <p>Loading...</p>;

  return (
    <div className="container">
      {user.isAdmin ? (
        <AdminView moviesData={movies} />
      ) : (
        <UserView moviesData={movies} />
      )}
    </div>
  );
}
