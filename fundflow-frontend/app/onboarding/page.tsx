// import ConnectWalletOnboarding from "@/components/Wallet/ConnectWalletOnboarding";

// export default function OnboardingPage() {
//   return <ConnectWalletOnboarding />;
// }

import ConnectWalletOnboarding from "@/components/Wallet/ConnectWalletOnboarding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Setup - FundFlow",
  description: "Complete your FundFlow account setup to start your fundraising or investment journey",
};

export default function OnboardingPage() {
  return (
    <main className="relative">
      <ConnectWalletOnboarding />
    </main>
  );
}