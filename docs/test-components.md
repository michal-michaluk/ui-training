# Best Practices for React Component Testing

Modern React testing focuses on confidence and maintainability. The industry standard has shifted away from testing implementation details (like internal state) toward **testing how the user interacts with your application**.

The following practices rely heavily on **React Testing Library (RTL)** and **Jest** or **Vitest**.

---

## 1. The Golden Rule: Test Behavior, Not Implementation

**Principle:** If you refactor your code (e.g., changing `useState` to `useReducer`, or renaming a function) but the UI behaves the same, your tests should **not** break.

- **❌ Avoid:** Testing internal state (`wrapper.state('isOpen')`), private methods, or specific CSS class names.
- **✅ Do:** Test what the user sees and does (clicking a button, reading text).

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

## 2. Prioritize Queries by Accessibility

RTL provides many ways to find elements, but they are not equal. You should query elements in the same priority order that a user (or screen reader) perceives them.

### The Priority Hierarchy:

1.  **`getByRole` (Top Priority):**
    - This ensures your app is accessible. It mimics how screen readers navigate.
    - _Example:_ `screen.getByRole('button', { name: /submit/i })`
2.  **`getByLabelText`:**
    - Best for form inputs. It ensures your inputs are properly labeled.
    - _Example:_ `screen.getByLabelText(/email address/i)`
3.  **`getByPlaceholderText` / `getByText`:**
    - Useful for non-interactive content.
4.  **`getByTestId` (Last Resort):**
    - Only use this if you cannot select the element by semantic means. Users cannot see "data-testid", so relying on it doesn't prove the UI is usable.

## 3. Simulate Real User Events (`user-event`)

Avoid using `fireEvent` (the low-level RTL method). Instead, use the companion library `@testing-library/user-event`.

**Why?**
`fireEvent` directly dispatches a DOM event. `user-event` simulates the full browser interaction.

- _Example:_ When a user types, they trigger `focus` -> `keydown` -> `input` -> `keyup`. `user-event` fires all of these. `fireEvent` only fires `change`.

```javascript
// ❌ Low fidelity (Avoid)
fireEvent.change(input, { target: { value: "hello" } });

// ✅ High fidelity (Recommended)
const user = userEvent.setup();
await user.type(input, "hello");
```

## 4. Structure with the "AAA" Pattern

Organize your tests so that setup, user actions, and assertions are easy to follow: render and set up mocks, then perform the interaction (clicks, typing), then assert the outcome. You don't need to label sections with comments—clear ordering and naming are enough.

```javascript
test("displays success message on form submit", async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email/i);
  const submitBtn = screen.getByRole("button", { name: /send/i });

  await user.type(emailInput, "test@example.com");
  await user.click(submitBtn);

  const successMsg = await screen.findByText(/message sent/i);
  expect(successMsg).toBeInTheDocument();
});
```

## 5. Master Async Queries

React updates are often asynchronous (state changes, API calls). Using the wrong query type is the most common cause of flaky tests.

| Query Type       | Behavior                                | Use Case                                                                      |
| :--------------- | :-------------------------------------- | :---------------------------------------------------------------------------- |
| **`getBy...`**   | Throws error if not found immediately.  | Default for elements present on load.                                         |
| **`queryBy...`** | Returns `null` if not found.            | **Only** for asserting an element does _not_ exist (`not.toBeInTheDocument`). |
| **`findBy...`**  | Returns a Promise (waits up to 1000ms). | For elements that appear after an interaction or API call.                    |

**Example:**

```javascript
// ❌ Bad: Using waitFor with getBy
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// ✅ Good: Using findBy
expect(await screen.findByText("Loaded")).toBeInTheDocument();
```

## 6. Mock Network Requests with MSW

Do not test against real APIs (slow, flaky). Also, avoid mocking `fetch` or `axios` directly in every test file (messy, leaks implementation details).

**Best Practice:** Use **Mock Service Worker (MSW)**.
MSW intercepts requests at the network layer. Your component code remains exactly the same (it thinks it's calling `fetch`), but the test server intercepts it and returns the JSON you define.

## 7. Avoid "Shallow" Rendering

In the past (Enzyme era), "shallow" rendering was popular to isolate components.
**Don't do this.**
If you shallow render a `<Form>` containing a `<Button>`, you aren't testing if the button actually triggers the submit. You are testing implementation details. Render the full tree ("Integration Testing") to ensure units work together.

## 8. Use Snapshots Sparingly

Snapshot tests create a large text file of your rendered HTML.

- **The Trap:** They fail on trivial changes (fixing a typo, moving a div), leading to "Snapshot Fatigue" where developers update them without looking.
- **The Fix:** Use explicit assertions (`expect(btn).toBeDisabled()`) instead. Only use snapshots for very small, static components that should strictly never change.

---

### Quick Summary Checklist

- [ ] Am I testing user behavior, not code implementation?
- [ ] Am I using `getByRole` wherever possible?
- [ ] Am I using `userEvent` instead of `fireEvent`?
- [ ] Did I use `findBy` for async elements?
- [ ] Am I mocking the network layer (MSW) rather than the HTTP client?
- [ ] Is my test clearly structured (setup, then action, then assertion)?
