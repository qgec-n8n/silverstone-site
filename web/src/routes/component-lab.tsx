import { useState } from "react";
import { MenuIcon } from "~/components/icons/lucide";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";
import { Cluster } from "~/components/layout/cluster";
import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import {
  SiteNav,
  SiteNavDisclosure,
  SiteNavItem,
  SiteNavLink,
  SiteNavList,
} from "~/components/layout/site-nav";
import { Stack } from "~/components/layout/stack";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "~/components/ui/modal";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { StatusMessage } from "~/components/ui/status-message";
import { TextLink } from "~/components/ui/text-link";
import { Textarea } from "~/components/ui/textarea";
import { getPublicEnvironment } from "~/lib/environment";
import { buildMetadata } from "~/seo/metadata";

export function meta() {
  const environment = getPublicEnvironment();
  return buildMetadata({
    canonicalOrigin: environment.canonicalOrigin,
    description: "Development-only component verification route.",
    includeRobots: false,
    path: "/__components",
    title: "Component lab | Silverstone staging",
  });
}

export default function ComponentLab() {
  const [emailValue, setEmailValue] = useState("");
  const { motionPreference, reducedMotion } = useReducedMotion();
  const emailInvalid = emailValue.length > 0 && !emailValue.includes("@");

  return (
    <PageSection spacing="default">
      <Container>
        <Stack gap="xl">
          <Stack className="max-w-3xl" gap="lg">
            <span className="ss-eyebrow text-muted-foreground">Component Lab</span>
            <h1 className="text-h1">Silverstone design-system primitives</h1>
            <p className="ss-lead text-muted-foreground">
              Development-only fixtures for tokens, layout, motion preferences,
              accessibility states, and reusable UI primitives.
            </p>
          </Stack>

          <StatusMessage
            description={`Current motion preference: ${motionPreference}. Decorative motion ${
              reducedMotion ? "is reduced." : "remains enabled."
            }`}
            title="Motion preference utility"
            tone="neutral"
          />

          <Card>
            <CardHeader>
              <CardTitle>Navigation primitives</CardTitle>
              <CardDescription>
                Semantic navigation uses links and disclosure buttons rather than menu
                roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                <SiteNav>
                  <SiteNavList>
                    <SiteNavItem>
                      <SiteNavLink current href="/__components">
                        Lab
                      </SiteNavLink>
                    </SiteNavItem>
                    <SiteNavItem>
                      <SiteNavLink href="/">Foundation</SiteNavLink>
                    </SiteNavItem>
                    <SiteNavItem>
                      <SiteNavDisclosure
                        label="Resources"
                        links={[
                          { href: "#forms", label: "Forms" },
                          { href: "#overlays", label: "Overlays" },
                        ]}
                      >
                        Quick links
                      </SiteNavDisclosure>
                    </SiteNavItem>
                  </SiteNavList>
                </SiteNav>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Foundation</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Component lab</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions and links</CardTitle>
              <CardDescription>
                Primary, secondary, accent, ghost, destructive, and text-link
                treatments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Cluster gap="md">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary action</Button>
                <Button variant="accent">Accent action</Button>
                <Button variant="ghost">Ghost action</Button>
                <Button variant="destructive">Destructive action</Button>
                <Button size="icon" variant="outline" aria-label="Open controls">
                  <MenuIcon />
                </Button>
                <TextLink href="#forms">Inline text link</TextLink>
              </Cluster>
            </CardContent>
          </Card>

          <Card id="forms">
            <CardHeader>
              <CardTitle>Fields and semantic states</CardTitle>
              <CardDescription>
                Labels, descriptions, validation feedback, and minimum interactive
                sizes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="lab-email">Email address</FieldLabel>
                  <Input
                    aria-invalid={emailInvalid || undefined}
                    id="lab-email"
                    onChange={(event) => setEmailValue(event.currentTarget.value)}
                    placeholder="you@example.com"
                    value={emailValue}
                  />
                  <FieldDescription>
                    Validation uses adjacent copy and not color alone.
                  </FieldDescription>
                  <FieldError>
                    {emailInvalid ? "Enter a valid email address." : null}
                  </FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="lab-message">Message</FieldLabel>
                  <Textarea
                    id="lab-message"
                    placeholder="Describe the component state you want to review."
                  />
                  <FieldDescription>
                    Textareas use the same focus-visible treatment and semantic borders.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status messages</CardTitle>
              <CardDescription>
                Every status includes text and icon affordances with semantic tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <StatusMessage
                description="Informational guidance for staging-only workflows."
                title="Information"
                tone="info"
              />
              <StatusMessage
                description="Reusable primitives passed their baseline setup checks."
                title="Success"
                tone="success"
              />
              <StatusMessage
                description="Touch targets should stay at least 44 pixels when possible."
                title="Warning"
                tone="warning"
              />
              <StatusMessage
                description="Destructive states require an explicit follow-up action."
                title="Danger"
                tone="danger"
              />
            </CardContent>
          </Card>

          <Card id="overlays">
            <CardHeader>
              <CardTitle>Modal and drawer primitives</CardTitle>
              <CardDescription>
                Dialog and side-panel surfaces use the same token palette and focus
                behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Cluster gap="md">
                <Modal>
                  <ModalTrigger asChild>
                    <Button variant="outline">Open modal</Button>
                  </ModalTrigger>
                  <ModalContent>
                    <ModalHeader>
                      <ModalTitle>Reusable modal primitive</ModalTitle>
                      <ModalDescription>
                        This surface is intended for future Replit-driven modules.
                      </ModalDescription>
                    </ModalHeader>
                    <ModalFooter showCloseButton>
                      <Button variant="accent">Confirm</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="secondary">Open drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent side="right">
                    <DrawerHeader>
                      <DrawerTitle>Reusable drawer primitive</DrawerTitle>
                      <DrawerDescription>
                        Side-panel content keeps semantic headings and close controls.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button variant="accent">Primary action</Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Cluster>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accordion and loading states</CardTitle>
              <CardDescription>
                Reduced motion falls back to fast opacity or instant content changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                <Accordion collapsible type="single">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Motion ownership</AccordionTrigger>
                    <AccordionContent>
                      Framer owns overlays and layout state. CSS owns small interaction
                      transitions. No page-specific animations are implemented here.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex max-w-md flex-col gap-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </PageSection>
  );
}
