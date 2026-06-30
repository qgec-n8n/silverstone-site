import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  FAQList,
  FormFeedback,
  IntegrationPresentation,
  PageHeroShell,
  ServiceCard,
} from "~/components/premium";
import { Globe } from "~/components/icons/lucide";
import { MotionProvider } from "~/motion";

function renderPremium(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <MotionProvider>{ui}</MotionProvider>
    </MemoryRouter>,
  );
}

describe("premium system components", () => {
  it("renders the page hero shell with semantic heading and CTAs", () => {
    renderPremium(
      <PageHeroShell
        actions={[
          { href: "/book", label: "Book a discovery call" },
          { href: "/services", label: "Explore services", tone: "secondary" },
        ]}
        description="A precise operating layer for AI automation, software and content systems."
        eyebrow="Silverstone AI"
        title="Engineered commercial systems"
      />,
    );

    expect(
      screen.getByRole("heading", { name: /engineered commercial systems/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /book a discovery call/i }),
    ).toHaveAttribute("href", "/book");
    expect(screen.getByRole("link", { name: /explore services/i })).toHaveAttribute(
      "href",
      "/services",
    );
  });

  it("renders service cards as accessible links", () => {
    renderPremium(
      <ServiceCard
        description="Conversion-first websites with governed content and motion."
        href="/services/web-design-development"
        icon={Globe}
        title="Web design and development"
      />,
    );

    expect(
      screen.getByRole("link", { name: /web design and development/i }),
    ).toHaveAttribute("href", "/services/web-design-development");
  });

  it("uses aria-expanded and regions for FAQ disclosure", async () => {
    const user = userEvent.setup();

    renderPremium(
      <FAQList
        items={[
          {
            answer: "We map the route, constraints and integration contract first.",
            question: "How does a project start?",
          },
          {
            answer: "With staging-safe mocks until production testing is approved.",
            question: "How are integrations tested?",
          },
        ]}
      />,
    );

    const firstQuestion = screen.getByRole("button", {
      name: /how does a project start/i,
    });
    const secondQuestion = screen.getByRole("button", {
      name: /how are integrations tested/i,
    });

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    await user.click(secondQuestion);

    expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("region", { name: /how are integrations tested/i }),
    ).toBeInTheDocument();
  });

  it("renders integration marks as compatibility presentation, not proof claims", () => {
    renderPremium(
      <IntegrationPresentation
        integrations={[
          { category: "CRM", name: "HubSpot" },
          { category: "Scheduling", name: "Calendly" },
        ]}
      />,
    );

    expect(screen.getByText(/work with your existing tools/i)).toBeInTheDocument();
    expect(screen.getByText("HubSpot")).toBeInTheDocument();
    expect(screen.getByText("Calendly")).toBeInTheDocument();
  });

  it("announces form feedback with the correct live-region semantics", () => {
    renderPremium(
      <FormFeedback
        description="Check the email address and try again."
        title="Message could not be sent"
        tone="danger"
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/check the email address/i);
    expect(alert.closest("[aria-live]")).toHaveAttribute("aria-live", "assertive");
  });
});
