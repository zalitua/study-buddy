import { render, screen } from "@testing-library/react";
import ProfileForm from "./ProfileForm";
import userEvent from "@testing-library/react";

it("should show error message when all the fields are not entered", () => {
  render(<ProfileForm />);
  const buttonElement = screen.getByRole("button");
  userEvent.click(buttonElement);
});
