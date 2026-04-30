const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert software architect specializing in distributed systems, microservices, and scalable architecture design. 

Your task is to generate complete, production-ready system architecture designs based on user requirements.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no explanation, no code blocks. Pure JSON only.

The JSON must follow this EXACT structure:
{
  "title": "string - concise project title",
  "overview": "string - 2-3 sentence overview of the architecture",
  "hld": "string - detailed High Level Design explanation (paragraph format)",
  "lld": "string - detailed Low Level Design explanation with component interactions",
  "databaseSchema": "string - describe the main database schemas/collections",
  "techStack": {
    "frontend": ["technology list"],
    "backend": ["technology list"],
    "database": ["technology list"],
    "infrastructure": ["technology list"],
    "monitoring": ["technology list"]
  },
  "services": [
    {
      "id": "unique-kebab-case-id",
      "name": "Service Name",
      "type": "service|gateway|client|external",
      "technology": "Tech used",
      "description": "What this service does",
      "responsibilities": ["list of responsibilities"],
      "port": 8000
    }
  ],
  "databases": [
    {
      "id": "unique-kebab-case-id",
      "name": "Database Name",
      "type": "database|cache|queue|search",
      "technology": "MongoDB|PostgreSQL|Redis|Kafka|etc",
      "description": "Purpose of this database",
      "collections": ["collection1", "collection2"]
    }
  ],
  "infrastructure": [
    {
      "id": "unique-kebab-case-id",
      "name": "Component Name",
      "type": "loadbalancer|cdn|gateway|monitoring",
      "technology": "Tech used",
      "description": "What it does"
    }
  ],
  "apis": [
    {
      "service": "service-id",
      "endpoint": "/api/path",
      "method": "GET|POST|PUT|DELETE|PATCH",
      "description": "What this endpoint does",
      "auth": true,
      "requestBody": {},
      "response": {}
    }
  ],
  "connections": [
    {
      "from": "source-id",
      "to": "target-id",
      "protocol": "HTTP|gRPC|WebSocket|AMQP|TCP",
      "description": "Nature of the connection",
      "async": false
    }
  ],
  "scaling": {
    "strategies": ["list of scaling strategies"],
    "loadBalancing": "Load balancing approach",
    "caching": "Caching strategy details",
    "database": "Database scaling approach",
    "monitoring": ["monitoring tools and approaches"]
  },
  "security": ["list of security measures"],
  "estimatedComplexity": "low|medium|high|very-high"
}

Rules:
- Every service/database/infrastructure MUST have a unique id in kebab-case
- connections.from and connections.to MUST reference valid ids from services, databases, or infrastructure
- Generate realistic, production-grade architecture
- Include proper microservices separation of concerns
- Always include API Gateway, Load Balancer for medium+ complexity systems
- Always include monitoring (e.g., Prometheus, Grafana)
- Include message queues for async operations where appropriate`;

const generateArchitecture = async (requirement) => {
  const userPrompt = `Design a complete system architecture for: "${requirement}"

Generate a comprehensive, production-ready microservices architecture with:
1. All necessary microservices (auth, core business logic, notifications, etc.)
2. Appropriate databases for each service
3. Caching layer (Redis)
4. Message queue if needed
5. API Gateway and Load Balancer
6. CDN for static assets
7. Monitoring and logging
8. Complete API design for core endpoints
9. Detailed HLD and LLD
10. Scaling strategies

