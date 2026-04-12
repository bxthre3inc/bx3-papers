// Department Leads — Full Bxthre3 Organization
// All 13 department heads with operational authority

export { ideationLabLead } from './ideation-lead.js';
export { deepResearchLead } from './research-lead.js';
export { buildStudioLead } from './build-lead.js';
export { portfolioOpsLead } from './portfolio-lead.js';
export { commercializationLead } from './commercialization-lead.js';
export { archiveLead } from './archive-lead.js';

export { financeLead } from './finance-lead.js';
export { legalLead } from './legal-lead.js';
export { peopleLead } from './people-lead.js';
export { marketingLead } from './marketing-lead.js';
export { investorRelationsLead } from './ir-lead.js';
export { intelligenceLead } from './intelligence-lead.js';
export { infrastructureLead } from './infrastructure-lead.js';

// Department lead registry for quick access
export const departmentLeads = {
  'Ideation Lab': ideationLabLead,
  'Deep Research': deepResearchLead,
  'Build Studio': buildStudioLead,
  'Portfolio Ops': portfolioOpsLead,
  'Commercialization': commercializationLead,
  'Archive': archiveLead,
  'Finance': financeLead,
  'Legal': legalLead,
  'People': peopleLead,
  'Marketing': marketingLead,
  'Investor Relations': investorRelationsLead,
  'Intelligence': intelligenceLead,
  'Infrastructure': infrastructureLead
};

// R&D Studio leads
export const rdStudioLeads = [
  ideationLabLead,
  deepResearchLead,
  buildStudioLead,
  portfolioOpsLead,
  commercializationLead,
  archiveLead
];

// Corporate function leads  
export const corporateLeads = [
  financeLead,
  legalLead,
  peopleLead,
  marketingLead,
  investorRelationsLead,
  intelligenceLead,
  infrastructureLead
];