// GitHub Sync Layer
// Agentic owns code review workflow. GitHub = mirror only.

export class GitHubSync {
  async pull(): Promise<void> {
    // Fetch PRs, issues → Agentic tasks
    // If GitHub down: work from local queue
  }

  async push(): Promise<void> {
    // Push approved changes, create PRs
    // If GitHub down: stage locally, sync when up
  }
}
