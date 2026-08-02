/* Storage JS - Data persistence and default state seeding */

(function () {
  const STORAGE_PREFIX = 'devtrack_';

  const defaultProfile = {
    name: 'Jitendra Dhamdhere',
    role: '',
    avatar: 'JD',
    dailyTargetHours: 0,
    studyStreak: 0,
    githubGoal: 0,
    createdAt: new Date().toISOString()
  };

  const defaultStudySessions = [];

  const defaultNotes = [];

  const defaultTasks = [];

  const defaultRoadmap = {
    'java_basics': false,
    'oop': false,
    'collections': false,
    'generics': false,
    'exception_handling': false,
    'streams': false,
    'lambda': false,
    'multithreading': false,
    'concurrency': false,
    'jvm_internals': false,
    'spring_core': false,
    'ioc_di': false,
    'spring_mvc': false,
    'jpa_hibernate': false,
    'spring_security': false,
    'rest_api': false,
    'microservices': false,
    'docker': false,
    'kubernetes': false,
    'aws_basics': false,
    'system_design_lld': false,
    'system_design_hld': false
  };

  const defaultTrackers = {
    java: {
      basics: false, oop: false, collections: false, generics: false, exceptions: false,
      streams: false, lambdas: false, multithreading: false, executor: false,
      concurrency: false, jvm: false, memory: false, gc: false, reflection: false,
      annotations: false, serialization: false, design_patterns: false
    },
    spring: {
      core: false, ioc: false, di: false, mvc: false, rest: false, validation: false,
      jpa: false, security: false, jwt: false, redis: false, microservices: false,
      gateway: false, eureka: false, feign: false, rabbitmq: false, kafka: false,
      docker: false, testing: false, actuator: false, swagger: false
    },
    mysql: {
      ddl: false, dml: false, constraints: false, joins: false, views: false,
      indexes: false, normalization: false, transactions: false, procedures: false,
      triggers: false, tuning: false, backup: false, replication: false
    },
    dsa: {
      arrays: { easy: 0, medium: 0, hard: 0, target: 40, completed: false },
      strings: { easy: 0, medium: 0, hard: 0, target: 30, completed: false },
      linkedlist: { easy: 0, medium: 0, hard: 0, target: 20, completed: false },
      stacks_queues: { easy: 0, medium: 0, hard: 0, target: 20, completed: false },
      trees: { easy: 0, medium: 0, hard: 0, target: 35, completed: false },
      graphs: { easy: 0, medium: 0, hard: 0, target: 25, completed: false },
      binary_search: { easy: 0, medium: 0, hard: 0, target: 25, completed: false },
      sorting: { easy: 0, medium: 0, hard: 0, target: 20, completed: false },
      greedy: { easy: 0, medium: 0, hard: 0, target: 25, completed: false },
      dp: { easy: 0, medium: 0, hard: 0, target: 30, completed: false },
      recursion: { easy: 0, medium: 0, hard: 0, target: 20, completed: false },
      sliding_window: { easy: 0, medium: 0, hard: 0, target: 15, completed: false }
    }
  };

  const defaultProjects = [];

  const defaultResumes = [];

  const defaultInterviews = [];

  const defaultJobs = [];

  const defaultHabits = {};

  const defaultCertifications = [];

  const defaultDailyPlanner = {
    date: new Date().toISOString().split('T')[0],
    morningGoals: '',
    todayGoals: '',
    eveningReview: '',
    tomorrowPlan: '',
    wins: '',
    mistakes: '',
    improvements: ''
  };

  const defaultState = {
    profile: defaultProfile,
    study_sessions: defaultStudySessions,
    notes: defaultNotes,
    tasks: defaultTasks,
    roadmap: defaultRoadmap,
    trackers: defaultTrackers,
    projects: defaultProjects,
    resumes: defaultResumes,
    interviews: defaultInterviews,
    jobs: defaultJobs,
    habits: defaultHabits,
    certifications: defaultCertifications,
    daily_planner: defaultDailyPlanner
  };

  let syncTimeout = null;
  let isSyncing = false;

  function scheduleSyncPush() {
    if (isSyncing) return;
    const settings = window.StorageService.getSyncSettings();
    if (!settings || !settings.pat) return;

    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      window.StorageService.syncPush()
        .then(() => {
          if (window.Utils && typeof window.Utils.showToast === 'function') {
            window.Utils.showToast('Cloud Synced', 'Your updates are saved to GitHub Gist.', 'success');
          }
        })
        .catch(err => {
          console.error('Auto-sync failed', err);
          if (window.Utils && typeof window.Utils.showToast === 'function') {
            window.Utils.showToast('Sync Failed', 'Could not sync updates to GitHub.', 'danger');
          }
        });
    }, 5000);
  }

  // Storage Methods
  window.StorageService = {
    get: function (key) {
      try {
        const val = localStorage.getItem(STORAGE_PREFIX + key);
        return val ? JSON.parse(val) : null;
      } catch (e) {
        console.error('Error reading from local storage', e);
        return null;
      }
    },

    set: function (key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        if (key !== 'sync_pat' && key !== 'sync_gist_id') {
          scheduleSyncPush();
        }
      } catch (e) {
        console.error('Error saving to local storage', e);
        if (window.Utils && typeof window.Utils.showToast === 'function') {
          window.Utils.showToast('Storage Error', 'Failed to save data. Local storage might be full or private browsing may restrict saving.', 'danger');
        } else {
          alert('Storage Error: Failed to save data. Local storage might be full or private browsing may restrict saving.');
        }
      }
    },

    initialize: function () {
      const clearFlag = localStorage.getItem('devtrack_empty_cleared_v1');
      if (!clearFlag) {
        console.log('Purging mock data and seeding clean empty state...');
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        }
        localStorage.setItem('devtrack_empty_cleared_v1', 'true');
      }

      // Check if profile exists, if not, write defaults
      const existingProfile = this.get('profile');
      if (!existingProfile) {
        console.log('Seeding initial clean developer profile and empty data...');
        for (const [key, value] of Object.entries(defaultState)) {
          this.set(key, value);
        }
      }
    },

    exportData: function () {
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const rawKey = localStorage.key(i);
        if (rawKey.startsWith(STORAGE_PREFIX)) {
          const key = rawKey.substring(STORAGE_PREFIX.length);
          if (key !== 'sync_pat' && key !== 'sync_gist_id') {
            dump[key] = this.get(key);
          }
        }
      }
      return JSON.stringify(dump, null, 2);
    },

    importData: function (jsonStr) {
      try {
        const data = JSON.parse(jsonStr);
        for (const [key, value] of Object.entries(data)) {
          this.set(key, value);
        }
        return true;
      } catch (e) {
        console.error('Failed to parse import data', e);
        return false;
      }
    },

    resetAll: function () {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const rawKey = localStorage.key(i);
        if (rawKey.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(rawKey);
        }
      }
      this.initialize();
    },

    saveSyncSettings: function (pat, gistId) {
      this.set('sync_pat', pat);
      this.set('sync_gist_id', gistId || '');
    },

    getSyncSettings: function () {
      return {
        pat: this.get('sync_pat') || '',
        gistId: this.get('sync_gist_id') || ''
      };
    },

    isSyncEnabled: function () {
      const settings = this.getSyncSettings();
      return !!settings.pat;
    },

    syncPush: async function () {
      const settings = this.getSyncSettings();
      if (!settings.pat) throw new Error('No GitHub Personal Access Token configured.');

      const dump = this.exportData();
      const payload = {
        description: 'DevTrack Pro Dashboard Data Backup',
        public: false,
        files: {
          'devtrack_pro_backup.json': {
            content: dump
          }
        }
      };

      const headers = {
        'Authorization': `token ${settings.pat}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      if (settings.gistId) {
        // Update existing Gist
        const res = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          if (res.status === 404) {
            // Gist was deleted, create a new one instead
            this.set('sync_gist_id', '');
            return this.syncPush();
          }
          throw new Error(`GitHub Gist update failed: ${res.statusText}`);
        }
      } else {
        // Create new private Gist
        const res = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`GitHub Gist creation failed: ${res.statusText}`);
        const data = await res.json();
        this.set('sync_gist_id', data.id);
      }
    },

    syncPull: async function () {
      const settings = this.getSyncSettings();
      if (!settings.pat) throw new Error('No GitHub Personal Access Token configured.');
      if (!settings.gistId) throw new Error('No Gist ID configured yet. Try pushing data first.');

      const headers = {
        'Authorization': `token ${settings.pat}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      const res = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
        method: 'GET',
        headers: headers
      });
      if (!res.ok) throw new Error(`GitHub Gist fetch failed: ${res.statusText}`);

      const data = await res.json();
      const backupFile = data.files['devtrack_pro_backup.json'];
      if (!backupFile) throw new Error('Could not find devtrack_pro_backup.json in the specified Gist.');

      isSyncing = true;
      try {
        this.importData(backupFile.content);
      } finally {
        isSyncing = false;
      }
    }
  };

  // Run initialization
  window.StorageService.initialize();
})();
