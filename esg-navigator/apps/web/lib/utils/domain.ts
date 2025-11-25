/**
 * Domain Utilities
 *
 * Helper functions for multi-domain routing and configuration
 */

export type Division = 'marketing' | 'education' | 'enterprise';

export interface DomainConfig {
  division: Division;
  primaryDomain: string;
  domains: string[];
  defaultPath: string;
  brandName: string;
  brandColor: string;
}

/**
 * Domain configuration for each division
 */
export const DOMAIN_CONFIG: Record<Division, DomainConfig> = {
  marketing: {
    division: 'marketing',
    primaryDomain: 'tis-holdings.com',
    domains: ['tis-holdings.com', 'www.tis-holdings.com', 'localhost'],
    defaultPath: '/',
    brandName: 'TIS Holdings',
    brandColor: 'indigo',
  },
  education: {
    division: 'education',
    primaryDomain: 'esgnavigator.ai',
    domains: [
      'esgnavigator.ai',
      'www.esgnavigator.ai',
      'staging.esgnavigator.ai',
    ],
    defaultPath: '/education/assessments',
    brandName: 'ESG Navigator Education',
    brandColor: 'blue',
  },
  enterprise: {
    division: 'enterprise',
    primaryDomain: 'tis-intellimat.net',
    domains: [
      'tis-intellimat.net',
      'www.tis-intellimat.net',
      'staging.tis-intellimat.net',
    ],
    defaultPath: '/enterprise/dashboard',
    brandName: 'TIS-Intellimat Enterprise',
    brandColor: 'purple',
  },
};

/**
 * Get division from hostname
 */
export function getDivisionFromHostname(hostname: string): Division {
  // Remove port for localhost
  const cleanHostname = hostname.split(':')[0].toLowerCase();

  // Check each division's domains
  for (const [division, config] of Object.entries(DOMAIN_CONFIG)) {
    if (config.domains.some((domain) => cleanHostname.includes(domain))) {
      return division as Division;
    }
  }

  // Default to marketing for unknown domains
  return 'marketing';
}

/**
 * Get domain config for current division
 */
export function getDomainConfig(hostname: string): DomainConfig {
  const division = getDivisionFromHostname(hostname);
  return DOMAIN_CONFIG[division];
}

/**
 * Check if current request is from a specific division
 */
export function isDivision(hostname: string, division: Division): boolean {
  return getDivisionFromHostname(hostname) === division;
}

/**
 * Get absolute URL for a division
 */
export function getDivisionUrl(
  division: Division,
  path: string = '',
  useProduction: boolean = true
): string {
  const config = DOMAIN_CONFIG[division];
  const domain = useProduction
    ? config.primaryDomain
    : config.domains.find((d) => d.includes('staging')) || config.primaryDomain;
  const protocol = useProduction ? 'https' : 'http';

  return `${protocol}://${domain}${path}`;
}

/**
 * Get all configured domains
 */
export function getAllDomains(): string[] {
  return Object.values(DOMAIN_CONFIG).flatMap((config) => config.domains);
}
