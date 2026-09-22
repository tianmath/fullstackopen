import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  const addBlog = vi.fn();

  beforeEach(() => {
    render(<BlogForm addBlog={addBlog} />);
  });

  test('calls the event handler it receives as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup();

    const title = screen.getByLabelText('title:');
    const author = screen.getByLabelText('author:');
    const url = screen.getByLabelText('url:');
    const createButton = screen.getByText('create');

    await user.type(title, 'some blog title');
    await user.type(author, 'someone');
    await user.type(url, 'https://www.example.com/blog.html');

    await user.click(createButton);

    expect(addBlog.mock.calls).toHaveLength(1);

    expect(addBlog.mock.calls[0][0].title).toBe('some blog title');
    expect(addBlog.mock.calls[0][0].author).toBe('someone');
    expect(addBlog.mock.calls[0][0].url).toBe(
      'https://www.example.com/blog.html',
    );
  });
});
