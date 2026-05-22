"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  CeremonyOrnament,
  type OrnamentName,
} from "@/components/illustrations/ceremony-ornaments";
import { cn } from "@/lib/utils";
import { getSiteSettings, getWhatsAppHref } from "@/lib/cms/site-settings";

type Channel = {
  label: string;
  title: string;
  body: string;
  action: string;
  href: string;
  ornament: OrnamentName;
};

/**
 * ContactChannels — quick-channel grid: WhatsApp / Phone / Email / Studio visit.
 * Brass-cornered tiles with a ceremony ornament accent and a single action link.
 */
export function ContactChannels(): React.ReactElement {
  const settings = getSiteSettings();
  const CHANNELS: ReadonlyArray<Channel> = [
    {
      label: "WhatsApp",
      title: "Chat now",
      body: "Send a voice note, photo or just say hi. Fastest route.",
      action: "Open WhatsApp →",
      href: getWhatsAppHref(),
      ornament: "jasmine",
    },
    {
      label: "Phone",
      title: "Call the studio",
      body: "Talk to the lead designer between 11–7, Monday to Saturday.",
      action: settings.phoneDisplay,
      href: `tel:${settings.phoneTel}`,
      ornament: "marigold",
    },
    {
      label: "Email",
      title: "Write a brief",
      body: "Good for long briefs, attachments, or sharing your inspiration deck.",
      action: settings.email,
      href: `mailto:${settings.email}`,
      ornament: "chandelier",
    },
    {
      label: "Studio visit",
      title: "Come over",
      body: "See fabrics, samples and past moodboards in person.",
      action: "Book a slot →",
      href: "#inquiry",
      ornament: "mandap",
    },
  ];
  return (
    <Section tone="default" spacing="lg" id="channels">
      <Container>
        <div className="flex flex-col gap-[var(--space-12)]">
          {/* Header */}
          <div className="flex flex-col gap-[var(--space-3)] md:max-w-[58ch]">
            <span className="inline-flex items-center gap-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[color:var(--color-gold)]"
              />
              Faster channels
            </span>
            <h2
              className="font-display italic font-light text-[color:var(--color-ink)]"
              style={{
                fontSize: "clamp(28px, 3.4vw + 14px, 48px)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-display-tight)",
              }}
            >
              Or skip the form — reach us directly.
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2 md:grid-cols-4">
            {CHANNELS.map((c) => (
              <ChannelCard key={c.label} channel={c} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ChannelCard({ channel }: { channel: Channel }): React.ReactElement {
  return (
    <a
      href={channel.href}
      target={channel.href.startsWith("http") ? "_blank" : undefined}
      rel={channel.href.startsWith("http") ? "noreferrer noopener" : undefined}
      className={cn(
        "group relative flex flex-col gap-[var(--space-5)]",
        "bg-[color:var(--color-bg-elevated)] p-[var(--space-7)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(58,26,36,0.18)]",
        "focus-visible:outline-none focus-visible:-translate-y-1",
      )}
    >
      <BrassCorners />

      {/* Ornament */}
      <div
        aria-hidden="true"
        className="h-14 w-14 opacity-90 transition-transform duration-500 ease-out group-hover:rotate-[6deg]"
      >
        <CeremonyOrnament
          name={channel.ornament}
          hue="var(--color-gold)"
          hueSecondary="var(--color-gold-deep)"
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col gap-[var(--space-3)]">
        <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold-deep)]">
          {channel.label}
        </span>
        <h3
          className="font-display italic text-[color:var(--color-ink)]"
          style={{
            fontWeight: 400,
            fontSize: "clamp(20px, 1.6vw + 14px, 28px)",
            lineHeight: 1.15,
          }}
        >
          {channel.title}
        </h3>
        <p className="text-[length:var(--text-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
          {channel.body}
        </p>
      </div>

      <span
        className={cn(
          "mt-auto flex items-center gap-[var(--space-2)] pt-[var(--space-3)]",
          "text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
          "text-[color:var(--color-ink)]",
          "border-t border-[color:var(--color-border)]",
          "transition-colors duration-200 group-hover:text-[color:var(--color-gold-deep)]",
        )}
      >
        {channel.action}
      </span>
    </a>
  );
}

function BrassCorners(): React.ReactElement {
  const cornerClass =
    "absolute h-px w-6 bg-[color:var(--color-gold)]/70 transition-[width,background-color] duration-300 ease-out group-hover:w-10 group-hover:bg-[color:var(--color-gold)]";
  const cornerClassV =
    "absolute h-6 w-px bg-[color:var(--color-gold)]/70 transition-[height,background-color] duration-300 ease-out group-hover:h-10 group-hover:bg-[color:var(--color-gold)]";
  return (
    <>
      <span aria-hidden="true" className={cn(cornerClass, "left-2 top-2")} />
      <span aria-hidden="true" className={cn(cornerClassV, "left-2 top-2")} />
      <span aria-hidden="true" className={cn(cornerClass, "bottom-2 right-2")} />
      <span aria-hidden="true" className={cn(cornerClassV, "bottom-2 right-2")} />
    </>
  );
}
