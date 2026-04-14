// Comprehensive skills database organized by category
const skillsDatabase = {
    // Programming Languages
    programmingLanguages: [
        'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift',
        'kotlin', 'go', 'golang', 'rust', 'typescript', 'scala', 'perl',
        'r', 'matlab', 'objective-c', 'dart', 'lua', 'haskell', 'clojure',
        'elixir', 'erlang', 'f#', 'groovy', 'julia', 'cobol', 'fortran',
        'assembly', 'vhdl', 'verilog', 'solidity', 'move'
    ],

    // Frontend Technologies
    frontend: [
        'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind',
        'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra-ui',
        'react', 'reactjs', 'react.js', 'redux', 'react-redux', 'next.js',
        'nextjs', 'gatsby', 'vue', 'vuejs', 'vue.js', 'vuex', 'nuxt',
        'nuxtjs', 'angular', 'angularjs', 'svelte', 'sveltekit', 'ember',
        'backbone', 'jquery', 'ajax', 'webpack', 'vite', 'parcel', 'rollup',
        'gulp', 'grunt', 'babel', 'eslint', 'prettier', 'storybook',
        'styled-components', 'emotion', 'framer-motion', 'gsap', 'three.js',
        'd3.js', 'd3', 'chart.js', 'highcharts', 'recharts', 'canvas', 'webgl',
        'pwa', 'service-workers', 'web-components', 'shadow-dom', 'lit',
        'alpine.js', 'htmx', 'astro', 'remix', 'solid', 'solidjs', 'qwik'
    ],

    // Backend Technologies
    backend: [
        'node', 'nodejs', 'node.js', 'express', 'expressjs', 'express.js',
        'fastify', 'koa', 'hapi', 'nestjs', 'nest.js', 'django', 'flask',
        'fastapi', 'pyramid', 'tornado', 'spring', 'spring-boot', 'springboot',
        'hibernate', 'struts', 'rails', 'ruby-on-rails', 'sinatra', 'laravel',
        'symfony', 'codeigniter', 'yii', 'cakephp', 'asp.net', 'dotnet',
        '.net', '.net-core', 'blazor', 'gin', 'echo', 'fiber', 'beego',
        'actix', 'rocket', 'axum', 'phoenix', 'ecto', 'vapor', 'perfect',
        'graphql', 'rest', 'restful', 'api', 'microservices', 'grpc',
        'websocket', 'socket.io', 'rabbitmq', 'kafka', 'redis', 'celery',
        'sidekiq', 'bull', 'beanstalkd', 'zeromq', 'mqtt'
    ],

    // Databases
    databases: [
        'sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mariadb',
        'oracle', 'mssql', 'sql-server', 'mongodb', 'mongoose', 'dynamodb',
        'cassandra', 'couchdb', 'couchbase', 'firebase', 'firestore',
        'neo4j', 'arangodb', 'dgraph', 'redis', 'memcached', 'elasticsearch',
        'opensearch', 'solr', 'clickhouse', 'timescaledb', 'influxdb',
        'cockroachdb', 'vitess', 'planetscale', 'supabase', 'fauna',
        'prisma', 'sequelize', 'typeorm', 'knex', 'bookshelf', 'objection',
        'drizzle', 'kysely', 'sqlalchemy', 'peewee', 'tortoise-orm',
        'activerecord', 'eloquent', 'doctrine', 'dapper', 'entity-framework'
    ],

    // Cloud & DevOps
    cloudDevops: [
        'aws', 'amazon-web-services', 'ec2', 's3', 'lambda', 'rds', 'ecs',
        'eks', 'fargate', 'cloudformation', 'cdk', 'sam', 'amplify',
        'azure', 'azure-devops', 'azure-functions', 'azure-storage',
        'gcp', 'google-cloud', 'cloud-functions', 'cloud-run', 'gke', 'bigquery',
        'firebase', 'heroku', 'vercel', 'netlify', 'railway', 'render',
        'digitalocean', 'linode', 'vultr', 'cloudflare', 'cloudflare-workers',
        'docker', 'dockerfile', 'docker-compose', 'podman', 'containerd',
        'kubernetes', 'k8s', 'helm', 'istio', 'linkerd', 'envoy',
        'terraform', 'pulumi', 'ansible', 'chef', 'puppet', 'saltstack',
        'jenkins', 'github-actions', 'gitlab-ci', 'circleci', 'travis-ci',
        'argo-cd', 'flux', 'spinnaker', 'tekton', 'drone',
        'nginx', 'apache', 'caddy', 'traefik', 'haproxy', 'kong',
        'prometheus', 'grafana', 'datadog', 'newrelic', 'splunk', 'elk',
        'elasticsearch', 'logstash', 'kibana', 'jaeger', 'zipkin', 'opentelemetry',
        'vault', 'consul', 'etcd', 'zookeeper'
    ],

    // Mobile Development
    mobile: [
        'android', 'android-sdk', 'kotlin', 'java-android', 'jetpack-compose',
        'ios', 'swift', 'swiftui', 'uikit', 'objective-c', 'xcode',
        'react-native', 'expo', 'flutter', 'dart', 'xamarin', 'maui',
        'ionic', 'cordova', 'capacitor', 'nativescript', 'unity',
        'mobile-development', 'responsive-design', 'progressive-web-app'
    ],

    // Data Science & ML
    dataScience: [
        'machine-learning', 'ml', 'deep-learning', 'dl', 'neural-networks',
        'tensorflow', 'keras', 'pytorch', 'scikit-learn', 'sklearn',
        'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly',
        'jupyter', 'jupyter-notebook', 'colab', 'kaggle',
        'nlp', 'natural-language-processing', 'spacy', 'nltk', 'huggingface',
        'transformers', 'bert', 'gpt', 'llm', 'langchain', 'openai-api',
        'computer-vision', 'opencv', 'yolo', 'detectron', 'image-processing',
        'reinforcement-learning', 'recommendation-systems', 'time-series',
        'feature-engineering', 'model-deployment', 'mlops', 'mlflow',
        'kubeflow', 'sagemaker', 'vertex-ai', 'databricks',
        'data-analysis', 'data-visualization', 'statistics', 'a/b-testing',
        'big-data', 'spark', 'pyspark', 'hadoop', 'hive', 'presto', 'dbt',
        'airflow', 'prefect', 'dagster', 'etl', 'data-pipeline',
        'power-bi', 'tableau', 'looker', 'metabase', 'superset'
    ],

    // Testing & QA
    testing: [
        'testing', 'unit-testing', 'integration-testing', 'e2e-testing',
        'jest', 'mocha', 'chai', 'jasmine', 'karma', 'ava', 'vitest',
        'cypress', 'playwright', 'puppeteer', 'selenium', 'webdriver',
        'pytest', 'unittest', 'nose', 'robot-framework', 'behave',
        'junit', 'testng', 'mockito', 'spock', 'rspec', 'minitest',
        'phpunit', 'pest', 'go-test', 'rust-test',
        'tdd', 'bdd', 'test-driven-development', 'behavior-driven-development',
        'mocking', 'stubbing', 'test-coverage', 'code-coverage',
        'load-testing', 'performance-testing', 'jmeter', 'k6', 'locust', 'gatling',
        'security-testing', 'penetration-testing', 'owasp', 'burp-suite',
        'postman', 'insomnia', 'api-testing', 'contract-testing', 'pact'
    ],

    // Version Control & Collaboration
    versionControl: [
        'git', 'github', 'gitlab', 'bitbucket', 'azure-repos',
        'svn', 'subversion', 'mercurial', 'perforce',
        'git-flow', 'trunk-based-development', 'branching-strategy',
        'pull-request', 'code-review', 'pair-programming', 'mob-programming',
        'jira', 'confluence', 'trello', 'asana', 'notion', 'linear',
        'slack', 'teams', 'discord', 'zoom'
    ],

    // Security
    security: [
        'cybersecurity', 'information-security', 'application-security',
        'oauth', 'oauth2', 'openid', 'jwt', 'json-web-token', 'saml',
        'authentication', 'authorization', 'rbac', 'abac', 'iam',
        'encryption', 'hashing', 'ssl', 'tls', 'https', 'certificates',
        'firewalls', 'vpn', 'network-security', 'zero-trust',
        'vulnerability-assessment', 'penetration-testing', 'ethical-hacking',
        'siem', 'soc', 'incident-response', 'forensics',
        'compliance', 'gdpr', 'hipaa', 'pci-dss', 'soc2', 'iso27001',
        'devsecops', 'sast', 'dast', 'snyk', 'sonarqube', 'checkmarx'
    ],

    // Soft Skills
    softSkills: [
        'communication', 'teamwork', 'collaboration', 'leadership',
        'problem-solving', 'critical-thinking', 'analytical', 'creativity',
        'time-management', 'organization', 'multitasking', 'prioritization',
        'adaptability', 'flexibility', 'learning-agility', 'growth-mindset',
        'attention-to-detail', 'accuracy', 'quality-focus',
        'project-management', 'agile', 'scrum', 'kanban', 'waterfall',
        'stakeholder-management', 'client-facing', 'presentation',
        'mentoring', 'coaching', 'training', 'knowledge-sharing',
        'conflict-resolution', 'negotiation', 'persuasion',
        'empathy', 'emotional-intelligence', 'interpersonal',
        'self-motivated', 'initiative', 'proactive', 'ownership',
        'remote-work', 'distributed-teams', 'async-communication'
    ],

    // Design
    design: [
        'ui', 'ux', 'ui/ux', 'user-interface', 'user-experience',
        'figma', 'sketch', 'adobe-xd', 'invision', 'zeplin', 'framer',
        'photoshop', 'illustrator', 'after-effects', 'premiere',
        'wireframing', 'prototyping', 'mockups', 'design-systems',
        'responsive-design', 'mobile-first', 'accessibility', 'a11y', 'wcag',
        'typography', 'color-theory', 'visual-design', 'graphic-design',
        'interaction-design', 'motion-design', 'animation',
        'user-research', 'usability-testing', 'persona', 'journey-mapping',
        'information-architecture', 'content-strategy'
    ],

    // Architecture & Patterns
    architecture: [
        'system-design', 'software-architecture', 'solution-architecture',
        'microservices', 'monolith', 'serverless', 'event-driven',
        'domain-driven-design', 'ddd', 'cqrs', 'event-sourcing',
        'clean-architecture', 'hexagonal-architecture', 'onion-architecture',
        'mvc', 'mvvm', 'mvp', 'flux', 'redux-pattern',
        'design-patterns', 'solid-principles', 'dry', 'kiss', 'yagni',
        'scalability', 'high-availability', 'fault-tolerance', 'resilience',
        'load-balancing', 'caching', 'cdn', 'message-queue', 'pub-sub',
        'api-design', 'api-gateway', 'service-mesh', 'soa',
        'distributed-systems', 'cap-theorem', 'consistency', 'partitioning'
    ],

    // Blockchain & Web3
    blockchain: [
        'blockchain', 'web3', 'decentralized', 'dapp', 'defi',
        'ethereum', 'solidity', 'hardhat', 'truffle', 'foundry',
        'bitcoin', 'cryptocurrency', 'smart-contracts', 'erc20', 'erc721', 'nft',
        'metamask', 'web3.js', 'ethers.js', 'wagmi', 'viem',
        'polygon', 'solana', 'rust-solana', 'anchor', 'move', 'aptos', 'sui',
        'ipfs', 'filecoin', 'arweave', 'the-graph', 'chainlink',
        'consensus', 'proof-of-work', 'proof-of-stake', 'layer2', 'rollups'
    ],

    // Game Development
    gameDev: [
        'game-development', 'unity', 'unreal-engine', 'godot',
        'c#-unity', 'blueprints', 'gdscript',
        'game-design', 'level-design', '3d-modeling', '2d-art',
        'blender', 'maya', 'substance-painter', 'zbrush',
        'physics-engine', 'ai-pathfinding', 'networking-multiplayer',
        'vr', 'ar', 'xr', 'mixed-reality', 'oculus', 'webxr'
    ],

    // Embedded & IoT
    embedded: [
        'embedded-systems', 'firmware', 'microcontroller',
        'arduino', 'raspberry-pi', 'esp32', 'stm32', 'arm',
        'c-embedded', 'assembly', 'rtos', 'freertos',
        'iot', 'internet-of-things', 'mqtt', 'coap', 'zigbee', 'bluetooth',
        'sensors', 'actuators', 'gpio', 'i2c', 'spi', 'uart',
        'pcb-design', 'circuit-design', 'hardware-debugging'
    ]
};

