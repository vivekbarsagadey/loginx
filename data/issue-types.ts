/**
 * Issue reporting data and configuration
 */

import i18n from '@/i18n';
import type { IssueOption } from '@/types/issue';

/**
 * Get all available issue types for reporting
 */
export function getIssueTypes(): IssueOption[] {
  return [
    {
      id: 'crash',
      icon: 'x-circle',
      label: i18n.t('screens.reportIssue.issueTypes.crash.label'),
      description: i18n.t('screens.reportIssue.issueTypes.crash.description'),
    },
    {
      id: 'performance',
      icon: 'zap-off',
      label: i18n.t('screens.reportIssue.issueTypes.performance.label'),
      description: i18n.t('screens.reportIssue.issueTypes.performance.description'),
    },
    {
      id: 'ui-bug',
      icon: 'layout',
      label: i18n.t('screens.reportIssue.issueTypes.uiBug.label'),
      description: i18n.t('screens.reportIssue.issueTypes.uiBug.description'),
    },
    {
      id: 'functionality',
      icon: 'tool',
      label: i18n.t('screens.reportIssue.issueTypes.functionality.label'),
      description: i18n.t('screens.reportIssue.issueTypes.functionality.description'),
    },
    {
      id: 'security',
      icon: 'shield-off',
      label: i18n.t('screens.reportIssue.issueTypes.security.label'),
      description: i18n.t('screens.reportIssue.issueTypes.security.description'),
    },
    {
      id: 'other',
      icon: 'help-circle',
      label: i18n.t('screens.reportIssue.issueTypes.other.label'),
      description: i18n.t('screens.reportIssue.issueTypes.other.description'),
    },
  ];
}
