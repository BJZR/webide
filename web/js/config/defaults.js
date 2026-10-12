export const STORAGE_KEY = 'webide.project';
export const BACKUP_KEY = 'webide.backups';
export const RECENTS_KEY = 'webide.recents';
export const PROXY_ORIGIN = 'http://127.0.0.1:3001';

export const PROVIDER_PRESETS = {
  ollama: 'http://localhost:11434',
  llamacpp: 'http://localhost:8080/v1',
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com',
  gemini: 'https://generativelanguage.googleapis.com',
  custom: '',
};

export const PROVIDER_MODELS = {
  ollama: 'llama3.1', anthropic: 'claude-sonnet-4-6', openai: 'gpt-4o', gemini: 'gemini-2.5-flash',
};

export const RUNTIME_STATE = {
  busy: false, workspace: false, workspacePath: null, dirty: [], splitActive: null, term: '',
  layout: { sidebar: true, terminal: false, chat: true, split: false, browser: false },
};

export const DEFAULT_STATE = {
  files: {
    'README.md': '# Mi proyecto\n',
    'src/main.js': "console.log('hola');\n",
  },
  open: ['README.md', 'src/main.js'],
  active: 'src/main.js',
  settings: { provider: 'ollama', url: PROVIDER_PRESETS.ollama, model: 'llama3.1', key: '' },
  chat: [],
};
