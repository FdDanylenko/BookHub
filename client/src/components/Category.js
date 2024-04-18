import Feed from "./Feed";

const Category = ({ books }) => {
  return (
    <main className="category">
      {books.length ? (
        <Feed books={books} />
      ) : (
        <div className="notFoundPage">
          <p className="postTitle">No books found</p>
        </div>
      )}
    </main>
  );
};

export default Category;
