const Post = ({ post }) => {
  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};
