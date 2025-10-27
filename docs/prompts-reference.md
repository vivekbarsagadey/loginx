# WhizFlow CMS - Important Prompts Reference

**Version**: 1.0  
**Last Updated**: October 28, 2025  
**Purpose**: Comprehensive collection of effective prompts for AI-assisted development in WhizFlow CMS

---

## Table of Contents

### Project Lifecycle Phases

**A. [Initiation Phase](#a-initiation-phase)** - Project Discovery & Requirements
- Requirements Analysis & Business Research
- Opportunity Assessment & Gap Analysis
- Technical Debt Analysis

**B. [Planning Phase](#b-planning-phase)** - Design & Planning
- Architecture & Design Documents
- Database Schema Design
- Implementation Plan Creation
- Plan Review & Updates

**C. [Execution Phase](#c-execution-phase)** - Development & Implementation
- Feature Development & CRUD Operations
- Plan Implementation (Autonomous & Manual)
- Refactoring & Code Optimization
- Advanced Features (WebSockets, i18n, Feature Flags)

**D. [Monitoring & Controlling Phase](#d-monitoring--controlling-phase)** - Quality & Performance
- Code Review & Analysis
- Testing & Quality Assurance
- Debugging & Troubleshooting
- Performance Optimization
- Security Audits & Compliance

**E. [Closure Phase](#e-closure-phase)** - Documentation & Handover
- Technical Documentation
- API Documentation
- User Guides & Training Materials
- Architecture Decision Records (ADRs)

### Cross-Phase Elements

**[Governance & Risk Management](#cross-phase-governance--risk-management)**
- Status Updates & Progress Tracking
- Emergency Issue Resolution
- Change Management

**[GitHub Prompts Integration](#github-prompts-integration)**
- 20 Essential Pre-configured Prompts
- Quick Reference Tables by Tier
- Authority Levels & Usage Guidelines

### Quick References

- [⭐ Most Used Prompts](#-most-used-prompts-quick-access)
- [Quick Decision Tree](#quick-decision-tree)
- [Authority Level Summary](#authority-level-summary)
- [Recommended Workflows](#recommended-workflows)

---

## ⭐ Most Used Prompts (Quick Access)

> **Quick Reference Table** - Top 4 prompts for immediate use

| Prompt | Use Case | Phase | Example |
|--------|----------|-------|---------|
| **Complete Plan** | Implement entire plan with auto-updates | Execution | `implement plan/[file]` |
| **Review Plan** | Update plan with new infrastructure | Planning | `review plan/[file]` |
| **Status Update** | Verify and update task completion | Monitoring | `review plan/[file] and update status` |
| **Fix All Issues** | Comprehensive issue detection & fixing | Monitoring | `fix all possible issues` |

---

# Project Lifecycle Phases

---

## A. Initiation Phase

**Purpose**: Discover opportunities, gather requirements, analyze gaps, and assess technical debt.

### 📊 Business Requirements Analysis

**GitHub Prompt**: `@ba` (Business Analyst)  
**Authority**: ❌ No Code - Analysis Only

**Use Case**: Gather requirements through comprehensive research including web-based market analysis, competitor research, and industry best practices.

**Prompt**:
```
Analyze business requirements for [feature/module]:

Research & Analysis:
1. Conduct web research for industry best practices
2. Analyze competitor solutions and market trends
3. Review regulatory requirements and compliance standards
4. Gather stakeholder requirements
5. Create Business Requirements Summary Document (BRSD)
6. Document process flows and workflows
7. Perform gap analysis (internal and external)

Provide:
- Comprehensive BRSD with market intelligence
- Process flow diagrams
- Gap analysis report
- Stakeholder requirements matrix
- Regulatory compliance checklist
```

**Examples**:
```bash
@ba analyze business requirements for email automation workflows

@ba research industry best practices for department hierarchy management

Analyze business requirements for customer relationship management module with focus on sales pipeline automation
```

---

### 🔍 Technical Debt & Gap Analysis

**GitHub Prompt**: `@todo-manager` (Technical Debt Analyst)  
**Authority**: ❌ No Code - Analysis Only

**Use Case**: Identify incomplete implementations, TODO comments, and technical debt before starting new work.

**Prompt**:
```
Analyze technical debt and incomplete work in [module/codebase]:

Analysis Areas:
1. TODO comment discovery across all files
2. Incomplete implementation detection
3. Missing features identification
4. Technical debt assessment
5. Deprecated dependencies
6. Code quality issues

Provide:
- Comprehensive TODO inventory
- Prioritized action plans (Critical/High/Medium/Low)
- Resource estimation for cleanup
- Dependencies mapping
- Timeline recommendations
```

**Examples**:
```bash
@todo-manager scan codebase for TODO comments and incomplete implementations

@todo-manager analyze technical debt in department module before starting refactor

Analyze technical debt and incomplete work in app/core/ and actions/core/
```

---

### 🔎 Code Quality & Security Assessment

**GitHub Prompt**: `@code-auditor` (Quality Auditor)  
**Authority**: ❌ No Code - Analysis Only

**Use Case**: Proactive bug discovery and quality assessment before planning new features.

**Prompt**:
```
Perform comprehensive code audit of [module/feature]:

Audit Checklist:
1. Syntax and logical errors
2. TypeScript type safety issues
3. Security vulnerabilities (XSS, injection, authentication)
4. Performance bottlenecks
5. Code quality and standards compliance
6. Edge cases and error handling
7. Multi-tenant data isolation

Provide:
- Structured bug report in docs/bugs/BUGS.md
- Severity ratings (Critical/High/Medium/Low)
- Affected files with line numbers
- Recommendations for fixes
```

**Examples**:
```bash
@code-auditor audit email module for potential bugs and code quality issues

@code-auditor scan department module for TypeScript errors and logical flaws before refactor

Perform comprehensive code audit of actions/crm/ for security and performance issues
```

---

## B. Planning Phase

**Purpose**: Design architecture, create implementation plans, and prepare for execution.

### 🏗️ Architecture & Design Documents

**GitHub Prompt**: `@architect` (System Architect)  
**Authority**: ❌ No Code - Design Only (CRITICAL)

**Use Case**: Create technical specifications and architecture diagrams WITHOUT writing code.

**Prompt**:
```
Design architecture for [feature/module]:

Requirements:
- [List functional requirements]
- [List non-functional requirements]

Deliverables:
1. Technical design document
2. Architecture diagrams (system, component, data flow)
3. Component hierarchy and relationships
4. Integration points with existing modules
5. Security considerations
6. Performance considerations
7. Scalability strategy
8. Technology stack recommendations

Note: NO CODE IMPLEMENTATION - Design documents only
```

**Examples**:
```bash
@architect design architecture for email threading and conversation grouping

@architect create technical specification for department hierarchy system

Design architecture for real-time notification system with WebSocket support
```

---

### 🗄️ Database Schema Design

**GitHub Prompt**: `@data-architect` (Database Architect)  
**Authority**: ✅ Database & Migration Code

**Use Case**: Design Prisma schemas, migrations, and query optimization strategies.

**Prompt**:
```
Design Prisma schema for [entity/feature]:

Requirements:
- [List data requirements]
- [List relationships]

Deliverables:
1. Prisma model definitions in prisma/schema/[module].prisma
2. Relationships (1:1, 1:N, N:M) with proper foreign keys
3. Indexes for query performance
4. Multi-tenant isolation (tenantId, organizationId)
5. Soft delete support (deletedAt, deletedBy)
6. Audit fields (createdAt, updatedAt, createdBy, updatedBy)
7. Migration script
8. Seed data for testing

Follow existing schema patterns (core.prisma, crm.prisma).
```

**Examples**:
```bash
@data-architect design schema for email threading with conversation relationships

@data-architect optimize department queries for hierarchical data

Design Prisma schema for customer relationship management with opportunity tracking
```

---

### 📋 Implementation Plan Creation

**GitHub Prompt**: `@implementation-plan` (Plan Generator)  
**Authority**: ❌ No Code - Planning Only

**Use Case**: Transform requirements and architecture into detailed, executable implementation plans.

**Prompt**:
```
Create implementation plan for [feature/module]:

Input:
- Business requirements from BA analysis
- Architecture design from architect
- Database schema from data architect

Plan Structure:
1. Executive Summary
2. Phases with clear goals
3. Tasks with detailed descriptions
4. Acceptance criteria for each task
5. Dependencies and prerequisites
6. Resource requirements
7. Risk assessment
8. Success metrics
9. Timeline estimates

Research:
- Analyze existing codebase for reusable components
- Research industry best practices
- Identify gaps and mitigation strategies
```

**Examples**:
```bash
@implementation-plan create plan for implementing email threading and conversation grouping

@implementation-plan design plan for department hierarchy management

Create implementation plan for CRM sales pipeline automation based on requirements document
```

---

### 🔄 Plan Review & Optimization

**GitHub Prompt**: `@plan-review-and-update` (Plan Reviewer)  
**Authority**: ❌ No Code - Analysis Only

**Use Case**: Review existing plans and update based on new infrastructure, components, or changed requirements.

**Prompt**:
```
Review and update [plan-file-path]:

Review Checklist:
1. Is the plan still relevant?
2. Are there new WhizFlow components/hooks that can be used?
3. Are tasks clearly defined with acceptance criteria?
4. Are there missing tasks or features?
5. Is the priority correct?
6. Are there better approaches available now?
7. Status assessment (marked vs actually implemented)

Tools to Use:
- semantic_search for finding new components
- file_search for infrastructure updates
- Next.js MCP for latest patterns
- Context7 for library documentation

Provide:
- Updated plan with new infrastructure references
- Removed obsolete tasks
- Added missing tasks
- Updated implementation approaches
```

**Examples**:
```bash
@plan-review-and-update review plan/in-progress/refactor-email-module-1.md

@plan-review-and-update update plan/in-progress/department-refactor-1.md with new components

Review and update plan/in-progress/crm-pipeline-1.md based on new React Server Components
```

---

## C. Execution Phase

**Purpose**: Implement features, execute plans, and deliver working code.

### 🚀 Autonomous Plan Execution

**GitHub Prompt**: `@plan-implementor` (Plan Executor)  
**Authority**: ✅ Full Code Implementation (Zero-Confirmation)

**Use Case**: Execute entire implementation plans automatically with status updates and quality checks.

**Prompt**:
```
Implement plan/in-progress/[plan-file-name].md

Requirements:
1. Complete ALL Phases, Goals, and Tasks systematically
2. Update plan status after each task completion
3. Run tests and compilation checks after each task
4. Verify zero TypeScript errors and linting issues
5. Move plan to completed/ folder when finished

Execution Process:
- Phase by phase completion
- Task-by-task verification
- Real-time status updates
- Final quality check before marking complete

Note: This prompt has FULL IMPLEMENTATION AUTHORITY and will execute WITHOUT confirmation.
```

**Examples**:
```bash
@plan-implementor implement plan/in-progress/refactor-email-module-1.md

@plan-implementor implement plan/in-progress/department-refactor-1.md

# With GitHub Coding Agent (creates PR)
@plan-implementor implement plan/in-progress/crm-pipeline-1.md
#github-pull-request_copilot-coding-agent
```

---

### 👨‍💻 Feature Development & Implementation

**GitHub Prompt**: `@developer` (Full-Stack Developer)  
**Authority**: ✅ Full Code Implementation

**Use Case**: Implement specific features, components, and full-stack functionality.

**Prompt**:
```
Implement [feature-name] with the following requirements:

Requirements:
- [List functional requirements]

Structure:
1. Database schema in prisma/schema/[module].prisma (if needed)
2. Server actions in actions/[module]/[feature].action.ts
3. Pages in app/[module]/[feature]/ with proper routing
4. Components in app/[module]/[feature]/_components/
5. Types in types/[module]/[feature].ts
6. Validation in validations/[module]/[feature].ts
7. Zustand store in stores/[module]/ (UI state only)

Use:
- Existing form components from components/forms/
- Custom hooks from hooks/
- React Query for server state
- Server Components and Server Actions

Include comprehensive tests and JSDoc documentation.
```

**Examples**:
```bash
@developer implement email threading feature with conversation view

@developer create department CRUD with multi-view support (table, tree, kanban)

Implement customer opportunity management with sales pipeline visualization
```

---

### 🔧 Refactoring & Code Optimization

**Use Case**: Improve existing code quality, performance, and maintainability.

#### Convert to Server Components

**Prompt**:
```
Convert [component-path] from Client Component to Server Component:

Process:
1. Move data fetching to Server Component
2. Extract interactive elements to separate client components
3. Add proper Suspense boundaries with loading skeletons
4. Create error.tsx with error boundary
5. Generate metadata for SEO
6. Ensure proper streaming and progressive rendering

Keep only necessary interactivity in client components.
Follow Next.js 15 App Router patterns.
```

#### Optimize Large Component

**Prompt**:
```
Optimize [component-path] for performance:

Optimization Steps:
1. Split into smaller, focused components
2. Add React.memo where appropriate
3. Use useMemo/useCallback for expensive operations
4. Implement code splitting with dynamic imports
5. Replace props drilling with Context or composition
6. Add virtual scrolling if rendering large lists
7. Measure before/after with React DevTools Profiler

Target: Reduce render time by 50%+ and bundle size by 30%+
```

#### Refactor to Standard Pattern

**Prompt**:
```
Refactor actions/[module]/[file].action.ts to standard pattern:

Follow department.action.ts pattern:
- [ ] Import utilities from @/lib/actions
- [ ] Define [Entity]Filters extending TenantBaseFilters
- [ ] Create includeRelationships() function
- [ ] Implement buildFilters() using filter helpers
- [ ] Export typed CRUD operations (fetch*, create*, update*, remove*)
- [ ] Add analytics operations (statistics, trends)
- [ ] Wrap with withErrorHandling
- [ ] Zero `any` types
- [ ] Add revalidation tags

Maintain backward compatibility.
```

**Examples**:
```bash
@developer convert app/email/[id]/page.tsx to Server Component

@developer optimize app/core/departments/_view/table-view.tsx for 1000+ rows

Refactor actions/crm/opportunity.action.ts to follow standardized pattern
```

---

### 🎨 Advanced Features Implementation

#### Real-Time Features (WebSockets)

**Prompt**:
```
Implement real-time [feature] using WebSockets:

Implementation:
1. Extend existing WebSocket infrastructure (hooks/use-websocket.ts)
2. Create endpoint in app/api/ws/[feature]/route.ts
3. Implement event broadcasting
4. Handle connection lifecycle (connect, disconnect, reconnect)
5. Add authentication/authorization for connections
6. Implement client hook: use[Feature]WebSocket
7. Handle offline/online transitions
8. Add rate limiting
9. Write integration tests

Ensure graceful degradation when WebSockets unavailable.
```

#### Internationalization (i18n)

**GitHub Prompt**: `@i18n-specialist` (i18n Specialist)  
**Authority**: ✅ i18n & Localization Code

**Prompt**:
```
Add internationalization support to [module/component]:

Implementation:
1. Extract hardcoded strings to i18n/locales/[lang]/[module].json
2. Use next-intl patterns from existing setup
3. Support RTL languages (Arabic, Hebrew)
4. Format dates/numbers/currency based on locale
5. Add language switcher UI
6. Create translation management workflow
7. Test with multiple languages

Support: English (en), Spanish (es), French (fr), German (de)
```

#### Feature Flags

**Prompt**:
```
Implement feature flags for [feature]:

Implementation:
1. Add flags to lib/feature-flags.ts
2. Create flag definitions with defaults
3. Implement flag checks in components/actions
4. Add flag override UI in admin panel
5. Support user-based and organization-based flags
6. Add A/B testing capability
7. Implement flag analytics
8. Create migration plan (flag → permanent code)

Flags needed:
- enable[Feature]: boolean
- [feature]Variant: 'a' | 'b' (if A/B testing)
```

**Examples**:
```bash
@developer implement real-time email notifications using WebSockets

@i18n-specialist add Arabic language support with RTL layout to dashboard

Implement feature flags for new CRM pipeline visualization with A/B testing
```

---

## D. Monitoring & Controlling Phase

**Purpose**: Ensure quality, track progress, debug issues, and maintain security.

### 📊 Status Updates & Progress Tracking

**Use Case**: Verify task completion and update implementation status.

**Prompt**:
```
Review [plan-file-path] and update implementation status:

Process:
1. Read the plan file thoroughly
2. Check each task against actual implementation
3. Verify completion criteria for marked tasks
4. Identify tasks incorrectly marked as complete
5. Identify completed tasks not marked
6. Update the plan with accurate status
7. Add notes about partial completions
8. Update progress percentages

Be thorough - verify actual code, not just file existence.
Provide progress summary and blocking issues.
```

**Examples**:
```bash
Review plan/in-progress/refactor-departments-1.md and update status

Check implementation progress for plan/in-progress/crm-pipeline-1.md

Review all email module tasks and update plan/in-progress/refactor-email-1.md
```

---

### 🔍 Code Review & Analysis

**Use Case**: Comprehensive code review for quality, security, and performance.

**Prompt**:
```
Review [file-or-directory] for:

Review Checklist:
1. Adherence to WhizFlow patterns (.github/copilot-instructions.md)
2. TypeScript type safety (zero `any` types)
3. Security vulnerabilities (XSS, injection, authentication)
4. Performance issues (N+1 queries, large bundles)
5. Accessibility compliance (WCAG 2.1 AA)
6. Testing coverage gaps
7. Error handling completeness
8. Multi-tenant data isolation

Provide:
- Specific issues with line numbers
- Code examples for fixes
- Priority ratings (Critical/High/Medium/Low)
```

**Examples**:
```bash
Review app/core/departments/ for code quality and security

Review actions/crm/opportunity.action.ts for performance and type safety

Comprehensive review of email module before production release
```

---

### 🐛 Debugging & Issue Resolution

**GitHub Prompt**: `@problem-solver` (Debugging Specialist)  
**Authority**: ✅ Diagnostic & Fix Code

**Use Case**: Systematic debugging with focus on UI/UX issues and regression prevention.

**Prompt**:
```
Debug the following issue in [component/feature]:

Issue Description: [Describe the problem]

Investigation Process:
1. Reproduce the issue
2. Analyze root cause
3. Check for related issues
4. Verify no existing functionality breaks (CRITICAL)
5. Implement fix
6. Test thoroughly
7. Add regression tests

Focus Areas:
- UI/UX issues (layout, responsive design, components)
- Runtime errors and bugs
- Performance problems
- User experience degradation

Provide:
- Root cause analysis
- Step-by-step fix implementation
- Prevention strategies
```

**Examples**:
```bash
@problem-solver the email list is not rendering on mobile devices

@problem-solver department form validation is not working correctly

Debug runtime error: "Cannot read property 'name' of undefined" in opportunity details page
```

---

### 🔧 Systematic Bug Fixing

**GitHub Prompt**: `@bug-fix` (Bug Fix Engineer)  
**Authority**: ✅ Bug Fix Code Implementation

**Use Case**: Targeted fixes for identified bugs with comprehensive testing.

**Prompt**:
```
Fix the following bug: [Bug description]

Fix Process:
1. Analyze root cause through code investigation
2. Write production-ready fix
3. Refactor code if necessary for bug resolution
4. Implement error handling and recovery
5. Apply security patches if vulnerability
6. Create comprehensive test cases
7. Verify no regression

Provide:
- Code fix with explanation
- Test cases for validation
- Prevention recommendations
```

**Examples**:
```bash
@bug-fix resolve email attachment upload failing for files > 10MB

@bug-fix fix XSS vulnerability in email detail view

Fix bug: Department hierarchy not displaying correctly for deeply nested structures
```

---

### 🚨 Emergency Comprehensive Fixes

**GitHub Prompt**: `@fix-my-project` (Emergency Fixer)  
**Authority**: ✅ Comprehensive Fix Authority

**Use Case**: Emergency situation with multiple issues - comprehensive scan and fix.

**Prompt**:
```
Fix all possible issues in [project/module]:

Comprehensive Fix Process:
1. TypeScript Errors (pnpm tsc --noEmit)
2. Linting Issues (pnpm quality-check)
3. Compilation Errors (pnpm build)
4. Logical Issues (code review)
5. Test Failures (pnpm test)
6. Security Issues (pnpm audit)
7. Performance Issues (profiling)

Provide:
- List of all issues found
- Fixes applied with explanations
- Verification that all checks pass
- Recommendations for prevention
```

**Examples**:
```bash
@fix-my-project check and fix all issues in the email module

@fix-my-project emergency fix - production build is failing

Fix all possible issues in app/crm/ before deployment
```

---

### ✅ Testing & Quality Assurance

**GitHub Prompt**: `@testers` (QA Engineer)  
**Authority**: ✅ Test Code Only (NOT production code)

#### Comprehensive Test Suite

**Prompt**:
```
Create comprehensive tests for [component/action/feature]:

Test Coverage:
1. Unit Tests (__tests__/[path]/[name].test.tsx)
   - All exported functions/components
   - Edge cases and error scenarios
   - Type safety verification

2. Integration Tests (__tests__/integration/[feature].test.tsx)
   - Multi-component workflows
   - Server action → component → UI flow
   - Database interactions (test database)

3. Accessibility Tests
   - ARIA attributes
   - Keyboard navigation
   - Screen reader compatibility

4. Performance Tests
   - Large dataset handling
   - Memory leak detection
   - Render performance

Target: 80%+ coverage (statements, branches, functions, lines)
Follow Vitest + React Testing Library patterns.
```

#### E2E Testing

**Prompt**:
```
Create E2E tests for [user-workflow] using Cypress:

Test Scenarios:
1. Setup in cypress/e2e/[feature]/[workflow].cy.ts
2. Complete user journey from [start] to [end]
3. Authentication flow testing
4. Error handling and edge cases
5. Multi-tenant data isolation verification
6. Responsive behavior (mobile + desktop)

Example: User login → Navigate to CRM → Create opportunity → Update stage → Close deal
```

**Examples**:
```bash
@testers create comprehensive test suite for email module

@testers write accessibility tests for department form

Create E2E tests for complete CRM sales pipeline workflow from lead to closed deal
```

---

### 🔒 Security Audits & Compliance

**GitHub Prompt**: `@security-compliance` (Security Engineer)  
**Authority**: ✅ Security & Compliance Code

#### Security Audit

**Prompt**:
```
Perform comprehensive security audit of [module/feature]:

Security Checklist:
1. XSS vulnerabilities (dangerouslySetInnerHTML, innerHTML)
2. SQL injection risks (raw queries, string concatenation)
3. Authentication gaps (unprotected routes, missing checks)
4. Authorization issues (tenant checks, RBAC violations)
5. Credential exposure (hardcoded secrets, logs)
6. CSRF vulnerabilities (unprotected mutations)
7. Rate limiting gaps
8. Insecure dependencies (npm audit)

Provide:
- Severity rating (Critical/High/Medium/Low)
- Affected files with line numbers
- Exploit scenarios
- Remediation steps with code examples
- Compliance assessment (GDPR, SOX)
```

#### Apply Sanitization

**Prompt**:
```
Apply HTML sanitization to [component] using DOMPurify:

Implementation:
1. Import isomorphic-dompurify
2. Create sanitization config in lib/[module]/sanitization.ts
3. Define allowed tags/attributes based on use case
4. Apply sanitization before rendering HTML
5. Add CSP headers in next.config.ts
6. Create test cases with malicious payloads
7. Document sanitization policy

Replace all dangerouslySetInnerHTML instances.
```

**Examples**:
```bash
@security-compliance audit email module for security vulnerabilities and GDPR compliance

@security-compliance implement RBAC for department access control

Apply DOMPurify sanitization to email body rendering in app/email/[id]/page.tsx
```

---

### ⚡ Performance Optimization

**GitHub Prompt**: `@performance-optimization` (Performance Engineer)  
**Authority**: ✅ Performance Optimization Code

**Prompt**:
```
Optimize performance of [component/feature]:

Optimization Areas:
1. Bundle size analysis (target: <200KB compressed)
2. Unnecessary re-renders detection
3. Missing memoization opportunities
4. Client vs server-side data fetching
5. Virtual scrolling for large lists
6. Database query efficiency (N+1 queries)
7. Caching strategies implementation
8. Code splitting and lazy loading

Provide:
- Before/after performance metrics
- Bottleneck identification
- Optimization implementations
- Expected impact assessment
```

**Examples**:
```bash
@performance-optimization optimize email list rendering for 1000+ emails

@performance-optimization implement caching for department hierarchy queries

Optimize CRM dashboard loading time - currently 5+ seconds
```

---

## E. Closure Phase

**Purpose**: Document completed work, create handover materials, and archive project knowledge.

### 📚 Technical Documentation

**GitHub Prompt**: `@documentation-knowledge` (Documentation Specialist)  
**Authority**: ✅ Documentation Code Implementation

#### API Documentation

**Prompt**:
```
Generate comprehensive API documentation for [module]:

Documentation Structure:
1. JSDoc comments for all server actions
2. Parameter types, return types, error types
3. Usage examples with code snippets
4. Side effects documentation (database, cache, revalidation)
5. Required permissions/roles
6. Rate limits
7. OpenAPI/Swagger spec (if REST API)
8. Generated markdown in docs/api/[module].md

Follow TypeDoc patterns from typedoc.json config.
```

#### Feature Documentation

**Prompt**:
```
Create comprehensive documentation for [feature]:

Documentation:
1. docs/features/[feature].md:
   - Overview and purpose
   - User workflows (step-by-step with screenshots)
   - Technical architecture diagram
   - Database schema
   - API endpoints
   - Configuration options
   - Troubleshooting guide
   - Known limitations

2. docs/technical-specifications/[feature].md:
   - System requirements
   - Dependencies
   - Performance characteristics
   - Security considerations
   - Testing strategy
   - Deployment notes

Follow WhizFlow documentation standards.
```

**Examples**:
```bash
@documentation-knowledge create comprehensive documentation for email module API

@documentation-knowledge generate user guide for department management

Create complete documentation for CRM opportunity pipeline including user workflows and API
```

---

### 📝 Architecture Decision Records (ADRs)

**Prompt**:
```
Create ADR for [decision] in docs/architecture/adr-[number]-[title].md:

ADR Format:
# ADR-[number]: [Title]

**Status**: Proposed/Accepted/Deprecated  
**Date**: [YYYY-MM-DD]  
**Deciders**: [Names]

## Context
[What issue motivated this decision?]

## Decision
[What change are we proposing/doing?]

## Consequences
**Positive**:
- [List benefits]

**Negative**:
- [List drawbacks]

**Neutral**:
- [List neutral impacts]

## Alternatives Considered
- [Option 1]: [Why rejected]
- [Option 2]: [Why rejected]

## Implementation Notes
[Technical details, migration path, rollback strategy]
```

**Example**:
```
Create ADR for decision to use React Server Components for email module in docs/architecture/adr-015-email-rsc-migration.md
```

---

## Cross-Phase: Governance & Risk Management

**Purpose**: Elements that apply throughout the entire project lifecycle.

### 🎯 Governance Structure

#### Project Roles Reference

| Role | Prompt Equivalent | Responsibility |
|------|------------------|----------------|
| Project Sponsor | `@ba` (Business Analyst) | Requirements, business case |
| Solution Architect | `@architect` | Technical design documents |
| Database Architect | `@data-architect` | Schema design, optimization |
| Development Lead | `@developer` | Code implementation |
| QA Lead | `@testers` | Testing strategy, quality |
| Security Lead | `@security-compliance` | Security audits, compliance |
| DevOps Lead | `@dev-ops-engineer` | Deployment, infrastructure |

---

### 🚧 Risk & Issue Management

#### Continuous Risk Monitoring

**Use Case**: Track and mitigate risks throughout project lifecycle.

**Prompt**:
```
Analyze risks for [project/feature]:

Risk Assessment:
1. Technical risks (complexity, dependencies, unknowns)
2. Security risks (vulnerabilities, data protection)
3. Performance risks (scalability, response times)
4. Resource risks (skills gaps, availability)
5. Timeline risks (delays, blockers)

For each risk:
- Probability (Low/Medium/High)
- Impact (Low/Medium/High)
- Mitigation strategy
- Contingency plan
- Owner/Responsible person

Provide risk matrix and mitigation roadmap.
```

#### Issue Escalation

**Prompt**:
```
Escalate critical issue: [Issue description]

Escalation Details:
1. Issue summary and severity
2. Impact on project/users
3. Root cause analysis
4. Attempted solutions
5. Required resources/decisions
6. Recommended escalation path
7. Timeline constraints

Provide executive summary for stakeholders.
```

---

### 🔄 Change Management

**Use Case**: Formal evaluation and approval of changes to project scope or design.

**Prompt**:
```
Evaluate change request for [feature/module]:

Change Request Analysis:
1. Change description and rationale
2. Impact assessment:
   - Scope impact (timeline, resources)
   - Technical impact (architecture, dependencies)
   - Cost impact (development, testing, deployment)
   - Risk impact (new risks introduced)
3. Alternatives analysis
4. Recommendation (Approve/Reject/Defer)
5. Implementation plan (if approved)
6. Rollback strategy

Provide change impact report for stakeholders.
```

---

### 💬 Stakeholder Communication

**Use Case**: Continuous engagement with sponsors, clients, and teams.

#### Status Report Generation

**Prompt**:
```
Generate project status report for [project/sprint]:

Status Report:
1. Executive Summary
   - Overall health (On Track/At Risk/Off Track)
   - Key accomplishments this period
   - Upcoming milestones
   
2. Progress Details
   - Completed tasks (with metrics)
   - In-progress tasks
   - Blocked tasks with resolution plans
   
3. Metrics
   - Code coverage
   - Test pass rate
   - Performance benchmarks
   - Security vulnerabilities
   
4. Risks & Issues
   - Open issues with severity
   - Risk mitigation status
   
5. Next Steps
   - Priorities for next period
   - Required decisions/approvals

Format for [technical team / management / executive] audience.
```

---

## Optional Advanced Phases

### 🔍 Pre-Initiation (Opportunity Discovery)

**Purpose**: Identify potential projects and align with business strategy before formal initiation.

**Prompt**:
```
Conduct opportunity assessment for [idea/requirement]:

Discovery Process:
1. Strategic Alignment
   - Business objectives alignment
   - ROI estimation
   - Competitive advantage analysis
   
2. Feasibility Assessment
   - Technical feasibility
   - Resource availability
   - Timeline estimation
   - Budget requirements
   
3. Market Research
   - Industry trends
   - Competitor analysis
   - User demand validation
   
4. Risk Assessment
   - Technical risks
   - Market risks
   - Resource risks
   
5. Recommendation
   - Go/No-Go decision rationale
   - Priority ranking
   - High-level roadmap

Provide opportunity assessment report for leadership.
```

---

### 🔁 Transition & Support

**Purpose**: Handover to operations, ensure maintenance and support readiness.

**Prompt**:
```
Create transition plan for [project/feature]:

Transition Deliverables:
1. Operations Runbook
   - Deployment procedures
   - Monitoring setup
   - Troubleshooting guides
   - Escalation procedures
   
2. Support Documentation
   - User support guides
   - FAQ documentation
   - Known issues and workarounds
   - Support contact information
   
3. Training Materials
   - Admin training guides
   - User training materials
   - Video tutorials (scripts)
   
4. Maintenance Plan
   - Regular maintenance tasks
   - Update procedures
   - Backup and recovery
   - Performance monitoring
   
5. Handover Checklist
   - Knowledge transfer sessions
   - Access and credentials
   - Support team readiness
   - Go-live checklist

Provide transition readiness report.
```

---

### 📈 Post-Implementation Review

**Purpose**: Measure ROI, satisfaction, and process improvements after deployment.

**Prompt**:
```
Conduct post-implementation review for [project/feature]:

Review Areas:
1. Success Metrics
   - Achieved vs planned objectives
   - ROI calculation (actual vs projected)
   - User adoption metrics
   - Performance metrics
   
2. Stakeholder Satisfaction
   - User satisfaction survey results
   - Sponsor feedback
   - Team feedback
   
3. Technical Assessment
   - Code quality metrics
   - Test coverage achieved
   - Performance benchmarks
   - Security posture
   
4. Process Evaluation
   - What went well
   - What could be improved
   - Lessons learned
   - Best practices identified
   
5. Recommendations
   - Process improvements
   - Tool/technology recommendations
   - Training needs
   - Future enhancements

Provide post-implementation report with actionable recommendations.
```

---

## F. GitHub Prompts Integration

**Purpose**: Leverage battle-tested specialized prompts for expert-level development tasks.

### 📌 GitHub Prompts: Quick Reference

**Overview**: 20 essential specialized prompts in `.github/prompts/` for expert-level tasks. These prompts have been battle-tested and optimized for specific development scenarios.

**Authority Levels**:
- ✅ **Full Code**: Complete implementation authority
- 🔧 **Limited Code**: Specific code type only (tests, database, docs)  
- ❌ **No Code**: Analysis, planning, design only

---

### Tier 1: Core Development (6 Essential Prompts)

#### `@plan-implementor` (Plan Executor)
**Authority**: ✅ Full Code - Zero Confirmation  
**Lifecycle**: **C. Execution**, D. Monitoring  
**Use When**: You have a complete implementation plan and want autonomous execution  
**Example**: `@plan-implementor implement plan/in-progress/refactor-email-module-1.md`

#### `@developer` (Full-Stack Developer)
**Authority**: ✅ Full Code  
**Lifecycle**: **C. Execution**  
**Use When**: Implementing specific features or full-stack functionality  
**Example**: `@developer implement email threading feature with conversation view`

#### `@problem-solver` (Debugging Specialist)
**Authority**: ✅ Diagnostic & Fix Code  
**Lifecycle**: **D. Monitoring & Controlling**  
**Use When**: Investigating and fixing UI/UX bugs, runtime errors, or user experience issues  
**Example**: `@problem-solver the email list is not rendering on mobile devices`

#### `@fix-my-project` (Emergency Fixer)
**Authority**: ✅ Comprehensive Fix  
**Lifecycle**: **D. Monitoring & Controlling** (Emergency)  
**Use When**: Project is broken with multiple issues - need comprehensive scan and fix  
**Example**: `@fix-my-project check and fix all issues in the email module`

#### `@bug-fix` (Bug Fix Engineer)
**Authority**: ✅ Bug Fix Code  
**Lifecycle**: **D. Monitoring & Controlling**  
**Use When**: Targeted fix for a specific identified bug  
**Example**: `@bug-fix resolve email attachment upload failing for files > 10MB`

#### `@testers` (QA Engineer)
**Authority**: ✅ Test Code Only  
**Lifecycle**: **D. Monitoring & Controlling**  
**Use When**: Creating comprehensive test suites, E2E tests, accessibility tests  
**Example**: `@testers create comprehensive test suite for email module`

---

### Tier 2: Planning & Architecture (4 Planning Prompts)

#### `@implementation-plan` (Plan Generator)
**Authority**: ❌ No Code - Planning Only  
**Lifecycle**: **B. Planning**  
**Use When**: Creating detailed implementation plans from requirements  
**Example**: `@implementation-plan create plan for implementing email threading`

#### `@plan-review-and-update` (Plan Reviewer)
**Authority**: ❌ No Code - Analysis Only  
**Lifecycle**: **B. Planning**, D. Monitoring  
**Use When**: Reviewing existing plans and updating based on new infrastructure  
**Example**: `@plan-review-and-update review plan/in-progress/refactor-email-module-1.md`

#### `@architect` (System Architect)
**Authority**: ❌ No Code - Design Only (CRITICAL)  
**Lifecycle**: **B. Planning**  
**Use When**: Creating technical specifications and architecture diagrams WITHOUT code  
**Example**: `@architect design architecture for email threading and conversation grouping`

#### `@data-architect` (Database Architect)
**Authority**: ✅ Database & Migration Code  
**Lifecycle**: **B. Planning**  
**Use When**: Designing Prisma schemas, migrations, and query optimization  
**Example**: `@data-architect design schema for email threading with conversation relationships`

---

### Tier 3: Specialized Expertise (6 Specialized Prompts)

#### `@ui-ux` (UI/UX Specialist)
**Authority**: ✅ UI/UX Code  
**Lifecycle**: **C. Execution**  
**Use When**: Implementing responsive design, accessibility, or UI components  
**Example**: `@ui-ux implement responsive email list with mobile-first design`

#### `@api-integration` (API Integration Specialist)
**Authority**: ✅ Integration Code  
**Lifecycle**: **C. Execution**  
**Use When**: Integrating external APIs (Gmail, Outlook, Slack, etc.)  
**Example**: `@api-integration implement Gmail API integration for email sync`

#### `@dev-ops-engineer` (DevOps Engineer)
**Authority**: ✅ Infrastructure Code  
**Lifecycle**: **E. Closure**, Cross-Phase  
**Use When**: CI/CD pipelines, Docker, Kubernetes, deployment automation  
**Example**: `@dev-ops-engineer create Docker multi-stage build for email module`

#### `@i18n-specialist` (i18n Specialist)
**Authority**: ✅ i18n & Localization Code  
**Lifecycle**: **C. Execution**  
**Use When**: Adding internationalization support, translations, RTL layouts  
**Example**: `@i18n-specialist add Arabic language support with RTL layout to email module`

#### `@security-compliance` (Security Engineer)
**Authority**: ✅ Security & Compliance Code  
**Lifecycle**: **D. Monitoring & Controlling**  
**Use When**: Security audits, vulnerability fixes, GDPR/SOX compliance  
**Example**: `@security-compliance audit email module for security vulnerabilities`

#### `@performance-optimization` (Performance Engineer)
**Authority**: ✅ Performance Optimization Code  
**Lifecycle**: **D. Monitoring & Controlling**  
**Use When**: Optimizing performance, reducing bundle size, query optimization  
**Example**: `@performance-optimization optimize email list rendering for 1000+ emails`

---

### Tier 4: Analysis & Knowledge (4 Analysis Prompts)

#### `@code-auditor` (Quality Auditor)
**Authority**: ❌ No Code - Analysis Only  
**Lifecycle**: **A. Initiation**, D. Monitoring  
**Use When**: Proactive bug discovery before planning new features  
**Example**: `@code-auditor audit email module for potential bugs and code quality issues`

#### `@ba` (Business Analyst)
**Authority**: ❌ No Code - Analysis Only  
**Lifecycle**: **A. Initiation**  
**Use When**: Gathering requirements with web research and industry best practices  
**Example**: `@ba analyze business requirements for email automation workflows`

#### `@documentation-knowledge` (Documentation Specialist)
**Authority**: ✅ Documentation Code  
**Lifecycle**: **E. Closure**  
**Use When**: Generating comprehensive documentation, API docs, user guides  
**Example**: `@documentation-knowledge create comprehensive documentation for email module API`

#### `@todo-manager` (Technical Debt Analyst)
**Authority**: ❌ No Code - Analysis Only  
**Lifecycle**: **A. Initiation**  
**Use When**: Identifying incomplete implementations and technical debt  
**Example**: `@todo-manager scan codebase for TODO comments and incomplete implementations`

---

### GitHub Prompts by Project Lifecycle Phase

| Phase | GitHub Prompts | Use Case |
|-------|---------------|----------|
| **A. Initiation** | `@ba`, `@code-auditor`, `@todo-manager` | Requirements, gap analysis, technical debt assessment |
| **B. Planning** | `@implementation-plan`, `@plan-review-and-update`, `@architect`, `@data-architect` | Create plans, design architecture, schema design |
| **C. Execution** | `@plan-implementor`, `@developer`, `@ui-ux`, `@api-integration`, `@i18n-specialist` | Implement features, execute plans, build UI |
| **D. Monitoring & Controlling** | `@problem-solver`, `@bug-fix`, `@fix-my-project`, `@testers`, `@security-compliance`, `@performance-optimization`, `@plan-review-and-update` | Debug issues, run tests, security audits, performance optimization |
| **E. Closure** | `@documentation-knowledge`, `@dev-ops-engineer` | Documentation, deployment setup, handover |

---

### Lifecycle-Based Workflow Examples

#### Example 1: New Feature Development (Full Cycle)

```bash
# Phase A: Initiation
@ba analyze business requirements for customer notification system
@code-auditor audit existing notification infrastructure for issues

# Phase B: Planning
@data-architect design schema for notification preferences and delivery tracking
@architect design architecture for real-time notification system with WebSocket
@implementation-plan create plan for notification system implementation

# Phase C: Execution
@plan-implementor implement plan/in-progress/notification-system-1.md
# OR step-by-step:
@developer implement notification preference management UI
@api-integration integrate Twilio for SMS and SendGrid for email notifications
@i18n-specialist add multi-language support for notification templates

# Phase D: Monitoring & Controlling
@testers create comprehensive test suite for notification system
@security-compliance audit notification system for PII protection and GDPR compliance
@performance-optimization optimize notification queue processing for high volume

# Phase E: Closure
@documentation-knowledge create comprehensive documentation for notification API
@dev-ops-engineer setup CI/CD pipeline with notification system deployment
```

#### Example 2: Emergency Bug Fix (Expedited Cycle)

```bash
# Phase A: Initiation (Quick Assessment)
@code-auditor scan email module for critical bugs causing production issues

# Phase D: Immediate Fix (Skip B & C)
@fix-my-project emergency fix - email attachments failing in production
# OR targeted fix:
@problem-solver debug "Cannot read property 'fileName' of undefined" in email attachments
@bug-fix fix XSS vulnerability in email body rendering (CRITICAL)

# Phase D: Verification
@testers write regression tests for email attachment bug
@security-compliance verify XSS fix and run security scan

# Phase E: Documentation
@documentation-knowledge update troubleshooting guide with email attachment fix
```

#### Example 3: Technical Debt Cleanup (Maintenance Cycle)

```bash
# Phase A: Discovery
@todo-manager scan codebase for TODO comments and incomplete implementations
@code-auditor audit email module for code quality and technical debt

# Phase B: Planning
@plan-review-and-update review plan/in-progress/email-tech-debt-cleanup.md
@architect design refactoring strategy for email module architecture

# Phase C: Refactoring
@developer refactor actions/email/email.action.ts to standardized pattern
@performance-optimization optimize email list queries and implement caching

# Phase D: Quality Assurance
@testers run comprehensive tests to ensure no regressions
@security-compliance verify refactored code maintains security standards

# Phase E: Handover
@documentation-knowledge update technical specifications with refactoring details
```

---

### GitHub Prompts vs Custom Prompts

**When to Use GitHub Prompts**:
- ✅ Specialized expertise needed (UI/UX, DevOps, Security, i18n)
- ✅ Want zero-confirmation autonomous execution (`@plan-implementor`)
- ✅ Need emergency comprehensive fixes (`@fix-my-project`)
- ✅ Require analysis without code changes (`@ba`, `@code-auditor`)

**When to Use Custom Prompts** (from sections 1-13):
- ✅ Need flexible, customizable instructions
- ✅ Want to combine multiple concerns in one request
- ✅ Require specific WhizFlow patterns not covered by GitHub prompts
- ✅ Need granular control over implementation steps

**Hybrid Approach** (Recommended):
```
Use GitHub prompts for specialized tasks + Custom prompts for general workflows

Example:
1. @ba analyze business requirements (GitHub)
2. Create implementation plan (Custom prompt)
3. @plan-implementor execute plan (GitHub)
4. Review progress and update status (Custom prompt)
5. @testers create test suite (GitHub)
6. Fix remaining issues (Custom prompt)
7. @documentation-knowledge generate docs (GitHub)
```

---

## G. Quick References

### 📊 Prompt Decision Matrix

**Decision Tree: Which Prompt Should I Use?**

```
START: What do I need to do?

├─ 📋 INITIATION PHASE
│  ├─ Need business requirements? → @ba
│  ├─ Discover technical debt? → @todo-manager
│  └─ Audit code quality? → @code-auditor
│
├─ 📐 PLANNING PHASE
│  ├─ Need architecture design? → @architect
│  ├─ Need database schema? → @data-architect
│  ├─ Create implementation plan? → @implementation-plan
│  └─ Review existing plan? → @plan-review-and-update
│
├─ 🚀 EXECUTION PHASE
│  ├─ Have a plan to execute? → @plan-implementor
│  ├─ Implement specific feature? → @developer
│  ├─ Need UI/UX work? → @ui-ux
│  ├─ Integrate external API? → @api-integration
│  └─ Add internationalization? → @i18n-specialist
│
├─ 🔍 MONITORING & CONTROLLING PHASE
│  ├─ Something broken?
│  │  ├─ UI/UX issue → @problem-solver
│  │  ├─ Known bug → @bug-fix
│  │  └─ Multiple issues → @fix-my-project
│  ├─ Need testing? → @testers
│  ├─ Security audit? → @security-compliance
│  └─ Performance issues? → @performance-optimization
│
├─ 📚 CLOSURE PHASE
│  ├─ Create documentation? → @documentation-knowledge
│  └─ Setup deployment? → @dev-ops-engineer
│
└─ ❓ NOT SURE
   └─ Use Custom Prompts (Sections A-E above)
```

---

### 📈 Authority Levels Reference

| Authority Level | Description | GitHub Prompts |
|----------------|-------------|----------------|
| ✅ **Full Code** | Complete implementation authority | `@plan-implementor`, `@developer`, `@bug-fix`, `@ui-ux`, `@api-integration`, `@dev-ops-engineer`, `@i18n-specialist`, `@security-compliance`, `@performance-optimization`, `@data-architect`, `@documentation-knowledge` |
| 🔧 **Limited Code** | Specific code type only | `@testers` (tests), `@problem-solver` (diagnostic + fix) |
| ❌ **No Code** | Analysis, planning, design only | `@architect`, `@implementation-plan`, `@plan-review-and-update`, `@ba`, `@code-auditor`, `@todo-manager` |

---

### 🎯 Most Used Combinations

#### Combination 1: Full Feature Development
```bash
@ba → @data-architect → @implementation-plan → @plan-implementor → @testers
```

#### Combination 2: Quick Feature Addition
```bash
@developer → @testers
```

#### Combination 3: Emergency Fix
```bash
@fix-my-project OR @problem-solver → @bug-fix → @testers
```

#### Combination 4: Refactoring
```bash
@code-auditor → @plan-review-and-update → @developer
```

#### Combination 5: Security Hardening
```bash
@security-compliance → @bug-fix → @testers
```

---

### 🔄 Prompt Workflow Patterns

#### Pattern 1: Waterfall Approach (Structured Projects)
```
A. Initiation → B. Planning → C. Execution → D. Monitoring → E. Closure
@ba → @architect → @implementation-plan → @plan-implementor → @testers → @documentation-knowledge
```

#### Pattern 2: Agile Sprint (Iterative Development)
```
Sprint Planning: @ba + @plan-review-and-update
Sprint Execution: @developer (iterative)
Sprint Review: @code-auditor + @testers
Sprint Retrospective: Update plan
```

#### Pattern 3: Emergency Hotfix (Fast Response)
```
Assess: @code-auditor
Fix: @fix-my-project OR @problem-solver
Verify: @testers
Document: Update relevant docs
```

#### Pattern 4: Technical Debt Cleanup (Maintenance)
```
Discovery: @todo-manager + @code-auditor
Planning: @plan-review-and-update
Refactoring: @developer + @performance-optimization
Verification: @testers
```

---

### 📝 Custom Prompts Quick Index

| Phase | Prompt Type | Section Reference |
|-------|------------|-------------------|
| **Initiation** | Requirements Analysis | Section A: `@ba` |
| | Technical Debt | Section A: `@todo-manager` |
| | Code Quality Assessment | Section A: `@code-auditor` |
| **Planning** | Architecture Design | Section B: `@architect` |
| | Database Schema | Section B: `@data-architect` |
| | Implementation Plans | Section B: `@implementation-plan` |
| | Plan Review | Section B: `@plan-review-and-update` |
| **Execution** | Autonomous Plan Execution | Section C: `@plan-implementor` |
| | Feature Development | Section C: `@developer` |
| | Refactoring | Section C: Refactoring patterns |
| | Advanced Features | Section C: WebSockets, i18n, Feature Flags |
| **Monitoring** | Status Updates | Section D: Progress Tracking |
| | Code Review | Section D: Review patterns |
| | Debugging | Section D: `@problem-solver`, `@bug-fix` |
| | Emergency Fixes | Section D: `@fix-my-project` |
| | Testing | Section D: `@testers` |
| | Security Audits | Section D: `@security-compliance` |
| | Performance | Section D: `@performance-optimization` |
| **Closure** | Documentation | Section E: `@documentation-knowledge` |
| | ADRs | Section E: Architecture Decision Records |

---

### 🛠️ Common Development Commands

```bash
# Type Checking
pnpm tsc --noEmit                    # Check TypeScript errors

# Testing
pnpm test                            # Run unit tests
pnpm test:coverage                   # Run tests with coverage
pnpm test:e2e                        # Run Cypress E2E tests

# Code Quality
pnpm quality-check                   # Run linting, formatting, spellcheck
pnpm lint                            # ESLint only
pnpm format                          # Prettier only

# Database
pnpm db:reset                        # Reset and run migrations
pnpm db:fresh                        # Truncate all data and reseed
pnpm db:seed                         # Run module-specific seeders
pnpm db:studio                       # Open Prisma Studio

# Development
pnpm dev                             # Start dev server (port 3000)
pnpm build                           # Production build
pnpm start                           # Start production server

# Deployment
pnpm deploy:staging                  # Deploy to staging
pnpm deploy:production               # Deploy to production
```

---

### 📁 File Search Patterns

```bash
# Server Actions
actions/**/*.action.ts

# Components
app/**/[module]/_components/**/*.tsx
components/**/*.tsx

# Types
types/**/[module]/**/*.ts

# Validations
validations/**/[module]/**/*.ts

# Tests
__tests__/**/*.test.tsx
__tests__/integration/**/*.test.tsx
cypress/e2e/**/*.cy.ts

# Database
prisma/schema/**/*.prisma

# Documentation
docs/**/*.md
.github/instructions/**/*.md
```

---

## H. Prompt Engineering Best Practices

### 1. Specificity Principles

**✅ Good Prompt Examples**:
```
Implement email threading feature with:
- Conversation grouping by subject and participants
- Visual thread indicators in email list
- Expand/collapse thread UI
- Thread-aware navigation (prev/next email in thread)
- Server action: actions/email/thread.action.ts
- React Query hooks for optimistic updates
```

**❌ Bad Prompt Examples**:
```
Add email threading                  # Too vague
Make emails work better              # No actionable details
Fix email stuff                      # What stuff?
```

---

### 2. Context Provision

**Always Include**:
- **File Paths**: Exact paths to relevant files
- **Line Numbers**: When referencing specific code
- **Existing Patterns**: Reference similar implementations
- **Constraints**: Performance limits, browser support, accessibility
- **Success Criteria**: Measurable outcomes

**Example**:
```
Refactor actions/email/email.action.ts to follow department.action.ts pattern:

Reference Pattern: actions/core/department.action.ts (lines 15-120)
Constraints:
- Must maintain backward compatibility
- Keep existing API surface
- Zero `any` types
- Add proper revalidation tags

Success Criteria:
- All tests pass
- TypeScript compiles without errors
- Reduced code duplication by 40%+
```

---

### 3. Incremental Changes

**✅ Break Down Large Changes**:
```bash
# Phase 1: Database Schema
@data-architect design email threading schema

# Phase 2: Backend Logic
@developer implement thread grouping logic in actions/email/thread.action.ts

# Phase 3: Frontend Components
@developer create thread UI components in app/email/_components/

# Phase 4: Integration
@developer integrate thread UI with email list

# Phase 5: Testing
@testers create comprehensive thread tests
```

**❌ Avoid Single Large Request**:
```
Implement complete email threading feature with database, backend, frontend, tests, and documentation
# Too much at once - hard to review and debug
```

---

### 4. Multi-Perspective Requests

**Ask for Alternatives**:
```
Implement caching for email list with multiple approaches:

Approach A: Redis with automatic invalidation
Approach B: In-memory cache with React Query
Approach C: Database-level caching with Prisma

For each approach, provide:
- Pros and cons
- Performance impact
- Complexity assessment
- Recommended use case
```

---

### 5. Test-Driven Prompts

**Always Include Testing**:
```
Implement email search functionality:

Implementation:
1. Server action: searchEmails(query, filters)
2. React Query hook: useEmailSearch
3. Search UI component with filters

Testing Requirements:
- Unit tests for searchEmails action
- Integration tests for useEmailSearch hook
- E2E tests for complete search workflow
- Performance tests with 10,000+ emails
- Accessibility tests (keyboard navigation)

Target: 85%+ code coverage
```

---

### 6. Reference-Based Prompts

**Use Existing Code as Templates**:
```
Create customer module following department module pattern:

Reference:
- Database: prisma/schema/core.prisma (Department model)
- Server Actions: actions/core/department.action.ts
- Pages: app/core/departments/
- Components: app/core/departments/_components/
- Views: app/core/departments/_view/

Replicate:
- CRUD operations with same patterns
- Multi-view support (table, tree, kanban)
- Filters extending TenantBaseFilters
- Relationship configurations
- Analytics operations
```

---

### 7. Error Handling in Prompts

**Specify Error Scenarios**:
```
Implement email attachment upload with error handling:

Success Case:
- Upload files up to 25MB
- Support multiple file types
- Show upload progress

Error Cases:
1. File too large (>25MB)
   - Show user-friendly error message
   - Suggest compression or file splitting
   
2. Invalid file type
   - List allowed types
   - Provide clear guidance
   
3. Network failure
   - Implement retry logic (3 attempts)
   - Show retry UI
   - Allow manual retry

4. Server storage full
   - Graceful degradation
   - Contact admin notification
```

---

### 8. Performance-Conscious Prompts

**Include Performance Targets**:
```
Optimize email list rendering:

Current State:
- 1000+ emails
- Initial render: 3.2s
- Scroll performance: janky

Targets:
- Initial render: <500ms
- Smooth 60fps scrolling
- Memory usage: <100MB

Implementation:
- Virtual scrolling (react-window)
- Lazy image loading
- Pagination (50 emails per page)
- Optimize re-renders with React.memo
- Implement infinite scroll

Measurement:
- Use React DevTools Profiler
- Lighthouse performance score >90
- Core Web Vitals: LCP <2.5s, FID <100ms
```

---

### 9. Accessibility-First Prompts

**Specify Accessibility Requirements**:
```
Create email compose form with full accessibility:

WCAG 2.1 AA Compliance:
- Keyboard navigation (Tab, Shift+Tab, Enter, Esc)
- Screen reader support (ARIA labels, live regions)
- Focus management (proper focus order)
- Color contrast (4.5:1 minimum)
- Touch targets (44x44px minimum)
- Error identification (clear error messages)

Testing:
- axe-core automated tests
- Manual screen reader testing (NVDA, JAWS)
- Keyboard-only navigation
- Voice control compatibility
```

---

### 10. Documentation-Inclusive Prompts

**Request Documentation Automatically**:
```
Implement email threading feature:

Code Deliverables:
- Database schema
- Server actions
- React components
- Tests

Documentation Deliverables:
- API documentation (JSDoc comments)
- User guide (docs/features/email-threading.md)
- Technical specification (docs/technical-specifications/email-threading.md)
- Architecture Decision Record (docs/architecture/adr-XXX-email-threading.md)
- Troubleshooting guide
- Migration guide (if applicable)
```

---

## Prompt Template Library

### Template 1: Feature Implementation
```
Implement [feature-name] with the following requirements:

Requirements:
- [Functional requirement 1]
- [Functional requirement 2]
- [Non-functional requirement 1]

Structure:
1. Database schema in prisma/schema/[module].prisma
2. Server actions in actions/[module]/[feature].action.ts
3. Pages in app/[module]/[feature]/
4. Components in app/[module]/[feature]/_components/
5. Types in types/[module]/[feature].ts
6. Validation in validations/[module]/[feature].ts

Reference Patterns:
- [Similar feature or module]

Testing:
- Unit tests for server actions
- Integration tests for complete workflow
- E2E tests for user journey

Success Criteria:
- Zero TypeScript errors
- 80%+ test coverage
- WCAG 2.1 AA compliant
```

### Template 2: Bug Fix
```
Fix the following bug: [Bug description]

Current Behavior:
- [What is happening now]

Expected Behavior:
- [What should happen]

Root Cause:
- [Known or suspected cause]

Reproduction Steps:
1. [Step 1]
2. [Step 2]
3. [Observed issue]

Fix Requirements:
- Resolve root cause
- Add regression tests
- Verify no side effects
- Document in CHANGELOG

Testing:
- Reproduce bug first
- Verify fix resolves issue
- Run full test suite
- Manual testing of related features
```

### Template 3: Refactoring
```
Refactor [component/file/module] for [reason]:

Current Issues:
- [Issue 1]
- [Issue 2]

Refactoring Goals:
- [Goal 1]
- [Goal 2]

Approach:
1. [Step 1]
2. [Step 2]

Constraints:
- Maintain backward compatibility
- Zero breaking changes
- Preserve existing tests
- Improve performance by [target]

Success Criteria:
- All tests pass
- No regression issues
- Measurable improvement in [metric]
```

---

## Related Documentation

- [Architecture Guidelines](.github/instructions/architect.instructions.md)
- [Next.js Patterns](.github/instructions/nextjs.instructions.md)
- [UI/UX Standards](.github/instructions/ui-ux.instructions.md)
- [Authentication](.github/instructions/auth-js.instructions.md)
- [Database Patterns](.github/instructions/database-prisma.instructions.md)
- [Testing Guidelines](.github/instructions/test-case.instructions.md)
- [API Integration](.github/instructions/api-integration.instructions.md)
- [Deployment & DevOps](.github/instructions/deployment-devops.instructions.md)

---

## Maintenance & Updates

**Document Owner**: Engineering Team  
**Update Frequency**: Monthly or when major patterns change  
**Review Process**: PR review required for prompt additions/changes

**Contribution Guidelines**:
1. Test prompts thoroughly before adding
2. Include realistic examples
3. Reference existing code patterns
4. Update table of contents
5. Follow markdown formatting standards
6. Ensure lifecycle phase mapping is correct

**Version History**:
- **v3.0** (2025-01-XX): Reorganized by Project Lifecycle phases (A-E) + Cross-Phase elements + GitHub Prompts integration
- **v2.0** (2025-01-XX): Consolidated into single reference document, added 20 essential GitHub prompts
- **v1.0** (2024-12-XX): Initial creation with custom prompts

---

**Last Updated**: 2025-01-XX  
**Next Review**: Monthly  
**Status**: Active

---

## Appendix: Glossary

**Project Lifecycle Phases** (PMI/PMBOK):
- **A. Initiation**: Define project scope, assess feasibility, gather requirements
- **B. Planning**: Create detailed roadmaps, design architecture, allocate resources
- **C. Execution**: Implement plans, develop features, build deliverables
- **D. Monitoring & Controlling**: Track progress, ensure quality, manage changes
- **E. Closure**: Finalize deliverables, document learnings, handover to operations

**Authority Levels**:
- **Full Code**: Can create, modify, and delete production code
- **Limited Code**: Can only work with specific code types (tests, docs, database)
- **No Code**: Analysis, planning, and design only - no code changes

**WhizFlow Terminology**:
- **Server Actions**: Next.js server-side functions for data mutations
- **Multi-tenant**: Architecture supporting multiple organizations/tenants
- **React Query**: Server state management library
- **Prisma**: TypeScript-first ORM for database operations
- **Zustand**: Lightweight state management (UI state only)

---

**End of Prompts Reference Document**
Symptom: [Describe slow behavior]

Analysis needed:
1. Profile component renders (use React DevTools Profiler)
2. Check for N+1 database queries
3. Analyze bundle size (use webpack-bundle-analyzer)
4. Check for memory leaks
5. Verify caching strategy
6. Review network waterfall
7. Check for unnecessary re-renders

Provide:
- Performance metrics (before/after)
- Bottleneck identification
- Optimization recommendations
- Implementation priority
```

### 24. Fix TypeScript Errors

**Prompt**:
```
Fix all TypeScript errors in [file/directory]:
1. Run type check: pnpm tsc --noEmit
2. Identify root causes (not just `any` casts)
3. Update types in types/[module]/
4. Fix type imports and exports
5. Ensure zero `any` types (use proper generics)
6. Update Prisma types if needed
7. Verify no runtime behavior changes

Provide comprehensive type definitions and explanations.
```

---

## Architecture & Design Prompts

### 25. Design New Module Architecture

**Prompt**:
```
Design architecture for new [module-name] module:

Requirements:
- [List functional requirements]
- [List non-functional requirements: performance, scalability, security]

Provide:
1. Module structure (folders, files)
2. Database schema (Prisma)
3. API design (server actions)
4. Component hierarchy
5. State management strategy
6. Integration points with existing modules
7. Security considerations
8. Testing strategy
9. Deployment considerations
10. Migration plan if applicable

Follow WhizFlow architecture patterns and create architecture diagram.
```

### 26. Refactor Module Structure

**Prompt**:
```
Refactor [module] to follow vertical slice architecture:

Current issues:
- [List problems: coupling, unclear boundaries, testing difficulties]

Target structure:
[module]/
├── [feature-1]/
│   ├── _components/
│   ├── _view/
│   ├── page.tsx
│   └── [id]/page.tsx
├── _shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── layout.tsx

Provide:
1. Migration plan (file moves, import updates)
2. Breaking changes (if any)
3. Testing strategy during migration
4. Rollback plan
5. Step-by-step execution instructions
```

### 27. Design API Contract

**Prompt**:
```
Design API contract for [feature]:

Requirements:
- [List operations needed]
- [List data entities]

Provide:
1. Server action signatures with TypeScript types
2. Request/response schemas (Zod)
3. Error response format
4. Pagination strategy
5. Filtering/sorting options
6. Rate limiting rules
7. Authentication/authorization requirements
8. Caching strategy
9. API versioning approach
10. OpenAPI specification

Follow RESTful principles and WhizFlow patterns.
```

---

## Database & Schema Prompts

### 28. Design Database Schema

**Prompt**:
```
Design Prisma schema for [entity/feature]:

Requirements:
- [List data requirements]
- [List relationships]

Provide:
1. Prisma model definitions in prisma/schema/[module].prisma
2. Relationships (1:1, 1:N, N:M) with proper foreign keys
3. Indexes for query performance
4. Multi-tenant isolation strategy (tenantId, organizationId)
5. Soft delete support (deletedAt, deletedBy)
6. Audit fields (createdAt, updatedAt, createdBy, updatedBy)
7. Validation constraints
8. Migration script
9. Seed data for testing

Follow existing schema patterns (core.prisma, crm.prisma reference).
```

### 29. Optimize Database Queries

**Prompt**:
```
Optimize database queries for [feature]:
1. Identify N+1 query problems
2. Add missing indexes
3. Use select/include strategically
4. Implement query batching
5. Add database-level caching
6. Use connection pooling efficiently
7. Profile query performance

Provide:
- Query execution plans (EXPLAIN ANALYZE)
- Before/after performance metrics
- Index recommendations
- Prisma query optimizations
```

### 30. Create Database Migration

**Prompt**:
```
Create Prisma migration for [change]:

Changes needed:
- [List schema changes]

Steps:
1. Update schema in prisma/schema/[module].prisma
2. Generate migration: pnpm prisma migrate dev --name [descriptive-name]
3. Create data migration script if needed (in scripts/migrations/)
4. Test migration on development database
5. Provide rollback strategy
6. Document breaking changes (if any)
7. Update seed scripts if needed

Ensure backward compatibility with existing data.
```

---

## Advanced Prompts

### 31. Implement Real-Time Feature with WebSockets

**Prompt**:
```
Implement real-time [feature] using WebSockets:
1. Extend existing WebSocket infrastructure (hooks/use-websocket.ts)
2. Create WebSocket endpoint in app/api/ws/[feature]/route.ts
3. Implement event broadcasting
4. Handle connection lifecycle (connect, disconnect, reconnect)
5. Add authentication/authorization for WebSocket connections
6. Implement client-side hook: use[Feature]WebSocket
7. Handle offline/online transitions
8. Add rate limiting for WebSocket messages
9. Write integration tests

Use existing patterns and ensure graceful degradation.
```

### 32. Add Internationalization (i18n)

**Prompt**:
```
Add i18n support to [module/component]:
1. Extract hardcoded strings to i18n/locales/[lang]/[module].json
2. Use next-intl patterns from existing i18n setup
3. Support RTL languages (Arabic, Hebrew)
4. Format dates/numbers/currency based on locale
5. Add language switcher UI
6. Test with multiple languages
7. Update documentation

Support: English (en), Spanish (es), French (fr), German (de) - add more as needed.
```

### 33. Implement Feature Flags

**Prompt**:
```
Implement feature flags for [feature]:
1. Add flags to lib/feature-flags.ts
2. Create flag definitions with default values
3. Implement flag checks in components/actions
4. Add flag override UI in admin panel
5. Support user-based and organization-based flags
6. Add A/B testing capability
7. Implement flag analytics
8. Create migration plan (feature flag → permanent code)

Flags needed:
- enable[Feature]: boolean
- [feature]Variant: 'a' | 'b' (if A/B testing)
```

---

## GitHub Prompts Integration

### Pre-existing Prompts from `.github/prompts`

WhizFlow CMS has 29 specialized agent prompts. After comprehensive review, **20 prompts are highly useful** while 9 are redundant or have narrow use cases.

---

## Quick Reference: Top 20 Essential Prompts

### ⭐ **Tier 1: Core Development** (Use Daily)

| # | Prompt | Authority | Purpose |
|---|--------|-----------|---------|
| 1 | `plan-implementor` | ✅ Full Code | Autonomous plan execution with zero-confirmation |
| 2 | `developer` | ✅ Full Code | Full-stack feature implementation |
| 3 | `problem-solver` | ✅ Diagnostic + Fix | Debugging with UI/UX focus, regression prevention |
| 4 | `fix-my-project` | ✅ Comprehensive | Emergency project-wide fixes |
| 5 | `bug-fix` | ✅ Targeted Fixes | Systematic bug fixing with tests |
| 6 | `testers` | ✅ Test Code Only | Comprehensive QA (NOT production code) |

### 🚀 **Tier 2: Planning & Architecture** (Strategic)

| # | Prompt | Authority | Purpose |
|---|--------|-----------|---------|
| 7 | `implementation-plan` | ❌ No Code | Create detailed plans from requirements |
| 8 | `plan-review-and-update` | ❌ No Code | Review and optimize existing plans |
| 9 | `architect` | ❌ No Code | Design documents only (NEVER writes code) |
| 10 | `data-architect` | ✅ Database Code | Database schema and optimization |

### 🔧 **Tier 3: Specialized Domains** (As Needed)

| # | Prompt | Authority | Purpose |
|---|--------|-----------|---------|
| 11 | `ui-ux` | ✅ UI Code | UI components and user experience |
| 12 | `api-integration` | ✅ API Code | External APIs and microservices |
| 13 | `dev-ops-engineer` | ✅ Infrastructure | Deployment and CI/CD |
| 14 | `i18n-specialist` | ✅ i18n Code | Internationalization and localization |
| 15 | `security-compliance` | ✅ Security Code | Security audits and compliance |
| 16 | `performance-optimization` | ✅ Performance Code | Performance tuning and caching |

### 📊 **Tier 4: Analysis & Documentation** (Periodic)

| # | Prompt | Authority | Purpose |
|---|--------|-----------|---------|
| 17 | `code-auditor` | ❌ No Code | Bug discovery and quality audits |
| 18 | `ba` | ❌ No Code | Business analysis with web research |
| 19 | `documentation-knowledge` | ✅ Documentation | Technical documentation generation |
| 20 | `todo-manager` | ❌ No Code | Technical debt tracking |

---

## Detailed Usage Guide

### 1️⃣ **plan-implementor** - Autonomous Plan Execution

**File**: `.github/prompts/plan-implementor.prompt.md` (705 lines)

**When to Use**:
- You have a complete plan in `plan/in-progress/`
- Want ALL phases/tasks executed automatically
- Need hands-off implementation with status tracking
- Plan should move to `plan/completed/` when done

**Key Features**:
- ✅ FULL IMPLEMENTATION AUTHORITY
- Zero-confirmation execution ("WILL NEVER ask for permission")
- Designed for async GitHub Copilot coding agent
- Updates plan status after each task
- Runs tests and compilation checks
- Moves completed plans automatically

**Examples**:
```bash
# Basic usage
@plan-implementor implement plan/in-progress/refactor-email-module-1.md

# With GitHub Coding Agent (creates PR)
@plan-implementor implement plan/in-progress/refactor-email-module-1.md
#github-pull-request_copilot-coding-agent
```

---

### 2️⃣ **developer** - Full-Stack Feature Implementation

**File**: `.github/prompts/developer.prompt.md` (169 lines)

**When to Use**:
- Implement specific features or tasks
- Write production-ready code
- Create components, pages, server actions
- Need full-stack implementation (frontend + backend + tests)

**Key Features**:
- ✅ FULL CODE IMPLEMENTATION AUTHORITY
- Production-ready code with comprehensive tests
- React Server Components and Server Actions
- MCP integration for best practices

**Examples**:
```bash
@developer implement email threading feature with conversation view

@developer create department CRUD with multi-view support (table, tree, kanban)
```

---

### 3️⃣ **problem-solver** - Debugging Specialist

**File**: `.github/prompts/problem-solver.prompt.md` (1143 lines)

**When to Use**:
- Something is broken and you don't know why
- UI/UX issues (layout, responsive design, components)
- Runtime errors or bugs
- Need systematic debugging

**Key Features**:
- ✅ DIAGNOSTIC & FIX CODE AUTHORITY
- **Primary focus: UI/UX issues**
- **CRITICAL: Regression prevention** (validates no existing functionality broken)
- Root cause analysis
- Systematic investigation

**Examples**:
```bash
@problem-solver the email list is not rendering on mobile devices

@problem-solver department form validation is not working correctly
```

---

### 4️⃣ **fix-my-project** - Emergency Comprehensive Fixer

**File**: `.github/prompts/fix-my-project.prompt.md` (210 lines)

**When to Use**:
- Multiple issues across the project
- Emergency situation (build failing, app broken)
- Need comprehensive issue detection
- Want all critical issues fixed at once

**Key Features**:
- ✅ COMPREHENSIVE FIX AUTHORITY
- Scans entire project for issues
- Fixes critical bugs, security, performance problems
- Runs all quality checks (TypeScript, linting, tests)
- Provides detailed fix report

**Examples**:
```bash
@fix-my-project check and fix all issues in the email module

@fix-my-project emergency fix - production build is failing
```

---

### 5️⃣ **bug-fix** - Systematic Bug Fixing

**File**: `.github/prompts/bug-fix.prompt.md` (1925 lines)

**When to Use**:
- Have specific bugs identified (from code-auditor or reports)
- Need targeted, surgical fixes
- Want comprehensive test coverage for fixes

**Key Features**:
- ✅ BUG FIX CODE IMPLEMENTATION
- Targeted code fixes for root causes
- Error handling and recovery mechanisms
- Security patches and vulnerability fixes
- Comprehensive test cases for fixes

**Examples**:
```bash
@bug-fix resolve email attachment upload failing for files > 10MB

@bug-fix fix XSS vulnerability in email detail view
```

---

### 6️⃣ **testers** - Comprehensive QA Engineer

**File**: `.github/prompts/testers.prompt.md` (1782 lines)

**When to Use**:
- Write comprehensive test suites
- Create unit, integration, E2E tests
- Test accessibility and performance
- Bug reproduction and validation

**Key Features**:
- ✅ TEST CODE IMPLEMENTATION ONLY
- **NOT AUTHORIZED for production code**
- Unit, integration, E2E tests
- Accessibility and performance testing
- 80%+ coverage targets

**Examples**:
```bash
@testers create comprehensive test suite for email module

@testers write accessibility tests for department form
```

---

### 7️⃣ **implementation-plan** - Create Implementation Plans

**File**: `.github/prompts/implementation-plan.prompt.md` (696 lines)

**When to Use**:
- Create a new implementation plan from requirements
- Need structured, executable roadmaps
- Want industry best practices researched

**Key Features**:
- ❌ NO CODE IMPLEMENTATION
- Systematic codebase analysis
- Internet research for best practices
- Gap analysis (current vs desired state)
- Detailed task breakdowns with success criteria

**Examples**:
```bash
@implementation-plan create plan for implementing email threading and conversation grouping

@implementation-plan design plan for department hierarchy management
```

---

### 8️⃣ **plan-review-and-update** - Review Existing Plans

**File**: `.github/prompts/plan-review-and-update.prompt.md` (306 lines)

**When to Use**:
- Review existing plan relevance
- Check if tasks are still needed
- Update with new components/hooks/utilities
- Optimize remaining work

**Key Features**:
- ❌ NO CODE IMPLEMENTATION
- Codebase analysis using tools (semantic_search, file_search)
- Status assessment (marked vs actually implemented)
- Leverage Next.js MCP and Context7
- Update with new infrastructure

**Examples**:
```bash
@plan-review-and-update review plan/in-progress/refactor-email-module-1.md

@plan-review-and-update update plan/in-progress/department-refactor-1.md with new components
```

---

### 9️⃣ **architect** - Design Documents (NO CODE)

**File**: `.github/prompts/architect.prompt.md` (1262 lines)

**When to Use**:
- Design system architecture
- Create technical specifications
- Make architectural decisions
- Document design patterns
- **DO NOT use when you need code implementation**

**Key Features**:
- ❌ NO CODE IMPLEMENTATION (CRITICAL)
- **"NOT AUTHORIZED to write code/tests/implementations"**
- Creates technical design documents
- Designs architecture diagrams
- Writes implementation specifications

**Examples**:
```bash
@architect design architecture for email threading and conversation grouping

@architect create technical specification for department hierarchy system
```

---

### 🔟 **data-architect** - Database Schema Design

**File**: `.github/prompts/data-architect.prompt.md` (637 lines)

**When to Use**:
- Design database schemas
- Optimize database queries
- Multi-tenant data strategies
- Database migrations

**Key Features**:
- ✅ DATABASE & MIGRATION CODE IMPLEMENTATION
- Design and modify Prisma schemas
- Create database migrations
- Multi-tenant data isolation
- Query optimization and indexing
- MCP integration for database analysis

**Examples**:
```bash
@data-architect design schema for email threading with conversation relationships

@data-architect optimize department queries for hierarchical data
```

---

### 1️⃣1️⃣ **ui-ux** - UI Components and User Experience

**File**: `.github/prompts/ui-ux.prompt.md` (407 lines)

**When to Use**:
- UI/UX design and implementation
- Responsive design challenges
- Accessibility requirements
- Component library development

**Key Features**:
- ✅ UI/UX CODE IMPLEMENTATION
- Build reusable component library (shadcn/ui)
- Responsive design (Tailwind CSS)
- Accessibility features (ARIA attributes)
- MCP integration for shadcn/ui components

**Examples**:
```bash
@ui-ux create responsive email list component with accessibility features

@ui-ux design department kanban board with drag-and-drop
```

---

### 1️⃣2️⃣ **api-integration** - External APIs and Microservices

**File**: `.github/prompts/api-integration.prompt.md` (1031 lines)

**When to Use**:
- Integrate external APIs
- Build microservices
- Create webhook systems
- API architecture

**Key Features**:
- ✅ API & INTEGRATION CODE IMPLEMENTATION
- REST and GraphQL APIs
- Microservices communication
- Webhook handlers and event-driven architectures
- API gateways and message queues

**Examples**:
```bash
@api-integration integrate Gmail API for email sync and OAuth flow

@api-integration create webhook handler for Stripe payment events
```

---

### 1️⃣3️⃣ **dev-ops-engineer** - Deployment and Infrastructure

**File**: `.github/prompts/dev-ops-engineer.prompt.md` (137 lines)

**When to Use**:
- Deployment and infrastructure
- CI/CD pipeline setup
- Monitoring and alerting
- DevOps automation

**Key Features**:
- ✅ INFRASTRUCTURE CODE IMPLEMENTATION
- Docker configurations and CI/CD pipelines
- Monitoring and observability
- Security scanning
- Infrastructure as Code

**Examples**:
```bash
@dev-ops-engineer setup CI/CD pipeline with automated testing and deployment

@dev-ops-engineer configure monitoring and alerting for production
```

---

### 1️⃣4️⃣ **i18n-specialist** - Internationalization

**File**: `.github/prompts/i18n-specialist.prompt.md` (784 lines)

**When to Use**:
- Internationalization implementation
- Multi-language support
- RTL language support
- Cultural adaptations

**Key Features**:
- ✅ I18N & LOCALIZATION CODE IMPLEMENTATION
- Translation management systems
- Locale-specific formatting (dates, numbers, currency)
- RTL language support
- Dynamic language switching

**Examples**:
```bash
@i18n-specialist add Arabic language support with RTL layout

@i18n-specialist implement translation system for department module
```

---

### 1️⃣5️⃣ **security-compliance** - Security Audits

**File**: `.github/prompts/security-compliance.prompt.md` (708 lines)

**When to Use**:
- Security audits
- Compliance checks
- Vulnerability assessment
- Access control implementation

**Key Features**:
- ✅ SECURITY & COMPLIANCE CODE IMPLEMENTATION
- Authentication and authorization
- Access control policies (RBAC/ABAC)
- Compliance validation (GDPR, SOX)
- Security monitoring

**Examples**:
```bash
@security-compliance audit email module for security vulnerabilities and GDPR compliance

@security-compliance implement RBAC for department access control
```

---

### 1️⃣6️⃣ **performance-optimization** - Performance Tuning

**File**: `.github/prompts/performance-optimization.prompt.md` (1019 lines)

**When to Use**:
- Optimize performance
- Identify bottlenecks
- Implement caching
- Performance testing

**Key Features**:
- ✅ PERFORMANCE OPTIMIZATION CODE IMPLEMENTATION
- Caching strategies and invalidation
- Performance monitoring and profiling
- Code splitting and lazy loading
- Memory optimization

**Examples**:
```bash
@performance-optimization optimize email list rendering for 1000+ emails

@performance-optimization implement caching for department hierarchy queries
```

---

### 1️⃣7️⃣ **code-auditor** - Bug Discovery and Quality Audits

**File**: `.github/prompts/code-auditor.prompt.md` (892 lines)

**When to Use**:
- Code quality audits
- Proactive bug discovery
- Compliance checks
- Quality metrics

**Key Features**:
- ❌ NO CODE IMPLEMENTATION
- Comprehensive codebase inspection
- Bug identification and documentation
- Creates `docs/bugs/BUGS.md` file
- Security and performance analysis

**Examples**:
```bash
@code-auditor audit email module for potential bugs and code quality issues

@code-auditor scan department module for TypeScript errors and logical flaws
```

**⚠️ Relationship**: Discovers issues for `bug-fix` prompt to resolve

---

### 1️⃣8️⃣ **ba** - Business Analysis with Web Research

**File**: `.github/prompts/ba.prompt.md` (574 lines)

**When to Use**:
- Requirements analysis
- Business process understanding
- Web research for industry best practices
- Gap analysis

**Key Features**:
- ❌ NO CODE IMPLEMENTATION
- **Extensive web research capabilities** (market trends, competitors, regulations)
- Business Requirements Summary Documents (BRSD)
- Gap analysis (internal and external)
- Process flow documentation

**Examples**:
```bash
@ba analyze business requirements for email automation workflows

@ba research industry best practices for department hierarchy management
```

---

### 1️⃣9️⃣ **documentation-knowledge** - Technical Documentation

**File**: `.github/prompts/documentation-knowledge.prompt.md` (783 lines)

**When to Use**:
- Create documentation
- API docs
- User guides
- Knowledge management

**Key Features**:
- ✅ DOCUMENTATION CODE IMPLEMENTATION
- API documentation generation
- Technical and user documentation
- Knowledge base management
- Interactive learning experiences

**Examples**:
```bash
@documentation-knowledge create comprehensive documentation for email module API

@documentation-knowledge generate user guide for department management
```

---

### 2️⃣0️⃣ **todo-manager** - Technical Debt Tracking

**File**: `.github/prompts/todo-manager.prompt.md` (394 lines)

**When to Use**:
- Track technical debt
- Identify incomplete work
- Prioritize technical improvements
- Create action plans

**Key Features**:
- ❌ NO CODE IMPLEMENTATION
- TODO comment discovery
- Incomplete implementation detection
- Technical debt assessment
- Prioritized action plans

**Examples**:
```bash
@todo-manager scan codebase for TODO comments and incomplete implementations

@todo-manager analyze technical debt in department module
```

---

## ⚠️ Prompts to Avoid (9 Redundant/Narrow Use)

### Duplicates (Don't Use)
- ❌ `review-and-update-plan` - Use `plan-review-and-update` instead
- ❌ `task` - Use `task-dev` or `ba` instead

### Narrow Use Cases
- ⚠️ `tdd-dev` - Use `testers` for comprehensive testing
- ⚠️ `product-manager` - Use `ba` for broader business analysis
- ⚠️ `bi-analytics` - Use `data-architect` + `developer`
- ⚠️ `workflow-business-process` - Use `developer` + `ba`

### Special Purpose
- 🔵 `first-ask` - Requires Joyride extension
- 🔵 `ai-prompt-engineering-safety-review` - For reviewing AI prompts
- 🔵 `task-dev` - Requires task workflow (`docs/tasks/`)

---

## Recommended Workflows

### 🚀 **Workflow 1: Feature Development (Full Cycle)**
```bash
# 1. Requirements Analysis
@ba analyze requirements for email threading feature

# 2. Architecture Design
@architect design architecture for email threading

# 3. Database Schema
@data-architect design schema for conversation threading

# 4. Create Implementation Plan
@implementation-plan create plan from requirements and architecture

# 5. Execute Plan
@plan-implementor implement plan/in-progress/email-threading-1.md

# 6. Testing
@testers create comprehensive test suite for email threading

# 7. Documentation
@documentation-knowledge document email threading feature
```

---

### ⚡ **Workflow 2: Quick Feature Implementation**
```bash
# Direct implementation without formal plan
@developer implement email threading feature with conversation view

# Add tests
@testers create tests for email threading

# Document
@documentation-knowledge document email threading API
```

---

### 🐛 **Workflow 3: Bug Fixing**
```bash
# 1. Audit for issues
@code-auditor audit email module for bugs

# 2. Debug specific issue
@problem-solver email attachments failing for files > 10MB

# 3. Fix systematically
@bug-fix resolve email attachment size limit issue

# 4. Test
@testers create regression tests for email attachments
```

---

### 🚨 **Workflow 4: Emergency Fix**
```bash
# Comprehensive project fix
@fix-my-project check and fix all issues in email module
```

---

### 📋 **Workflow 5: Plan Execution**
```bash
# 1. Review plan
@plan-review-and-update review plan/in-progress/refactor-email-1.md

# 2. Execute plan
@plan-implementor implement plan/in-progress/refactor-email-1.md
```

---

### 🔒 **Workflow 6: Security Hardening**
```bash
# 1. Security audit
@security-compliance audit for vulnerabilities

# 2. Analyze issues
@problem-solver analyze each security issue

# 3. Implement fixes
@developer implement security fixes

# 4. Create security tests
@testers create security test suite

# 5. Verify resolution
@code-auditor verify all issues resolved
```

---

## Authority Level Summary

### ✅ Full Code Implementation
- `plan-implementor` (zero-confirmation)
- `developer`
- `bug-fix`
- `ui-ux`
- `api-integration`
- `dev-ops-engineer`
- `i18n-specialist`
- `security-compliance`
- `performance-optimization`
- `data-architect`
- `documentation-knowledge`

### ✅ Limited Code Authority
- `testers` - Test code only (NOT production code)
- `problem-solver` - Diagnostic + fix code (UI/UX focus)
- `fix-my-project` - Comprehensive fixes

### ❌ No Code Authority (Analysis/Documentation Only)
- `architect` (design docs only)
- `implementation-plan`
- `plan-review-and-update`
- `ba` (Business Analyst)
- `code-auditor`
- `todo-manager`

---

## Quick Decision Tree

**Need to implement a feature?**
- → `developer` for direct implementation
- → `implementation-plan` → `plan-implementor` for complex features

**Something is broken?**
- → `problem-solver` for debugging + UI/UX issues
- → `bug-fix` for known bugs
- → `fix-my-project` for emergency comprehensive fixes

**Need tests?**
- → `testers` (comprehensive QA)

**Need architecture?**
- → `architect` for design docs (NO CODE)
- → `data-architect` for database design (WITH CODE)

**Need analysis?**
- → `ba` for business requirements + web research
- → `code-auditor` for bug discovery
- → `todo-manager` for technical debt tracking

**Specialized needs?**
- → `ui-ux` for UI components
- → `api-integration` for external APIs
- → `dev-ops-engineer` for deployment
- → `i18n-specialist` for internationalization
- → `security-compliance` for security audits
- → `performance-optimization` for performance tuning

---

## Prompt Best Practices

### Guidelines for Effective Prompts

1. **Be Specific**: Reference exact file paths, line numbers, and requirements
2. **Provide Context**: Include relevant background, constraints, and existing patterns
3. **Set Clear Goals**: Define success criteria and expected outcomes
4. **Reference Standards**: Point to WhizFlow architecture docs and existing examples
5. **Request Testing**: Always include test requirements
6. **Ask for Alternatives**: Request multiple solution approaches with tradeoffs
7. **Incremental Changes**: Break large changes into smaller, manageable tasks

### Prompt Template Structure

```
[Action Verb] [Target] [Context]:

Requirements:
- [List specific requirements]
- [Reference existing patterns/files]
- [Note constraints]

Provide:
1. [Deliverable 1]
2. [Deliverable 2]
3. [Tests]
4. [Documentation]

Success Criteria:
- [Measurable outcome 1]
- [Measurable outcome 2]
```

---

## Quick Reference Commands

### Common Development Tasks

```bash
# Type checking
pnpm tsc --noEmit

# Run tests
pnpm test
pnpm test:coverage

# Code quality
pnpm quality-check

# Database operations
pnpm db:reset
pnpm db:fresh
pnpm db:seed

# Development
pnpm dev

# Build
pnpm build
```

### File Search Patterns

```
# Server actions
actions/**/*.action.ts

# Components
app/**/[module]/_components/**
components/**

# Types
types/**/[module]/**

# Tests
__tests__/**/*.test.tsx
```

---

## Related Documentation

- [Architecture Guidelines](.github/instructions/architect.instructions.md)
- [Next.js Patterns](.github/instructions/nextjs.instructions.md)
- [UI/UX Standards](.github/instructions/ui-ux.instructions.md)
- [Authentication](.github/instructions/auth-js.instructions.md)
- [Database Patterns](.github/instructions/database-prisma.instructions.md)
- [Testing Guidelines](.github/instructions/test-case.instructions.md)

---

## Maintenance

**Update Frequency**: Monthly or when major patterns change  
**Owner**: Engineering Team  
**Review Process**: PR review required for prompt additions/changes

**Contribution Guidelines**:
1. Test prompts thoroughly before adding
2. Include realistic examples
3. Reference existing code patterns
4. Update table of contents
5. Follow markdown formatting standards

---

**Last Review**: October 28, 2025  
**Next Review**: November 28, 2025
