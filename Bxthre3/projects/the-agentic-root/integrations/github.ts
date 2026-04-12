// GitHub integration using direct API
// Primary integration - no Zo wrapper

export interface PullRequest {
  number: number;
  title: string;
  author: string;
  state: string;
  createdAt: string;
}

export class GitHubIntegration {
  private token: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
  }

  async listPulls(owner: string, repo: string, state: string = 'open'): Promise<PullRequest[]> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    return data.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      state: pr.state,
      createdAt: pr.created_at
    }));
  }
}

export const githubIntegration = new GitHubIntegration();
