import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, description }) => {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-card-inner">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <span className="stat-value">{value}</span>
          {description && <span className="stat-desc">{description}</span>}
        </div>
        <div className="stat-icon-container">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
