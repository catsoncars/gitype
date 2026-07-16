import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

export interface RepoTreeEntry {
  path: string;
  sha: string;
  size?: number;
}

@Injectable()
export class GithubClientService {
  private readonly octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  /** The commit sha at the tip of the repo's default branch — pinned onto every Snippet from this ingestion run. */
  async getDefaultBranchCommitSha(
    owner: string,
    repo: string,
  ): Promise<string> {
    const { data: repoData } = await this.octokit.rest.repos.get({
      owner,
      repo,
    });
    const { data: ref } = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${repoData.default_branch}`,
    });
    return ref.object.sha;
  }

  async getTree(
    owner: string,
    repo: string,
    commitSha: string,
  ): Promise<RepoTreeEntry[]> {
    const { data } = await this.octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: commitSha,
      recursive: '1',
    });
    return data.tree
      .filter(
        (entry): entry is typeof entry & { path: string; sha: string } =>
          entry.type === 'blob' && !!entry.path && !!entry.sha,
      )
      .map((entry) => ({ path: entry.path, sha: entry.sha, size: entry.size }));
  }

  async getBlobContent(
    owner: string,
    repo: string,
    blobSha: string,
  ): Promise<string> {
    const { data } = await this.octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: blobSha,
    });
    return Buffer.from(data.content, data.encoding as BufferEncoding).toString(
      'utf-8',
    );
  }
}
