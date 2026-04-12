import { directGitHub } from './direct-github.js';

export class GitHubHybridIntegration {
  async getRepo(owner: string, repo: string): Promise<any> {
    try {
      return await directGitHub.getRepo(owner, repo);
    } catch (err) {
      console.log('[GITHUB] API failed, using cache');
      return null;
    }
  }

  async listPulls(owner: string, repo: string, state: string = 'open'): Promise<any[]> {
    try {
      return await directGitHub.listPulls(owner, repo, state);
    } catch (err) {
      console.log('[GITHUB] API failed');
      return [];
    }
  }
}

export const hybridGitHub = new GitHubHybridIntegration();
