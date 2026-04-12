export class DirectGitHubIntegration {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getRepo(owner: string, repo: string): Promise<any> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.json();
  }

  async listPulls(owner: string, repo: string, state: string = 'open'): Promise<any[]> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.json();
  }
}

export const directGitHub = new DirectGitHubIntegration(
  process.env.GITHUB_TOKEN || ''
);
