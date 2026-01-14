import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock the Clerk components and hooks
vi.mock("@clerk/clerk-react", () => ({
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signed-out">{children}</div>
  ),
  useClerk: () => ({
    redirectToSignIn: vi.fn(),
  }),
}));

// Mock the Nav component
vi.mock("@/components/Nav", () => ({
  Nav: () => <div data-testid="nav">Nav</div>,
}));

// Mock the getShortURL function
vi.mock("@/data/getShortURL", () => ({
  getShortURL: vi
    .fn()
    .mockResolvedValue({ shortURL: "http://localhost:3000/urls/test123" }),
}));

// Mock icons
vi.mock("react-icons/fa", () => ({
  FaArrowCircleRight: ({ style }: { style?: React.CSSProperties }) => (
    <span style={style}>→</span>
  ),
  FaCheckCircle: ({ style }: { style?: React.CSSProperties }) => (
    <span style={style}>✓</span>
  ),
  FaLink: () => <span>🔗</span>,
}));

vi.mock("react-icons/fa6", () => ({
  FaRegCopy: () => <span>📋</span>,
}));

// Import the actual App component after mocks are set up
const { App } = await import("./index");

describe("Home Page (Non-logged-in)", () => {
  it("should match snapshot for non-logged-in state", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("should render the main heading", () => {
    const { getByText } = render(<App />);
    expect(getByText("URL Shortener")).toBeTruthy();
  });

  it("should show sign in prompt when not logged in", () => {
    const { getByText } = render(<App />);
    expect(getByText(/Sign In/)).toBeTruthy();
    expect(getByText(/first if you want to track your URLs!/)).toBeTruthy();
  });

  it("should render URL input field", () => {
    const { getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("Enter URL to shorten");
    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("text");
  });

  it("should render shorten button", () => {
    const { getByRole } = render(<App />);
    const button = getByRole("button", { name: /Shorten/ });
    expect(button).toBeTruthy();
    expect(button?.getAttribute("type")).toBe("submit");
  });
});
