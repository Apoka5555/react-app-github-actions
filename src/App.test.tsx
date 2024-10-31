import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Simple react application with cypress", () => {
  render(<App />);
  const linkElement = screen.getByText(
    /Simple react application with cypress/i
  );
  expect(linkElement).toBeInTheDocument();
});
