import { useMutation, useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id),
    {
      staleTime: 2000,
      cacheTime: 1000
    }
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId))

  if (isLoading) return <h3>Loading...</h3>

  if (isError) return (
    <>
      <h3>Oops, something went wrong</h3>
      <p>{error.toString()}</p>
    </>
  )

  const renderMutationsMessages = () => {
    if (deleteMutation.isError) {
      return <p style={{ color: "red" }}>Error deleting post</p>;
    } else if (deleteMutation.isLoading) {
      return <p style={{ color: "red" }}>Deleting post...</p>;
    } else if (deleteMutation.isSuccess) {
      return <p style={{ color: "green" }}>Post deleted successfully</p>;
    }

    if (updateMutation.isError) {
      return <p style={{ color: "red" }}>Error updating post</p>;
    } else if (updateMutation.isLoading) {
      return <p style={{ color: "red" }}>Updating post...</p>;
    } else if (updateMutation.isSuccess) {
      return <p style={{ color: "green" }}>Post updated successfully</p>;
    }
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>

      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>

      {renderMutationsMessages()}

      <button
        onClick={() => updateMutation.mutate(post.id)}
      >
        Update title
      </button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
