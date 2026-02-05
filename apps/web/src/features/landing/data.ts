import { HeroProps, FeaturesProps, HowItWorksProps, TrustProps, CTAProps, HowItWorksStepData, FeatureGroupData, TrustItem } from './types';

export const HERO_DATA: HeroProps = {
  title: "Verify Product Authenticity Instantly",
  subtitle: "Scan a QR code or enter a serial number to confirm FDA approval, expiry status, and product legitimacy in real time.",
  image: {
    src: "/36121.jpg", 
    alt: "FDA Pharmaceutical Verification Interface",
    priority: true
  },
  primaryAction: {
    label: "Verify a Product",
    href: "/verify"
  },
  secondaryAction: {
    label: "Register as Manufacturer",
    href: "/register"
  }
};

export const HOW_IT_WORKS_STEPS: HowItWorksStepData[] = [
  {
    stepNumber: 1,
    title: "Scan or Enter Code",
    description: "Scan the QR code on the product or manually enter the serial number using the app.",
    icon: "QrCodeIcon",
  },
  {
    stepNumber: 2,
    title: "System Verification",
    description: "The system checks the product against the FDA database for approval, batch, and expiry status.",
    icon: "ShieldCheckIcon",
  },
  {
    stepNumber: 3,
    title: "Instant Result",
    description: "Instantly see whether the product is genuine, expired, or potentially counterfeit.",
    icon: "CheckCircleIcon",
  },
];


export const HOW_IT_WORKS_DATA: HowItWorksProps = {
  title: "How It Works",
  subtitle: "Three simple steps to ensure the safety of your medication.",
  icon: "CheckCircleIcon",
  label: "Process",
  steps: HOW_IT_WORKS_STEPS
};

export const FEATURES_DATA: FeaturesProps = {
  title: "Key Features",
  subtitle: "Designed for consumers, manufacturers, and regulators.",
  items: [
    {
      id: "consumer-safety",
      title: "Consumer Safety",
      description: "Instantly detect counterfeit medicines before consumption.",
      icon: "ShieldCheckIcon"
    },
    {
      id: "traceability",
      title: "End-to-End Traceability",
      description: "Track products from manufacturing facility to the pharmacy shelf.",
      icon: "QrCodeIcon"
    },
    {
      id: "regulatory",
      title: "Regulatory Compliance",
      description: "Automated reporting and compliance checks for manufacturers.",
      icon: "DocumentCheckIcon"
    }
  ]
};

export const FEATURE_GROUPS: FeatureGroupData[] = [
  {
    title: "For Consumers",
    icon: "UserIcon",
    items: [
      "Instant product verification using QR code or serial number",
      "Clear verification result (Genuine, Expired, Fake)",
      "Improved confidence in product safety"
    ]
  },
  {
    title: "For Manufacturers",
    icon: "BuildingOfficeIcon",
    items: [
      "Secure product registration and batch management",
      "QR code and serial number generation",
      "Product traceability across the supply chain"
    ]
  },
  {
    title: "For Regulators",
    icon: "ShieldExclamationIcon",
    items: [
      "Centralized monitoring dashboard",
      "Real-time verification activity tracking",
      "Detection of suspicious or counterfeit patterns"
    ]
  }
];

export const TRUST_DATA: TrustProps = {
  title: "Trusted by the Nation",
  items: [
    {
      id: "fda-aligned",
      title: "FDA Aligned",
      description: "Built in strict accordance with Food and Drug Administration guidelines.",
      icon: "DocumentCheckIcon"
    },
    {
      id: "secure",
      title: "Bank-Grade Security",
      description: "Encrypted data transmission and storage to protect sensitive health information.",
      icon: "LockClosedIcon"
    },
    {
      id: "real-time",
      title: "Real-Time Data",
      description: "Up-to-the-second verification status for millions of products.",
      icon: "ShieldCheckIcon"
    }
  ]
};

export const TRUST_ITEMS: TrustItem[] = [
  {
    title: "Secure Data Handling",
    description: "All product and verification data is securely stored and protected using industry-standard security practices to prevent unauthorized access or tampering.",
    icon: "LockClosedIcon",
  },
  {
    title: "Regulatory Alignment",
    description: "The system is designed to support FDA workflows and regulatory processes by providing accurate, up-to-date product verification information.",
    icon: "DocumentCheckIcon",
  },
  {
    title: "Full Traceability",
    description: "Every verification request is logged, enabling transparent auditing, monitoring, and detection of suspicious or counterfeit activity.",
    icon: "ShieldCheckIcon",
  }
];

export const CTA_DATA: CTAProps = {
  title: "Verify Before You Trust",
  description: "Confirm product authenticity in seconds and protect yourself from counterfeit or expired products.",
  primaryAction: {
    label: "Verify a Product",
    href: "/verify"
  },
  secondaryAction: {
    label: "Register as Manufacturer",
    href: "/register"
  }
};