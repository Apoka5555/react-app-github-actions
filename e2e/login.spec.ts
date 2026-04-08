import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should redirect to welcome screen when credentials are correct", async ({
    page,
  }) => {
    await page.route("**/auth", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Authenticated" }),
      }),
    );

    await page.goto("/");
    await page.getByLabel("Username").fill("testuser");
    await page.getByLabel("Password").fill("testpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Welcome testuser!")).toBeVisible();
  });

  test("should show error message when credentials are incorrect", async ({
    page,
  }) => {
    await page.route("**/auth", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Bad username or password" }),
      }),
    );

    await page.goto("/");
    await page.getByLabel("Username").fill("baduser");
    await page.getByLabel("Password").fill("badpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Bad username or password")).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Username is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should show only password validation error when username is filled", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Username").fill("testuser");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Username is required")).not.toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should show only username validation error when password is filled", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Password").fill("testpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Username is required")).toBeVisible();
    await expect(page.getByText("Password is required")).not.toBeVisible();
  });

  test("should not show validation errors before form submission", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Username is required")).not.toBeVisible();
    await expect(page.getByText("Password is required")).not.toBeVisible();
  });

  test("should log out and return to login form", async ({ page }) => {
    await page.route("**/auth", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Authenticated" }),
      }),
    );

    await page.goto("/");
    await page.getByLabel("Username").fill("testuser");
    await page.getByLabel("Password").fill("testpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Welcome testuser!")).toBeVisible();

    await page.getByRole("button", { name: "Log Out" }).click();

    await expect(page.getByText("Log In")).toBeVisible();
  });
});
