/* Storage JS - Data persistence and default state seeding */

(function () {
  const STORAGE_PREFIX = 'devtrack_';

  const defaultProfile = {
    name: 'Alex Mercer',
    role: 'Java Backend Developer (2+ YOE)',
    avatar: 'AM',
    dailyTargetHours: 4,
    studyStreak: 12,
    githubGoal: 3, /* Commits per day */
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  const defaultStudySessions = [
    {
      id: 'session_1',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      duration: 120, /* minutes */
      topic: 'Multithreading & Concurrency',
      description: 'Studied thread pools, ExecutorService, and ForkJoinPool. Wrote example codes for Producer-Consumer problem.',
      category: 'Java',
      difficulty: 'Hard',
      priority: 'High',
      completed: true
    },
    {
      id: 'session_2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '09:00',
      duration: 90,
      topic: 'Spring Security Filter Chains',
      description: 'Understood standard filters, UsernamePasswordAuthenticationFilter, and JWT token authentication integration.',
      category: 'Spring Security',
      difficulty: 'Medium',
      priority: 'High',
      completed: true
    },
    {
      id: 'session_3',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '14:30',
      duration: 60,
      topic: 'MySQL Indexes & Query Tuning',
      description: 'Learned about B+ Trees, clustering index, composite indexes, and analyzed queries with EXPLAIN.',
      category: 'MySQL',
      difficulty: 'Medium',
      priority: 'Medium',
      completed: true
    },
    {
      id: 'session_4',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:30',
      duration: 150,
      topic: 'Microservices Communication',
      description: 'Wrote Feign Client wrappers, set up Eureka Discovery Server, and configured Resilience4j Circuit Breakers.',
      category: 'Microservices',
      difficulty: 'Hard',
      priority: 'High',
      completed: true
    }
  ];

  const defaultNotes = [
    {
      id: 'note_1',
      title: 'Java Streams API Cheat Sheet',
      category: 'Java',
      tags: ['streams', 'lambda', 'functional'],
      content: '# Java Streams API Reference\n\nStreams represent a sequence of elements supporting sequential and parallel aggregate operations.\n\n### Core Operations\n* **Intermediate**: `filter()`, `map()`, `flatMap()`, `distinct()`, `sorted()`, `limit()`, `skip()`\n* **Terminal**: `forEach()`, `toArray()`, `reduce()`, `collect()`, `min()`, `max()`, `count()`, `anyMatch()`, `allMatch()`\n\n### Example: Map and Filter\n```java\nList<String> results = list.stream()\n    .filter(s -> s.startsWith("A"))\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());\n```',
      favorite: true,
      pinned: true,
      archived: false,
      color: '#3b82f6',
      dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dateModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'note_2',
      title: 'Spring Boot Main Annotations',
      category: 'Spring',
      tags: ['spring-boot', 'dependency-injection', 'ioc'],
      content: '# Key Spring Boot Annotations\n\nEssential annotations for daily Backend Java development:\n\n* `@SpringBootApplication`: Configures component scanning, autoconfiguration, and property support.\n* `@RestController`: Combines `@Controller` and `@ResponseBody` - outputs JSON data structures.\n* `@Autowired`: Marks dependencies to be resolved and injected by the Spring container.\n* `@Service`: Stereotype for service layer classes, houses business logic rules.\n* `@Repository`: Stereotype for database accessing layers, handles translations of platform exceptions.',
      favorite: false,
      pinned: true,
      archived: false,
      color: '#8b5cf6',
      dateCreated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      dateModified: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'note_3',
      title: 'System Design - Rate Limiting',
      category: 'System Design',
      tags: ['system-design', 'hld', 'redis'],
      content: '# Rate Limiting Algorithms\n\nUsed to control rate of traffic sent or received by a network interface.\n\n1. **Token Bucket**: Fixed capacity, refilled at constant intervals. Fast and handles bursts.\n2. **Leaky Bucket**: FIFO queue with a constant leak rate. Smoothes out traffic spikes.\n3. **Fixed Window Counter**: Divides timeline into windows. Simple but prone to traffic spikes at window edges.\n4. **Sliding Window Log**: Stores log timestamps. High memory usage.\n5. **Sliding Window Counter**: Hybrid of fixed window and sliding log. Low memory, highly accurate.',
      favorite: true,
      pinned: false,
      archived: false,
      color: '#06b6d4',
      dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      dateModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const defaultTasks = [
    {
      id: 'task_1',
      title: 'Implement JWT authentication filter',
      description: 'Implement JWT token parsing, validation, and loading user details into SecurityContextHolder.',
      priority: 'High',
      category: 'Spring Security',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminder: true,
      estTime: 4,
      actTime: 0,
      status: 'in_progress',
      color: '#3b82f6',
      checklist: [
        { text: 'Create JwtUtils utility class', done: true },
        { text: 'Configure JwtAuthenticationFilter subclassing OncePerRequestFilter', done: true },
        { text: 'Integrate entry points and configure WebSecurityConfigurerAdapter', done: false },
        { text: 'Verify filters and authenticate endpoints with Postman', done: false }
      ]
    },
    {
      id: 'task_2',
      title: 'Setup Eureka Discovery Service',
      description: 'Create a microservice acting as a Eureka Service Registry server for instance tracking.',
      priority: 'Medium',
      category: 'Microservices',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminder: false,
      estTime: 2,
      actTime: 0,
      status: 'todo',
      color: '#8b5cf6',
      checklist: [
        { text: 'Include spring-cloud-starter-netflix-eureka-server dependency', done: true },
        { text: 'Enable registry using @EnableEurekaServer annotation', done: false },
        { text: 'Set client configs register-with-eureka=false and fetch-registry=false', done: false }
      ]
    },
    {
      id: 'task_3',
      title: 'Write Unit Tests for OrderController',
      description: 'Implement JUnit 5 unit tests mocking services using Mockito. Assert standard HTTP response states.',
      priority: 'Low',
      category: 'Testing',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminder: false,
      estTime: 3,
      actTime: 3,
      status: 'completed',
      color: '#10b981',
      checklist: [
        { text: 'Mock OrderService dependencies using @MockBean', done: true },
        { text: 'Configure MockMvc standalone controller setup', done: true },
        { text: 'Write mock test scenarios for standard success and error codes', done: true }
      ]
    },
    {
      id: 'task_4',
      title: 'Dockerize Spring Boot Backend service',
      description: 'Write Multi-stage Dockerfile to compile using Maven container and package with openjdk runtime.',
      priority: 'High',
      category: 'Docker',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reminder: true,
      estTime: 3,
      actTime: 2.5,
      status: 'testing',
      color: '#06b6d4',
      checklist: [
        { text: 'Write Dockerfile configuration', done: true },
        { text: 'Validate build process locally', done: true },
        { text: 'Configure container environmental overrides for databases', done: false }
      ]
    }
  ];

  const defaultRoadmap = {
    'java_basics': true,
    'oop': true,
    'collections': true,
    'generics': true,
    'exception_handling': true,
    'streams': true,
    'lambda': true,
    'multithreading': false,
    'concurrency': false,
    'jvm_internals': false,
    'spring_core': true,
    'ioc_di': true,
    'spring_mvc': true,
    'jpa_hibernate': true,
    'spring_security': false,
    'rest_api': true,
    'microservices': false,
    'docker': false,
    'kubernetes': false,
    'aws_basics': false,
    'system_design_lld': false,
    'system_design_hld': false
  };

  const defaultTrackers = {
    java: {
      basics: true, oop: true, collections: true, generics: true, exceptions: true,
      streams: true, lambdas: true, multithreading: false, executor: false,
      concurrency: false, jvm: false, memory: false, gc: false, reflection: false,
      annotations: true, serialization: false, design_patterns: true
    },
    spring: {
      core: true, ioc: true, di: true, mvc: true, rest: true, validation: true,
      jpa: true, security: false, jwt: false, redis: false, microservices: false,
      gateway: false, eureka: false, feign: false, rabbitmq: false, kafka: false,
      docker: false, testing: true, actuator: false, swagger: true
    },
    mysql: {
      ddl: true, dml: true, constraints: true, joins: true, views: false,
      indexes: true, normalization: true, transactions: false, procedures: false,
      triggers: false, tuning: false, backup: false, replication: false
    },
    dsa: {
      arrays: { easy: 18, medium: 12, hard: 2, target: 40, completed: true },
      strings: { easy: 14, medium: 8, hard: 1, target: 30, completed: true },
      linkedlist: { easy: 8, medium: 10, hard: 2, target: 20, completed: false },
      stacks_queues: { easy: 6, medium: 8, hard: 2, target: 20, completed: false },
      trees: { easy: 10, medium: 15, hard: 4, target: 35, completed: false },
      graphs: { easy: 2, medium: 12, hard: 5, target: 25, completed: false },
      binary_search: { easy: 12, medium: 10, hard: 3, target: 25, completed: false },
      sorting: { easy: 15, medium: 5, hard: 0, target: 20, completed: false },
      greedy: { easy: 8, medium: 10, hard: 3, target: 25, completed: false },
      dp: { easy: 4, medium: 15, hard: 8, target: 30, completed: false },
      recursion: { easy: 10, medium: 8, hard: 1, target: 20, completed: false },
      sliding_window: { easy: 4, medium: 8, hard: 2, target: 15, completed: false }
    }
  };

  const defaultProjects = [
    {
      id: 'proj_1',
      name: 'CloudCommerce Microservices',
      description: 'An enterprise-scale microservices e-commerce system built with Spring Boot, Spring Cloud, Eureka, Docker, and Kafka.',
      technologies: 'Spring Boot, Spring Cloud, Eureka, Gateway, Docker, Kafka, PostgreSQL',
      github: 'https://github.com/alexmercer/cloud-commerce',
      live: 'https://cloud-commerce-demo.vercel.app',
      status: 'In Progress',
      progress: 75,
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'High',
      notes: 'Need to implement OAuth2 authentication utilizing Auth0 or custom Spring Security authentication server.',
      tasks: [
        { id: 1, text: 'Design database schemas and write Hibernate entities', done: true },
        { id: 2, text: 'Configure microservices Discovery Server (Eureka)', done: true },
        { id: 3, text: 'Implement API Gateway routing rules and CORS settings', done: true },
        { id: 4, text: 'Add Kafka messaging pipeline for order notifications', done: true },
        { id: 5, text: 'Write complete test suites and Docker compose profiles', done: false }
      ]
    },
    {
      id: 'proj_2',
      name: 'QueryOptimizer CLI tool',
      description: 'A command-line analysis tool designed to audit MySQL query logs, identify non-indexed queries, and offer optimization recommendations.',
      technologies: 'Java Core, MySQL, JDBC, CLI-Parser',
      github: 'https://github.com/alexmercer/query-optimizer',
      live: '',
      status: 'Completed',
      progress: 100,
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Medium',
      notes: 'Successfully compiled to GraalVM Native Image. Exceedingly small footprint and execution launch time.',
      tasks: [
        { id: 1, text: 'Establish logs parser using regular expressions', done: true },
        { id: 2, text: 'Build explain-plan query execution runner via JDBC', done: true },
        { id: 3, text: 'Write recommendation engine rules', done: true },
        { id: 4, text: 'Create CLI executable packaged distribution scripts', done: true }
      ]
    }
  ];

  const defaultResumes = [
    {
      id: 'res_1',
      name: 'Backend Java Engineer (SaaS Profile)',
      version: 'v2.1',
      targetRole: 'Senior Backend Engineer',
      targetCompany: 'SaaS product companies',
      atsScore: 86,
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Added detailed sections listing Docker compose setups and high-throughput Kafka partitions optimization details.'
    },
    {
      id: 'res_2',
      name: 'Java Backend Dev (Generic FinTech)',
      version: 'v1.4',
      targetRole: 'Software Engineer - Backend',
      targetCompany: 'Financial institutions / Banks',
      atsScore: 81,
      createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Emphasizes transaction integrity, normalization schemas, stored procedures, and Spring Boot JPA usage.'
    }
  ];

  const defaultInterviews = [
    {
      id: 'int_1',
      company: 'Stripe',
      position: 'Software Engineer II (Backend)',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '15:30',
      round: 'Technical Round 1 (Coding & Concurrency)',
      interviewer: 'Sarah Jenkins',
      questionsAsked: {
        coding: 'Design a distributed rate limiter bucket. Handle race conditions in Redis.',
        hr: 'Why Stripe? Give an example of a disagreement with a project lead.',
        sysDesign: 'API gateway caching, caching invalidation strategies, database replication delays.'
      },
      feedback: 'Preparing - reviewing LeetCode rate limiter topics.',
      status: 'Scheduled',
      result: 'Pending',
      offer: false,
      notes: 'Focus on clean, structured code and concurrency principles.'
    },
    {
      id: 'int_2',
      company: 'Amazon',
      position: 'SDE-2 (Java Backends)',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '11:00',
      round: 'Technical 1 (DSA and System Design)',
      interviewer: 'David Miller',
      questionsAsked: {
        coding: 'Least Recently Used (LRU) Cache implementation using LinkedHashMap and manual DLL.',
        hr: 'Describe a situation where you had to make a decision without all the information.',
        sysDesign: 'Designing Amazon Wishlist microservice. Scalability, data schema choice, SQL vs NoSQL.'
      },
      feedback: 'Excellent coder, strong grasp of OOP and Streams. Slightly weak on edge case error handlers.',
      status: 'Completed',
      result: 'Passed',
      offer: false,
      notes: 'Amazon Leadership principles (Customer Obsession, Deep Dive) are highly crucial!'
    }
  ];

  const defaultJobs = [
    {
      id: 'job_1',
      company: 'Stripe',
      companyLogo: 'https://logo.clearbit.com/stripe.com',
      role: 'Backend Engineer',
      experience: '2-4 years',
      salary: '$130k - $160k',
      location: 'Remote (US)',
      workMode: 'Remote',
      source: 'LinkedIn',
      appDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumeVersion: 'v2.1 (SaaS Profile)',
      portfolioLink: 'https://github.com/alexmercer',
      hrName: 'Megan Kelly',
      hrEmail: 'megan.k@stripe.com',
      linkedinUrl: 'https://linkedin.com/in/megan-k-stripe',
      referral: 'John Doe (Senior Staff SDE)',
      status: 'Technical Round 1',
      priority: 'High',
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      offer: '',
      joiningDate: '',
      notes: 'Applied through high level referral. The OA was solved on Leetcode medium topics.'
    },
    {
      id: 'job_2',
      company: 'Capital One',
      companyLogo: 'https://logo.clearbit.com/capitalone.com',
      role: 'Senior Associate Java Developer',
      experience: '2+ years',
      salary: '$110k - $130k',
      location: 'McLean, VA',
      workMode: 'Hybrid',
      source: 'Indeed',
      appDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumeVersion: 'v1.4 (Generic FinTech)',
      portfolioLink: 'https://github.com/alexmercer',
      hrName: 'Adam Smith',
      hrEmail: 'adam.smith@capitalone.com',
      linkedinUrl: '',
      referral: '',
      status: 'Applied',
      priority: 'Medium',
      interviewDate: '',
      offer: '',
      joiningDate: '',
      notes: 'Requires strong understanding of Spring Cloud and AWS (SQS, RDS).'
    },
    {
      id: 'job_3',
      company: 'Amazon',
      companyLogo: 'https://logo.clearbit.com/amazon.com',
      role: 'Software Development Engineer II',
      experience: '3+ years',
      salary: '$150k - $180k',
      location: 'Seattle, WA',
      workMode: 'On-site',
      source: 'Amazon Careers',
      appDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumeVersion: 'v2.1 (SaaS Profile)',
      portfolioLink: 'https://github.com/alexmercer',
      hrName: 'Jessica Parker',
      hrEmail: 'parkerj@amazon.com',
      linkedinUrl: '',
      referral: '',
      status: 'Technical Round 2',
      priority: 'High',
      interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      offer: '',
      joiningDate: '',
      notes: 'Passed OA and Technical Round 1. Loop scheduled next week consisting of 3 rounds (System Design + Coding + Leadership).'
    },
    {
      id: 'job_4',
      company: 'Netflix',
      companyLogo: 'https://logo.clearbit.com/netflix.com',
      role: 'Senior Backend Engineer - Content Platform',
      experience: '5+ years',
      salary: '$250k+',
      location: 'Los Gatos, CA',
      workMode: 'On-site',
      source: 'Referral',
      appDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resumeVersion: 'v2.1 (SaaS Profile)',
      portfolioLink: 'https://github.com/alexmercer',
      hrName: 'Ryan Reynolds',
      hrEmail: 'ryanr@netflix.com',
      linkedinUrl: '',
      referral: 'Staff Engineer (Content Delivery)',
      status: 'Rejected',
      priority: 'High',
      interviewDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      offer: '',
      joiningDate: '',
      notes: 'Failed in the System Design round. The interviewer was looking for deeper partition details under high loads.'
    }
  ];

  const defaultHabits = {
    // Stores habit checks keyed by YYYY-MM-DD
  };
  // Seed last 7 days of habit records
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    defaultHabits[d] = {
      wake_up: Math.random() > 0.3,
      workout: Math.random() > 0.5,
      study: Math.random() > 0.2,
      reading: Math.random() > 0.4,
      coding: Math.random() > 0.1,
      dsa: Math.random() > 0.4,
      water: Math.random() > 0.2,
      sleep: Math.random() > 0.3,
      meditation: Math.random() > 0.6
    };
  }

  const defaultCertifications = [
    {
      id: 'cert_1',
      name: 'Oracle Certified Professional: Java SE 17 Developer',
      provider: 'Oracle',
      issueDate: '2025-05-15',
      expiryDate: '',
      credentialId: 'OCP17-492942',
      verificationLink: 'https://education.oracle.com/verify',
      skills: 'Java 17 Core, Sealed Classes, Record Types, Concurrency API',
      status: 'Active',
      notes: 'Cleared with a score of 89%.'
    },
    {
      id: 'cert_2',
      name: 'AWS Certified Developer - Associate',
      provider: 'Amazon Web Services (AWS)',
      issueDate: '2026-01-20',
      expiryDate: '2029-01-20',
      credentialId: 'AWS-DV-99120',
      verificationLink: 'https://aws.amazon.com/verification',
      skills: 'AWS DynamoDB, AWS Lambda, IAM, API Gateway, S3, ECS, CloudFormation',
      status: 'Active',
      notes: 'Self-studied for 3 months using tutorials and local mock labs.'
    }
  ];

  const defaultDailyPlanner = {
    date: new Date().toISOString().split('T')[0],
    morningGoals: 'Complete JWT Security filter code. Review Amazon interview prep questions.',
    todayGoals: 'Exercise for 30m. Spend 3h studying System Design. Clean open tickets.',
    eveningReview: 'Finished the security filter but ran into an issue testing invalid signatures.',
    tomorrowPlan: 'Debug JWT signature validations, write order test controllers, study dynamic programming.',
    wins: 'Finished the security implementation, checked off active daily coding goals.',
    mistakes: 'Got distracted checking phone alerts, spent too much time reading stack overflow comments.',
    improvements: 'Put phone in focus mode in drawer during the active studying sessions.'
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
      } catch (e) {
        console.error('Error saving to local storage', e);
      }
    },

    initialize: function () {
      // Check if profile exists, if not, write defaults
      if (!localStorage.getItem(STORAGE_PREFIX + 'profile')) {
        console.log('Seeding initial developer data...');
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
          dump[key] = this.get(key);
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
    }
  };

  // Run initialization
  window.StorageService.initialize();
})();
