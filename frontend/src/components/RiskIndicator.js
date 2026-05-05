import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

const RiskIndicator = ({ complexity, integration }) => {
  const getRiskLevel = () => {
    let score = 0;
    if (complexity === 'high') score += 2;
    else if (complexity === 'medium') score += 1;

    if (integration === 'high') score += 2;
    else if (integration === 'medium') score += 1;

    if (score >= 3) return { level: 'HIGH', color: 'danger', icon: <ShieldAlert size={20} /> };
    if (score === 2) return { level: 'MEDIUM', color: 'warning', icon: <Shield size={20} /> };
    return { level: 'LOW', color: 'success', icon: <ShieldCheck size={20} /> };
  };

  const risk = getRiskLevel();

  return (
    <div className={`risk-indicator badge-${risk.color}`}>
      {risk.icon}
      <span>Risk Level: <strong>{risk.level}</strong></span>
    </div>
  );
};

export default RiskIndicator;