Make it realistic and production-grade. Be thorough with connections showing the full data flow.`;

  const response = await client.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed;
};

// Fallback mock generator for when OpenAI is not available
const generateMockArchitecture = (requirement) => {
  const title = requirement.split(' ').slice(0, 5).join(' ');
  return {
    title: `${title} Architecture`,
    overview: `A scalable microservices architecture for ${requirement}. Built with modern cloud-native principles including containerization, service mesh, and event-driven communication.`,
    hld: `The High Level Design follows a microservices architecture pattern. The system is composed of independent services communicating via REST APIs and message queues. An API Gateway handles all client requests, routing them to appropriate services. Load balancers distribute traffic across service instances. Data is stored in purpose-specific databases (SQL for relational, MongoDB for documents, Redis for caching). The entire system is containerized using Docker and orchestrated with Kubernetes.`,
    lld: `Low Level Design: The API Gateway (Kong/Nginx) receives all requests and performs authentication, rate limiting, and routing. The Auth Service handles JWT token generation/validation using bcrypt for password hashing. Each microservice follows the repository pattern with a service layer for business logic. Inter-service communication uses REST for synchronous calls and Kafka for async events. Each service has its own database following the Database-per-Service pattern. Redis is used for session management, caching, and pub/sub messaging.`,
    databaseSchema: `User Collection: {_id, name, email, passwordHash, createdAt, role}. Session Collection: {_id, userId, token, expiresAt}. Audit Log: {_id, userId, action, timestamp, metadata}`,
    techStack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS', 'React Flow'],
      backend: ['Node.js', 'Express', 'Python FastAPI'],
      database: ['MongoDB', 'PostgreSQL', 'Redis'],
      infrastructure: ['Docker', 'Kubernetes', 'Nginx', 'AWS'],
      monitoring: ['Prometheus', 'Grafana', 'ELK Stack'],
    },
    services: [
      { id: 'client-app', name: 'Client Application', type: 'client', technology: 'React', description: 'Web/mobile frontend', responsibilities: ['User interface', 'State management'], port: 3000 },
      { id: 'api-gateway', name: 'API Gateway', type: 'gateway', technology: 'Kong / Nginx', description: 'Single entry point for all clients', responsibilities: ['Request routing', 'Auth validation', 'Rate limiting'], port: 8080 },
      { id: 'auth-service', name: 'Auth Service', type: 'service', technology: 'Node.js', description: 'Handles authentication and authorization', responsibilities: ['JWT generation', 'Password hashing', 'Session management'], port: 3001 },
      { id: 'user-service', name: 'User Service', type: 'service', technology: 'Node.js', description: 'User profile and management', responsibilities: ['User CRUD', 'Profile management'], port: 3002 },
      { id: 'core-service', name: 'Core Business Service', type: 'service', technology: 'Node.js', description: 'Main business logic service', responsibilities: ['Core feature implementation', 'Business rules'], port: 3003 },
      { id: 'notification-service', name: 'Notification Service', type: 'service', technology: 'Node.js', description: 'Email, SMS, push notifications', responsibilities: ['Email sending', 'Push notifications'], port: 3004 },
    ],
    databases: [
      { id: 'user-db', name: 'User Database', type: 'database', technology: 'MongoDB', description: 'Stores user data', collections: ['users', 'sessions'] },
      { id: 'core-db', name: 'Core Database', type: 'database', technology: 'PostgreSQL', description: 'Core business data', collections: ['entities', 'transactions'] },
      { id: 'redis-cache', name: 'Redis Cache', type: 'cache', technology: 'Redis', description: 'Caching and session store', collections: ['sessions', 'cache'] },
      { id: 'message-queue', name: 'Message Queue', type: 'queue', technology: 'Apache Kafka', description: 'Async event streaming', collections: ['events', 'notifications'] },
    ],
    infrastructure: [
      { id: 'load-balancer', name: 'Load Balancer', type: 'loadbalancer', technology: 'AWS ALB', description: 'Distributes incoming traffic' },
      { id: 'cdn', name: 'CDN', type: 'cdn', technology: 'CloudFront', description: 'Static asset delivery' },
    ],
    apis: [
      { service: 'auth-service', endpoint: '/api/auth/register', method: 'POST', description: 'User registration', auth: false },
      { service: 'auth-service', endpoint: '/api/auth/login', method: 'POST', description: 'User login', auth: false },
      { service: 'user-service', endpoint: '/api/users/me', method: 'GET', description: 'Get current user', auth: true },
      { service: 'core-service', endpoint: '/api/core/items', method: 'GET', description: 'List core items', auth: true },
    ],
    connections: [
      { from: 'client-app', to: 'cdn', protocol: 'HTTP', description: 'Static assets', async: false },
      { from: 'client-app', to: 'load-balancer', protocol: 'HTTPS', description: 'API requests', async: false },
      { from: 'load-balancer', to: 'api-gateway', protocol: 'HTTP', description: 'Routed traffic', async: false },
      { from: 'api-gateway', to: 'auth-service', protocol: 'HTTP', description: 'Auth requests', async: false },
      { from: 'api-gateway', to: 'user-service', protocol: 'HTTP', description: 'User requests', async: false },
      { from: 'api-gateway', to: 'core-service', protocol: 'HTTP', description: 'Business requests', async: false },
      { from: 'auth-service', to: 'user-db', protocol: 'TCP', description: 'User data queries', async: false },
      { from: 'auth-service', to: 'redis-cache', protocol: 'TCP', description: 'Session caching', async: false },
      { from: 'user-service', to: 'user-db', protocol: 'TCP', description: 'User data', async: false },
      { from: 'core-service', to: 'core-db', protocol: 'TCP', description: 'Business data', async: false },
      { from: 'core-service', to: 'redis-cache', protocol: 'TCP', description: 'Data caching', async: false },
      { from: 'core-service', to: 'message-queue', protocol: 'AMQP', description: 'Async events', async: true },
      { from: 'message-queue', to: 'notification-service', protocol: 'AMQP', description: 'Notification events', async: true },
    ],
    scaling: {
      strategies: ['Horizontal scaling with Kubernetes HPA', 'Database read replicas', 'Multi-region deployment', 'Auto-scaling groups'],
      loadBalancing: 'Round-robin with health checks via AWS Application Load Balancer',
      caching: 'Redis for session/data cache, CDN for static assets, In-memory caching at service level',
      database: 'MongoDB sharding, PostgreSQL read replicas, connection pooling',
      monitoring: ['Prometheus metrics collection', 'Grafana dashboards', 'ELK Stack for logging', 'PagerDuty for alerting'],
    },
    security: ['JWT authentication', 'HTTPS/TLS encryption', 'Rate limiting', 'Input validation', 'CORS configuration', 'bcrypt password hashing', 'SQL injection prevention', 'XSS protection'],
    estimatedComplexity: 'high',
  };
};

module.exports = { generateArchitecture, generateMockArchitecture };
