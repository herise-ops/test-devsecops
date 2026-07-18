# Snyk Scanner Test Project

**Purpose:** A deliberately vulnerable sample project to validate that your
Snyk + GitHub Actions pipeline correctly detects and surfaces issues across
all four scanner types (SCA, SAST, Container, IaC). This is for testing
only — do not deploy, run, or use any of this code in production.

## What's in here and what each part should trigger

| File | Scanner | Expected findings |
|---|---|---|
| `package.json` | **SCA** (`snyk-sca` job) | Known CVEs in outdated `lodash`, `axios`, `express`, `minimist`, `jsonwebtoken`, `node-fetch` |
| `src/UserProfile.tsx` | **SAST** (`snyk-code` job) | Hardcoded secret, XSS via `dangerouslySetInnerHTML`, SQL injection pattern, use of `eval`, insecure randomness, SSRF-prone fetch |
| `Dockerfile` | **Container** (`snyk-container` job) | Outdated base image (`node:14`), hardcoded secret in image layer, `ADD` instead of `COPY`, missing non-root `USER` |
| `terraform/main.tf` | **IaC** (`snyk-iac` job) | Open security group (0.0.0.0/0), public S3 bucket, unencrypted/public RDS instance with hardcoded password, overly permissive IAM policy |

## How to use

1. Push this project into its own test repo (or a `snyk-test/` folder in an
   existing repo where your `snyk.yml` workflow already lives).
2. Let the workflow run on push/PR.
3. Check:
   - The Actions run logs for each of the four jobs
   - **Security → Code scanning alerts** in the repo, filtered by category
     (`snyk-sca`, `snyk-code`, `snyk-container`, `snyk-iac`) to confirm all
     four are reporting
   - The Snyk dashboard (`app.snyk.io`) for the same findings

## Cleanup

Once you've confirmed the pipeline works end-to-end, delete this repo/folder
or replace it with your real project. Nothing here should be merged into
`master` of a real application or deployed anywhere.
