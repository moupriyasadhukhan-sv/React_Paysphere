import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./login";
import { loginUser } from "../../services/authservices/authService";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


jest.mock("../../stores/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));


jest.mock("../../services/authservices/authService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../../stores/authSlice", () => ({
  setCredentials: jest.fn((payload) => ({ type: "auth/setCredentials", payload })),
}));



beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

const mockStore = configureStore([]);

function renderLogin() {
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
}

// ----------------------------------------------------------
//  VALIDATION CHECKS
// ----------------------------------------------------------

test("shows validation errors when form is empty", async () => {
  renderLogin();

  fireEvent.click(screen.getByText("Sign In"));

  expect(await screen.findByText("Email is required.")).toBeInTheDocument();
  expect(await screen.findByText("Password is required.")).toBeInTheDocument();
  expect(await screen.findByText("Role is required.")).toBeInTheDocument();
});

// test("shows invalid email message", async () => {
//   renderLogin();

//   fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
//     target: { value: "notanemail" },
//   });

//   fireEvent.click(screen.getByText("Sign In"));

//   expect(await screen.findByText("Invalid email address.")).toBeInTheDocument();
// });
// test("shows invalid email message", async () => {
//   renderLogin();

//   fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
//     target: { value: "notanemail" },
//   });

//   fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
//     target: { value: "ValidPass123" },
//   });

//   fireEvent.change(screen.getByRole("combobox"), {
//     target: { value: "User" },
//   });

//   await waitFor(() => fireEvent.click(screen.getByText("Sign In")));

//   expect(await screen.findByText("Invalid email address.")).toBeInTheDocument();
// });


test("strong password passes validation", () => {
  renderLogin();

  fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
    target: { value: "test@mail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
    target: { value: "Moupriya@123" }, // strong password
  });

  fireEvent.change(screen.getByRole("combobox"), {
  target: { value: "User" },
  });

  fireEvent.click(screen.getByText("Sign In"));

  // No validation error should appear
  expect(screen.queryByText("Minimum 6 characters.")).toBeNull();
});

// ----------------------------------------------------------
//  ROLE REDIRECT TESTS
// ----------------------------------------------------------

const roleRedirectCases = [
  { role: "Admin", backendRole: "Admin", expected: "/dashboard/admin" },
  { role: "User", backendRole: "User", expected: "/dashboard/user" },
  { role: "Merchant", backendRole: "Merchant", expected: "/dashboard/merchant" },
  { role: "Ops", backendRole: "Ops", expected: "/dashboard/ops" },
  { role: "Risk", backendRole: "Risk", expected: "/dashboard/risk" }
];

test.each(roleRedirectCases)(
  "redirects correctly for role: %s",
  async ({ role, backendRole, expected }) => {
    loginUser.mockResolvedValue({
      data: {
        accessToken: "xyz123",
        role: backendRole,
        userID: "999",
      },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "Moupriya@123" },
    });

    fireEvent.change(screen.getByRole("combobox"), {
        target: { value: role },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expected);
    });
  }
);

// ----------------------------------------------------------
//  INVALID ROLE MISMATCH TEST
// ----------------------------------------------------------

test("shows error if role does not match backend", async () => {
  loginUser.mockResolvedValue({
    data: {
      accessToken: "token123",
      role: "User",
      userID: "400",
    },
  });

  jest.spyOn(window, "alert").mockImplementation(() => {});

  renderLogin();

  fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
    target: { value: "admin@mail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
    target: { value: "Pass@123" },
  });

  fireEvent.change(screen.getByRole("combobox"), {
  target: { value: "Admin" },
  });
  fireEvent.click(screen.getByText("Sign In"));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Role mismatch! You cannot login as Admin.");
  });
});