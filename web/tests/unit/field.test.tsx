import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

describe("Field primitives", () => {
  it("associate labels and expose validation feedback semantically", () => {
    render(
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input aria-invalid id="email" />
          <FieldDescription>Enter your work email.</FieldDescription>
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
      </FieldGroup>,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter your work email.")).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
  });
});
