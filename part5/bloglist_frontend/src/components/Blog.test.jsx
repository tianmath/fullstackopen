import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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

  const user1 = {
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

  const user2 = {
    username: 'user2',
    name: 'fullname_user2',
    blogs: [],
    id: 'someUserId2',
  };

  const likeBlog = vi.fn();
  const removeBlog = vi.fn();

  describe('when user is NOT authenticated', async () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <Blog
            blog={blog}
            user={null}
            onLike={likeBlog}
            removeBlog={removeBlog}
          />
        </MemoryRouter>,
      );
    });

    test('blog information and the number of likes are displayed, but buttons are not displayed', async () => {
      const titleAuthorElement = screen.getByText(
        `${blog.author}: ${blog.title}`,
        { exact: false },
      );
      const urlElement = screen.getByText(`${blog.url}`);
      const ownerElement = screen.getByText('Added by', { exact: false });
      const likesElement = screen.getByText('likes', { exact: false });
      const likeButton = screen.queryByText('like');
      const removeButton = screen.queryByText('remove');

      expect(titleAuthorElement).toBeDefined();
      expect(urlElement).toBeDefined();
      expect(ownerElement).toBeDefined();
      expect(likesElement).toBeDefined();
      expect(likeButton).toBeNull();
      expect(removeButton).toBeNull();
    });
  });

  describe('when user is authenticated', () => {
    test('if NOT blog owner then the like button is displayed but the remove button is not', async () => {
      render(
        <MemoryRouter>
          <Blog
            blog={blog}
            user={user2}
            onLike={likeBlog}
            removeBlog={removeBlog}
          />
        </MemoryRouter>,
      );

      const likeButton = screen.getByText('like');
      expect(likeButton).toBeDefined();

      const removeButton = screen.queryByText('remove');
      expect(removeButton).toBeNull();
    });

    test('if blog owner then both the like button and the remove button are displayed', async () => {
      render(
        <MemoryRouter>
          <Blog
            blog={blog}
            user={user1}
            onLike={likeBlog}
            removeBlog={removeBlog}
          />
        </MemoryRouter>,
      );

      const likeButton = screen.getByText('like');
      expect(likeButton).toBeDefined();

      const removeButton = screen.queryByText('remove');
      expect(removeButton).toBeDefined();
    });
  });

  test('calls the function passed as props twice if the like button is clicked twice', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');

    await user.click(button);

    const likeButton = screen.queryByText('like');

    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeBlog.mock.calls).toHaveLength(2);
  });
});
