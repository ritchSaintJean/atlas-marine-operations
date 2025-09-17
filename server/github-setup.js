import { Octokit } from '@octokit/rest'

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Create GitHub repository for Atlas Marine Group
async function createAtlasMarineRepo() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get current user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log('Connected as:', user.login);
    
    // Create repository
    const repoData = {
      name: 'atlas-marine-operations',
      description: 'Comprehensive operational management system for Atlas Marine Group - Equipment tracking, maintenance scheduling, safety compliance, inventory management, and personnel certification tracking.',
      private: false, // Set to true if you want it private
      has_issues: true,
      has_wiki: true,
      has_projects: true,
      auto_init: false // We'll push existing code
    };
    
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser(repoData);
    
    console.log('Repository created successfully!');
    console.log('Repository URL:', repo.html_url);
    console.log('Clone URL:', repo.clone_url);
    console.log('SSH URL:', repo.ssh_url);
    
    return repo;
  } catch (error) {
    if (error.status === 422 && error.message.includes('already exists')) {
      console.log('Repository already exists. Fetching existing repository...');
      const octokit = await getUncachableGitHubClient();
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const { data: repo } = await octokit.rest.repos.get({
        owner: user.login,
        repo: 'atlas-marine-operations'
      });
      console.log('Existing repository URL:', repo.html_url);
      return repo;
    } else {
      console.error('Error creating repository:', error);
      throw error;
    }
  }
}

// Initialize git and push to GitHub
async function setupGitRepository(repo) {
  try {
    console.log('Setting up local git repository...');
    
    // Note: In a real environment, you would run these git commands
    console.log('To complete the setup, run these commands in your terminal:');
    console.log('');
    console.log('git init');
    console.log('git add .');
    console.log('git commit -m "Initial commit: Atlas Marine Group operational management system"');
    console.log(`git remote add origin ${repo.clone_url}`);
    console.log('git branch -M main');
    console.log('git push -u origin main');
    console.log('');
    console.log('Repository setup complete!');
    
  } catch (error) {
    console.error('Error setting up git repository:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Creating Atlas Marine Group operational management repository...');
    const repo = await createAtlasMarineRepo();
    await setupGitRepository(repo);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createAtlasMarineRepo, setupGitRepository };