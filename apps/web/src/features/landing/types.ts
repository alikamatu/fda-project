

export interface Action {
  label: string;
  href: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  primaryAction: Action;
  secondaryAction?: Action;
  image: {
    src: string;
    alt: string;
    priority?: boolean;
  };
}

export interface HowItWorksStepData {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface FeatureGroupData {
  title: string;
  icon: string;
  items: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from ElementType to string to allow serialization
}

export interface FeaturesProps {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksProps {
  title: string;
  subtitle: string;
  steps: StepItem[];
  icon: string;
  label: string;
}

export interface TrustItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
}

export interface TrustProps {
  title: string;
  items: TrustItem[];
}

export interface CTAProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}