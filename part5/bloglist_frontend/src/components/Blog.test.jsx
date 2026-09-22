import { render, screen } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'someone',
    user: {
      username: 'user1',
      name: 'fullname_user1',
      id: 'someUserId',
    },
    url: 'https://example.com/something.html',
    likes: 4,
    id: 'someBlogId',
  };

  const user = {
    username: 'user1',
    name: 'fullname_user1',
    blogs: [
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        id: blog.id,
      },
    ],
    id: 'someUserId',
  };

  const fetchallBlogsAndSort = vi.fn();

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        user={user}
        fetchallBlogsAndSort={fetchallBlogsAndSort}
      />,
    );
  });

  test('displays blog title and author, but does not display its URL or number of likes by default', () => {
    const titleAuthorElement = screen.getByText(
      `${blog.title} -- ${blog.author}`,
      {
        exact: false,
      },
    );
    const urlElement = screen.queryByText(`${blog.url}`);
    const likeButton = screen.queryByText('like');

    expect(titleAuthorElement).toBeDefined();
    expect(urlElement).toBeNull();
    expect(likeButton).toBeNull();
  });
});
