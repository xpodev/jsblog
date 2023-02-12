import React, { useEffect } from 'react';
import './App.css';
import { useApi } from './services/api';

function App() {
  const [posts, setPosts] = React.useState([] as any[]);
  const api = useApi();
  useEffect(() => {
    api.get('/posts').then((response) => {
      setPosts(response.data);
    });
  }, [api]);
  return (
    <div className="App">
      {posts.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
