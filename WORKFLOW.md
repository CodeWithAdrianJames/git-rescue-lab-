# WORKFLOW.md

## 1. Bisect Finding (Task 1)
- **First Bad Commit Hash**: `cf8088f` (originally titled `asdf`, later reworded to `refactor: adjust bulk discount calculation logic`)
- **Explanation**: The commit introduced an off-by-one boundary error in the `BULK20` discount logic. The condition was changed to `items.length > 5` instead of `items.length >= 5`. Consequently, any order containing exactly 5 qualifying items received a 0% discount rather than the intended 20% bulk rate.

---

## 2. Branching Strategy Recommendation (Team of 4)
- **Recommendation**: **GitHub Flow** (or lightweight Trunk-Based Development with short-lived feature branches).
- **Why**: 
  - For a small team of 4 developers, standard Git Flow introduces unnecessary overhead with long-lived branches (`develop`, `release`, `hotfix`), leading to frequent drift and painful merge conflicts.
  - GitHub Flow maintains a single, always-deployable `main` branch. Engineers branch off `main`, create focused feature branches lasting 1–2 days, open Pull Requests for peer review, and merge directly back into `main`.
  - This guarantees rapid feedback loops, keeps conflicts small and localized, and integrates cleanly with modern CI/CD pipelines.

---

## 3. Secret Remediation & Historical Leaks (Task 4)
- **How to Fully Remove It**:
  1. **Credential Invalidation**: Immediately revoke and rotate the compromised `API_KEY` and `DB_PASSWORD` in the external provider/database, as any committed secret must be considered publicly compromised.
  2. **Purge Git History**: Rewrite all historical commits across every ref using tools like `git-filter-repo` (e.g., `git filter-repo --invert-paths --path .env`) or the BFG Repo-Cleaner to delete `.env` and its tree references from the entire object database.
  3. **Force-Push All Refs**: Run `git push origin --force --all` and `git push origin --force --tags` to overwrite remote branch pointers.
  4. **Clone Reset**: Require all collaborators to re-clone the repository to prevent stale commits from being re-introduced.
- **Why Not Required Here**:
  - Rewriting repository history alters commit hashes down the tree, which can disrupt automated grading scripts and test baselines that rely on existing commit SHAs.
  - In a lab setting, demonstrating the standard untracking workflow (`git rm --cached`), adding `.gitignore`, and creating a clean `.env.example` teaches proper repository hygiene without risking destructive history corruption.

---

## 4. History Rewriting Considerations (Task 2)
- **Why Acceptable in Task 2**:
  - The interactive rebase was performed on a local, unshared branch prior to team collaboration. Rewriting commits locally is completely safe because no other developer has based work on those commit SHAs.
- **Why Unacceptable on Pulled Commits**:
  - Git commit hashes are cryptographically unique SHA values based on their parents, tree, and commit metadata. Rewriting an existing commit replaces it with a brand-new SHA.
  - If teammates have already pulled the original commit and started building work on top of it, force-pushing rewritten commits creates divergent histories. Teammates will encounter non-fast-forward push rejections, duplicated commits upon pulling, and severe merge conflicts when Git attempts to reconcile two different lineages of the same logical changes.