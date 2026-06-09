import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));

describe('App Component', () => {
  it('renders the app component', () => {
    render(<App />);
    // App should render without crashing
    expect(document.body).toBeTruthy();
  });
});
