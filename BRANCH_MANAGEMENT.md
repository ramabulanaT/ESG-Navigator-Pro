# Branch Management & Investor Communication Guidelines

## ⚠️ Non-Investor-Facing Branches

The following branches and their contents should **NOT** be promoted or shared with investors:

### 1. ❌ PowerShell Deployment Scripts (Current Production)

**Branch Pattern:** `**/deploy-*`, `**/fix-*`, branches containing `.ps1` files

**Examples:**
- `esg-navigator/deploy-production.ps1`
- `esg-navigator/fix-complete.ps1`
- `esg-navigator/scripts/deploy-verify.ps1`
- `esg-navigator/scripts/next-fix-conflicts.ps1`
- `esg-navigator/scripts/verify-after-deploy.ps1`
- `esg-navigator/scripts/fix-next-build.ps1`

**Reason:** These are operational scripts for internal deployment workflows. They may contain:
- Temporary fixes and workarounds
- Internal server paths and configurations
- Debugging and diagnostic code
- Production credentials or references
- Work-in-progress solutions

**Status:** Production-critical but not suitable for external visibility.

---

### 2. ❌ Branch Cleanup Automation

**Branch Pattern:** `**/cleanup-*`, `**/maintenance-*`, automation scripts

**Reason:** Internal repository maintenance activities including:
- Automated branch pruning
- Git history cleanup
- Deprecated code removal
- Development workflow automation

**Status:** Infrastructure maintenance - internal operations only.

---

### 3. ❌ Infrastructure Configuration Branches

**Branch Pattern:** `infrastructure/*`, `config/*`, `**/docker-compose.*`

**Examples:**
- Infrastructure configuration files
- Docker compose files (especially backups)
- Server provisioning scripts
- Environment-specific configurations
- SSL certificate management scripts

**Reason:** These contain:
- Internal architecture decisions
- Security configurations
- Server topology information
- Backup and recovery procedures
- Network configurations

**Status:** Critical infrastructure - security-sensitive, not for external sharing.

---

## ✅ Investor-Appropriate Content

The following ARE suitable for investor presentations:

### Feature Branches
- New product features
- UI/UX improvements
- Customer-facing functionality
- Performance enhancements

### Documentation
- Product roadmaps
- Architecture overviews (high-level)
- API documentation
- User guides

### Analytics & Metrics
- Usage statistics
- Growth metrics
- Performance benchmarks
- Customer success stories

---

## Guidelines for Branch Naming

### Internal Use Only (NOT for investors)
```
fix/*
deploy/*
infrastructure/*
config/*
cleanup/*
scripts/*
temp/*
debug/*
```

### Investor-Appropriate
```
feature/*
enhancement/*
product/*
ui/*
docs/*
release/*
```

---

## Best Practices

1. **Separate Concerns:** Keep infrastructure and deployment code in separate repositories or clearly marked branches

2. **Documentation:** Maintain two levels of documentation:
   - **Internal:** Full technical details, including infrastructure
   - **External:** Product-focused, customer-value oriented

3. **Branch Protection:** Consider making internal branches private or restricting access

4. **Communication:** When presenting to investors:
   - Focus on product features and business value
   - Avoid technical implementation details
   - Emphasize outcomes, not processes

5. **Security:** Never share:
   - Credentials or API keys
   - Server configurations
   - Internal IP addresses or topology
   - Security patches or vulnerability fixes

---

## Review Checklist

Before sharing any branch or content with investors, verify:

- [ ] No deployment scripts or automation code
- [ ] No infrastructure configuration details
- [ ] No security-related fixes or patches
- [ ] No internal server references
- [ ] No temporary fixes or workarounds
- [ ] Content focuses on product value, not implementation
- [ ] Documentation is customer-oriented, not developer-oriented

---

## Questions?

If uncertain whether content is investor-appropriate, ask:
1. Does this show product value or technical implementation?
2. Could this reveal security vulnerabilities?
3. Would customers care about this, or is it internal operations?
4. Is this about what we built, or how our infrastructure works?

**Rule of thumb:** If it's in the `.ps1`, `docker-compose.yml`, or `infrastructure/` directories, it's NOT for investors.

---

**Last Updated:** 2025-11-27
**Maintained By:** Development Team
**Classification:** Internal Use Only
