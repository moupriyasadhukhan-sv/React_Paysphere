import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./registration";
import { registerUser } from "../../services/authservices/authService";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("../../services/authservices/authService", () => ({
  registerUser: jest.fn(),
}));


jest.mock("../../stores/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));


beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

function renderRegister() {
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );
}

// ----------------------------------------------------------
// VALIDATION TESTS
// ----------------------------------------------------------

test("shows validation errors when all fields are empty", async () => {
  renderRegister();

  fireEvent.click(screen.getByText("Create Account"));

  expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
  expect(await screen.findByText("Email is required.")).toBeInTheDocument();
  expect(await screen.findByText("Password is required.")).toBeInTheDocument();
  expect(await screen.findByText("Please confirm password.")).toBeInTheDocument();
  expect(await screen.findByText("Phone is required.")).toBeInTheDocument();
  expect(await screen.findByText("Role is required.")).toBeInTheDocument();
});

test("shows password mismatch error", async () => {
  renderRegister();

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Pass123" },
  });

  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "OtherPass" },
  });

  fireEvent.click(screen.getByText("Create Account"));

  expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
});

test("shows category dropdown when Merchant role is selected", () => {
  renderRegister();

  fireEvent.change(screen.getByLabelText("Account Type"), {
    target: { value: "Merchant" },
  });

  expect(screen.getByLabelText("Category")).toBeInTheDocument();
});

test("hides category when User role is selected", () => {
  renderRegister();

  fireEvent.change(screen.getByLabelText("Account Type"), {
    target: { value: "User" },
  });

  expect(screen.queryByLabelText("Category")).toBeNull();
});

// ----------------------------------------------------------
// SUCCESSFUL REGISTRATION
// ----------------------------------------------------------

test("successful registration redirects to login page", async () => {
  registerUser.mockResolvedValue({ data: { success: true } });

  renderRegister();

  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "john@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Pass123" },
  });

  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "Pass123" },
  });

  fireEvent.change(screen.getByLabelText("Phone"), {
    target: { value: "9876543210" },
  });

  fireEvent.change(screen.getByLabelText("Account Type"), {
    target: { value: "User" },
  });

  fireEvent.click(screen.getByText("Create Account"));

  await waitFor(() => expect(registerUser).toHaveBeenCalled());

  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

// ----------------------------------------------------------
// BACKEND ERROR TEST
// ----------------------------------------------------------

test("shows backend error message", async () => {
  registerUser.mockRejectedValue({
    response: { data: { message: "Email already exists." } },
  });

  jest.spyOn(window, "alert").mockImplementation(() => {});

  renderRegister();

  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "john@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Pass123" },
  });

  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "Pass123" },
  });

  fireEvent.change(screen.getByLabelText("Phone"), {
    target: { value: "9876543210" },
  });

  fireEvent.change(screen.getByLabelText("Account Type"), {
    target: { value: "User" },
  });

  fireEvent.click(screen.getByText("Create Account"));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Email already exists.");
  });
});