// Create a flat array of all skills for quick lookup
const allSkills = Object.values(skillsDatabase).flat();

// Create a Set for O(1) lookup
const skillsSet = new Set(allSkills.map(skill => skill.toLowerCase()));

// Skill synonyms mapping
const skillSynonyms = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'cpp': 'c++',
    'csharp': 'c#',
    'golang': 'go',
    'node': 'nodejs',
    'react': 'reactjs',
    'vue': 'vuejs',
    'angular': 'angularjs',
    'mongo': 'mongodb',
    'postgres': 'postgresql',
    'k8s': 'kubernetes',
    'tf': 'terraform',
    'aws': 'amazon-web-services',
    'gcp': 'google-cloud',
    'ml': 'machine-learning',
    'dl': 'deep-learning',
    'ai': 'artificial-intelligence',
    'ui': 'user-interface',
    'ux': 'user-experience',
    'qa': 'quality-assurance',
    'ci': 'continuous-integration',
    'cd': 'continuous-deployment',
    'devops': 'development-operations',
    'sre': 'site-reliability-engineering'
};

// Skill weights - some skills are more important
const skillWeights = {
    // High weight - core technical skills
    programmingLanguages: 1.5,
    frontend: 1.3,
    backend: 1.3,
    databases: 1.2,
    cloudDevops: 1.2,
    
    // Medium weight
    mobile: 1.1,
    dataScience: 1.2,
    testing: 1.1,
    security: 1.2,
    architecture: 1.3,
    
    // Standard weight
    versionControl: 1.0,
    softSkills: 0.8,
    design: 1.0,
    blockchain: 1.1,
    gameDev: 1.0,
    embedded: 1.1
};

module.exports = {
    skillsDatabase,
    allSkills,
    skillsSet,
    skillSynonyms,
    skillWeights
};
