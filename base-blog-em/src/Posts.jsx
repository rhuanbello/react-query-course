import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isLoading, isError, error } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), {
    staleTime: 2000,
    cacheTime: 1000,
    retry: 5,
    retryDelay: 1000,
  })

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const pageNumber = currentPage + 1;
      queryClient.prefetchQuery(['posts', pageNumber], () => fetchPosts(pageNumber))
    }
  }, [currentPage, queryClient])

  if (isLoading) return <h3>Loading...</h3>

  if (isError) return (
    <>
      <h3>Oops, something went wrong</h3>
      <p>{error.toString()}</p>
    </>
  )



  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => { 
          setCurrentPage((currentPage) => currentPage - 1)
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => { setCurrentPage((currentPage) => currentPage + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
