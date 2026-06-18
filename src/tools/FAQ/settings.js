// tools/FAQ/settings.js
export const mkFaqDesktop = () => ({
  bgColor: "#ffffff",
  borderColor: "#e5e7eb",
  borderWidth: 1,
  borderRadius: 10,
  padding: 20,
  gap: 12,
  maxWidth: 720,
  qColor: "#111827",
  qSize: 16,
  qWeight: "600",
  qAlign: "left",
  qFont: "Inter",
  aColor: "#6b7280",
  aSize: 14,
  aWeight: "400",
  aAlign: "left",
  aFont: "Inter",
  iconColor: "#1a1a18",
  iconSize: 20,
  activeBg: "#faf9f7",
  activeQColor: "#1a1a18",
  dividerColor: "#e5e7eb",
});

export const mkFaqTablet = () => ({
  ...mkFaqDesktop(),
  qSize: 15,
  aSize: 13,
  padding: 16,
  maxWidth: 560,
});
export const mkFaqMobile = () => ({
  ...mkFaqDesktop(),
  qSize: 14,
  aSize: 13,
  padding: 14,
  gap: 8,
  maxWidth: 360,
});

export const DEFAULT_FAQS = [
  {
    id: 1,
    q: "What is your refund policy?",
    a: "We offer a 30-day money-back guarantee. Contact support and we'll process within 3–5 business days.",
  },
  {
    id: 2,
    q: "How do I cancel my subscription?",
    a: "Cancel anytime from your account dashboard under Settings > Billing. Access continues until period ends.",
  },
  {
    id: 3,
    q: "Do you offer customer support?",
    a: "Yes! 24/7 live chat for all paid plans. Free plan users get help centre and community forums.",
  },
  {
    id: 4,
    q: "Is my data secure?",
    a: "We use AES-256 encryption and TLS 1.3. We are SOC 2 Type II certified.",
  },
  {
    id: 5,
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, anytime. Upgrades are immediate and prorated. Downgrades take effect next billing cycle.",
  },
];
