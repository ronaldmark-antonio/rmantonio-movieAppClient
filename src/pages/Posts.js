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
<<<<<<< HEAD:src/pages/Movies.js
            ? 'https://rmantonio-movieappserver.onrender.com/movies/getMovies'
            : 'https://rmantonio-movieappserver.onrender.com/movies/getMovies';
=======
            ? 'https://rmantonio-blogapp.onrender.com/posts/getPosts'
            : 'https://rmantonio-blogapp.onrender.com/posts/getPosts';
>>>>>>> 43dab5307a81d472c2f0d259e6a8d654d9b095a1:src/pages/Posts.js

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
