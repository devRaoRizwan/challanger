// Concept of the day: one core backend concept per plan day (1–30).
// Docs links and videos were checked; video = a real YouTube video.
window.CONCEPTS = {
 "1": {
  "t": "How HTTP really works",
  "what": "HTTP is a stateless request/response protocol. A request has a method (GET, POST, PUT, PATCH, DELETE), a path, headers and an optional body. The response has a status code, headers and a body. Headers carry the important metadata: Content-Type, Authorization, Cache-Control, cookies.",
  "ask": "Walk me through an HTTP request from your Django/FastAPI app's point of view. What's in it, and what does the server send back?",
  "try": "Run `curl -v https://api.github.com/users/octocat` and label every request and response header you see.",
  "docs": [
   {
    "t": "MDN: An overview of HTTP",
    "u": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=eesqK59rhGA",
   "title": "The Http and the Web | Http Explained | Request-Response Cycle",
   "ch": "The TechCave",
   "len": "8:55"
  }
 },
 "2": {
  "t": "REST API design",
  "what": "REST models your API as resources (nouns) addressed by URLs, with HTTP methods as the verbs: GET /orders, POST /orders, GET /orders/42, PATCH /orders/42. Responses are stateless, and success or failure is expressed through status codes. Good REST APIs are predictable: consistent naming, pagination, filtering, versioning and error bodies.",
  "ask": "Design the endpoints for a blog: posts, comments and likes. Which methods and status codes would you use?",
  "try": "Write the URL list and status codes for a 'tasks' API on paper, then compare it with a real API such as GitHub's REST API.",
  "docs": [
   {
    "t": "MDN: REST",
    "u": "https://developer.mozilla.org/en-US/docs/Glossary/REST"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=-mN3VyJuCjM",
   "title": "What Is REST API? Examples And How To Use It: Crash Course System Design #3",
   "ch": "ByteByteGo",
   "len": "5:21"
  }
 },
 "3": {
  "t": "Idempotency",
  "what": "An operation is idempotent if doing it twice has the same effect as doing it once. GET, PUT and DELETE are idempotent by design; POST is not. Because networks time out and clients retry, anything that creates money movements or orders needs an idempotency key: the server remembers the key and returns the first result instead of repeating the action.",
  "ask": "A client times out on POST /payments and retries. How do you make sure the customer isn't charged twice?",
  "try": "Read how Stripe handles the Idempotency-Key header, then sketch the table you'd use to store keys and responses.",
  "docs": [
   {
    "t": "Stripe: Idempotent requests",
    "u": "https://docs.stripe.com/api/idempotent_requests"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=t99NvIazD68",
   "title": "Idempotency in APIs: you should be aware of this!",
   "ch": "Software Developer Diaries",
   "len": "7:31"
  }
 },
 "4": {
  "t": "Processes vs threads",
  "what": "A process has its own memory space; threads live inside a process and share its memory. Threads are cheaper to create and to share data between, but shared memory brings race conditions. In CPython, the GIL lets only one thread run Python bytecode at a time, so threads help I/O-bound work, while processes are needed for CPU-bound parallelism.",
  "ask": "What's the difference between a process and a thread? Why doesn't threading speed up CPU-heavy Python code?",
  "try": "Time a CPU-heavy function (sum of squares up to 10**7) run 4 times with ThreadPoolExecutor and then with ProcessPoolExecutor.",
  "docs": [
   {
    "t": "Python docs: concurrent.futures",
    "u": "https://docs.python.org/3/library/concurrent.futures.html"
   },
   {
    "t": "Real Python: An intro to threading",
    "u": "https://realpython.com/intro-to-python-threading/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=4rLW7zg21gI",
   "title": "FANG Interview Question | Process vs Thread",
   "ch": "ByteByteGo",
   "len": "3:51"
  }
 },
 "5": {
  "t": "Multithreading, race conditions & locks",
  "what": "When threads share data, operations like `count += 1` (read, add, write) can interleave and lose updates: a race condition. Protect shared state with a Lock, or avoid sharing by passing work through a thread-safe `queue.Queue`. Too much locking causes contention, and locks taken in different orders cause deadlocks.",
  "ask": "What is a race condition? Show one in Python and fix it. How can two locks cause a deadlock?",
  "try": "Build a producer/consumer with `queue.Queue` and 3 worker threads that process 20 fake jobs.",
  "docs": [
   {
    "t": "Python docs: threading",
    "u": "https://docs.python.org/3/library/threading.html"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=IEEhzQoKtQU",
   "title": "Python Threading Tutorial: Run Code Concurrently Using the Threading Module",
   "ch": "Corey Schafer",
   "len": "36:05"
  }
 },
 "6": {
  "t": "Multiprocessing & worker pools",
  "what": "`multiprocessing` and `ProcessPoolExecutor` run code in separate processes, so CPU-bound work uses all your cores. The cost: data is pickled between processes, and each process has its own memory. Production servers rely on the same idea: gunicorn and Celery run several worker processes.",
  "ask": "Your API resizes images and CPU sits at 100%. How do you scale it: threads, processes or async? And where should that work run?",
  "try": "Use `ProcessPoolExecutor.map` to hash 1,000 strings with hashlib, and compare the time with a plain loop.",
  "docs": [
   {
    "t": "Python docs: multiprocessing",
    "u": "https://docs.python.org/3/library/multiprocessing.html"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=fKl2JW_qrso",
   "title": "Python Multiprocessing Tutorial: Run Code in Parallel Using the Multiprocessing Module",
   "ch": "Corey Schafer",
   "len": "44:15"
  }
 },
 "7": {
  "t": "Async I/O & the event loop",
  "what": "Async code runs many tasks on one thread. An event loop switches between coroutines whenever one is waiting on I/O (`await`). That makes it ideal for thousands of concurrent network calls or connections, and useless for CPU-heavy work. One blocking call (time.sleep, a sync DB driver) inside `async def` freezes everything.",
  "ask": "Concurrency vs parallelism? When is asyncio better than threads, and what happens if you call a blocking function inside an async FastAPI endpoint?",
  "try": "Fetch 20 URLs with `httpx.AsyncClient` and `asyncio.gather`, then do the same sequentially and compare the times.",
  "docs": [
   {
    "t": "Python docs: asyncio",
    "u": "https://docs.python.org/3/library/asyncio.html"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=RIVcqT2OGPA",
   "title": "Asyncio Finally Explained: What the Event Loop Really Does",
   "ch": "ArjanCodes",
   "len": "13:34"
  }
 },
 "8": {
  "t": "Authentication vs authorization, sessions & cookies",
  "what": "Authentication asks who you are (login). Authorization asks what you're allowed to do (permissions or roles). With sessions, the server stores session data and the browser holds a session-ID cookie. Mark that cookie HttpOnly, Secure and SameSite to protect it from XSS and CSRF.",
  "ask": "Explain authentication vs authorization with an example from your last project. How does Django's session login work?",
  "try": "Log in to a Django admin, open DevTools → Application → Cookies, and look at the sessionid cookie's flags.",
  "docs": [
   {
    "t": "MDN: Using HTTP cookies",
    "u": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=fyTxwIa-1U0",
   "title": "Session Vs JWT: The Differences You May Not Know!",
   "ch": "ByteByteGo",
   "len": "7:00"
  }
 },
 "9": {
  "t": "JWT (JSON Web Tokens)",
  "what": "A JWT is `header.payload.signature`, base64url-encoded. The server signs the claims (user id, expiry, roles), so any service can verify the token without a database lookup. It is signed, not encrypted: anyone can read the payload, so never put secrets in it. JWTs are hard to revoke, so use short-lived access tokens plus refresh tokens.",
  "ask": "Sessions vs JWT: pros and cons? How do you log a user out, or revoke a stolen JWT?",
  "try": "Follow FastAPI's OAuth2 + JWT tutorial, then paste your token into jwt.io and read its claims.",
  "docs": [
   {
    "t": "jwt.io: Introduction to JWT",
    "u": "https://www.jwt.io/introduction"
   },
   {
    "t": "FastAPI: OAuth2 with JWT tokens",
    "u": "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=P2CPd9ynFLg",
   "title": "Why is JWT popular?",
   "ch": "ByteByteGo",
   "len": "5:14"
  }
 },
 "10": {
  "t": "OAuth 2.0 & 'Login with Google'",
  "what": "OAuth 2.0 lets a user grant your app limited access to their data on another service without giving you their password. In the Authorization Code flow (with PKCE), the user is redirected to the provider, approves access, and your backend exchanges the returned code for an access token. OpenID Connect adds an ID token on top, which is how 'Login with Google' works.",
  "ask": "Explain the OAuth 2.0 authorization code flow step by step. What is the difference between OAuth and OpenID Connect?",
  "try": "Draw the authorization code flow as boxes and arrows: user, your frontend, your backend, Google.",
  "docs": [
   {
    "t": "OAuth 2.0 overview",
    "u": "https://oauth.net/2/"
   },
   {
    "t": "Auth0: Authorization Code Flow",
    "u": "https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=ZV5yTm4pT8g",
   "title": "OAuth 2 Explained In Simple Terms",
   "ch": "ByteByteGo",
   "len": "4:32"
  }
 },
 "11": {
  "t": "Password hashing & secrets management",
  "what": "Never store passwords reversibly. Hash them with a slow, salted algorithm (Argon2id, bcrypt, scrypt, PBKDF2); the salt defeats rainbow tables, and the slowness defeats brute force. Keep secrets (API keys, DB passwords) out of code and git: load them from environment variables or a secrets manager, and rotate them.",
  "ask": "How should a backend store user passwords? Why is SHA-256 a bad choice? Where do you keep API keys?",
  "try": "Check which hasher your Django project uses (the PASSWORD_HASHERS setting) and look at a hashed password in the DB.",
  "docs": [
   {
    "t": "OWASP: Password Storage Cheat Sheet",
    "u": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=qgpsIBLvrGY",
   "title": "Password Storage Tier List: encryption, hashing, salting, bcrypt, and beyond",
   "ch": "Studying With Alex",
   "len": "10:16"
  }
 },
 "12": {
  "t": "CORS & CSRF",
  "what": "CORS is a browser rule: a page on site A can only read responses from site B if B allows it with Access-Control-Allow-Origin headers. It protects users, not your server. CSRF is an attack where another site makes the user's browser send an authenticated request (using cookies) to your site. Defend against it with CSRF tokens and SameSite cookies.",
  "ask": "Your React app on localhost:3000 can't call your API on :8000. Why, and how do you fix it safely? What is CSRF, and why does cookie auth need protection against it?",
  "try": "Configure django-cors-headers (or FastAPI's CORSMiddleware) to allow exactly one origin, and test it in the browser console.",
  "docs": [
   {
    "t": "MDN: CORS",
    "u": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"
   },
   {
    "t": "OWASP: CSRF Prevention",
    "u": "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=4KHiSt0oLJ0",
   "title": "CORS in 100 Seconds",
   "ch": "Fireship",
   "len": "2:31"
  }
 },
 "13": {
  "t": "Third-party API integration",
  "what": "Calling other companies' APIs (payments, SMS, maps) is everyday backend work. The rules: always set timeouts; retry only safe or idempotent calls, with exponential backoff and jitter; handle rate limits (429 plus the Retry-After header); wrap the client in one module; log each request ID; keep keys in environment variables; and never let a slow provider block your request thread. Move slow calls to background jobs.",
  "ask": "You integrate a payment provider that sometimes takes 30 seconds or fails. How do you design the integration so your API stays fast and reliable?",
  "try": "Write an httpx client wrapper with a timeout, 3 retries with backoff on 5xx and 429, and structured logging.",
  "docs": [
   {
    "t": "AWS Builders' Library: Timeouts, retries and backoff with jitter",
    "u": "https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter"
   },
   {
    "t": "HTTPX docs",
    "u": "https://www.python-httpx.org/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=FWAUIRYTEL0",
   "title": "Episode 38 - API Timeouts & Retries Explained — How to Handle Failures Gracefully",
   "ch": "Anupam Tech Talks",
   "len": "11:52"
  }
 },
 "14": {
  "t": "Webhooks",
  "what": "A webhook is an HTTP request another service sends to your endpoint when something happens (a payment succeeded, a repo got a push). To handle them well: verify the signature, respond 2xx quickly and do the work in a background job, and be idempotent, because providers retry and may deliver an event more than once or out of order.",
  "ask": "How do you build a reliable webhook receiver for Stripe payment events? What if the same event arrives twice?",
  "try": "Read Stripe's webhook guide, then write a FastAPI or Django endpoint that verifies a signature header and stores the event ID.",
  "docs": [
   {
    "t": "Stripe: Webhooks",
    "u": "https://docs.stripe.com/webhooks"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=Mfzucn4f9Xk",
   "title": "What Is A Webhook - Why Is It Key To Headless Architectures?",
   "ch": "Going Headless with John",
   "len": "5:38"
  }
 },
 "15": {
  "t": "Rate limiting & API keys",
  "what": "Rate limiting protects your API from abuse and noisy clients: limit requests per API key, user or IP over a time window (token bucket or sliding window), usually backed by Redis so every server shares the counts. Return 429 with Retry-After. API keys identify client apps: store only their hashes, allow rotation, and scope their permissions.",
  "ask": "How would you add per-customer rate limits to a public API running on 5 servers?",
  "try": "Add DRF throttling (UserRateThrottle) to one endpoint and hit it in a loop until you get 429.",
  "docs": [
   {
    "t": "Cloudflare: What is rate limiting?",
    "u": "https://www.cloudflare.com/learning/bots/what-is-rate-limiting/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=YXkOdWBwqaA",
   "title": "Rate Limiter System Design: Token Bucket, Leaky Bucket, Scaling",
   "ch": "ByteByteGo",
   "len": "7:46"
  }
 },
 "16": {
  "t": "Caching layers & HTTP caching",
  "what": "Cache at every layer: the browser (Cache-Control, ETag), the CDN, the app (Redis or Memcached through Django's cache framework) and the DB (buffer cache). Pick TTLs and an invalidation strategy on purpose. ETag with If-None-Match gives a cheap 304 Not Modified. Never cache per-user data in a shared cache without the user in the key.",
  "ask": "Where would you add caching to speed up a slow product-listing API, and how would you keep the cache correct after an update?",
  "try": "Use Django's `cache_page` or the low-level `cache.get`/`cache.set` with Redis on one view and measure the response time before and after.",
  "docs": [
   {
    "t": "MDN: HTTP caching",
    "u": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"
   },
   {
    "t": "Django: Cache framework",
    "u": "https://docs.djangoproject.com/en/stable/topics/cache/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=dGAgxozNWFE",
   "title": "Cache Systems Every Developer Should Know",
   "ch": "ByteByteGo",
   "len": "5:48"
  }
 },
 "17": {
  "t": "Background jobs & message queues",
  "what": "Anything slow or retryable (emails, reports, third-party calls, image processing) belongs in a background job, not the request. The web app puts a message on a broker (Redis or RabbitMQ), and workers process it. Know the trade-offs: at-least-once delivery, retries, idempotency, dead-letter queues, and Kafka (a log with replay) vs RabbitMQ (a queue with routing).",
  "ask": "Why move work out of the request cycle? What problems do queues introduce, and how do you handle them?",
  "try": "Set up Celery with Redis locally and move one slow function (like sending an email) into a task with retries.",
  "docs": [
   {
    "t": "Celery: First steps",
    "u": "https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html"
   },
   {
    "t": "RabbitMQ tutorials",
    "u": "https://www.rabbitmq.com/tutorials"
   },
   {
    "t": "Apache Kafka: Introduction",
    "u": "https://kafka.apache.org/intro"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=VRHVEporra0",
   "title": "Getting Started With Celery: Asynchronous Tasks in Python",
   "ch": "Pretty Printed",
   "len": "11:34"
  }
 },
 "18": {
  "t": "Multi-tenancy: architecture patterns",
  "what": "A multi-tenant SaaS serves many customers (tenants) from one system. There are three common patterns: a shared DB with a tenant_id column on every table (cheapest, needs strict filtering); a schema per tenant (good isolation, more migrations); a database per tenant (strongest isolation, highest cost). The key risks are data leaking between tenants and 'noisy neighbours'.",
  "ask": "You're building a SaaS for 500 companies. Shared tables with tenant_id, schema-per-tenant, or DB-per-tenant? What are the trade-offs?",
  "try": "Take the practice e-commerce schema and add tenant_id everywhere: which primary keys, unique constraints and indexes must change?",
  "docs": [
   {
    "t": "Microsoft: Multi-tenant SaaS database tenancy patterns",
    "u": "https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=60ccSmOxpMw",
   "title": "Multitenancy Explained",
   "ch": "IBM Technology",
   "len": "3:01"
  }
 },
 "19": {
  "t": "Multi-tenancy in Django & Postgres",
  "what": "In Django, tenant_id isolation is usually a tenant resolved from the subdomain or JWT in middleware, plus a base manager or queryset that always filters by tenant. django-tenants implements schema-per-tenant on Postgres. Postgres Row-Level Security adds a database-level safety net, so even a forgotten filter can't leak another tenant's rows.",
  "ask": "How do you guarantee that one tenant can never see another tenant's data, even if a developer forgets a filter?",
  "try": "Enable Row-Level Security on a table with a policy `tenant_id = current_setting('app.tenant_id')::int` and test it with two tenants.",
  "docs": [
   {
    "t": "PostgreSQL: Row Security Policies",
    "u": "https://www.postgresql.org/docs/current/ddl-rowsecurity.html"
   },
   {
    "t": "django-tenants documentation",
    "u": "https://django-tenants.readthedocs.io/en/latest/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=seTUY18ge38",
   "title": "django-tenants - Deep dive with Django and PostgreSQL!",
   "ch": "BugBytes",
   "len": "50:38"
  }
 },
 "20": {
  "t": "Database migrations & zero-downtime deploys",
  "what": "Schema changes on a live database must not lock tables or break the version of the code that is still running. Use the expand → migrate → contract pattern: add a nullable column, deploy code that writes to both columns, backfill in batches, switch reads, and drop the old column later. Build indexes CONCURRENTLY, and watch out for migrations that rewrite whole tables.",
  "ask": "How would you rename a column on a 50-million-row table without downtime?",
  "try": "Run `python manage.py sqlmigrate` on one of your migrations and check which statements would lock the table.",
  "docs": [
   {
    "t": "Django: Migrations",
    "u": "https://docs.djangoproject.com/en/stable/topics/migrations/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=cw5K2O4AHJc",
   "title": "How do software projects achieve zero downtime database migrations?",
   "ch": "Web Dev Cody",
   "len": "7:06"
  }
 },
 "21": {
  "t": "Observability: logs, metrics, traces",
  "what": "Logs tell you what happened (use structured JSON logs with a request ID). Metrics tell you how much and how fast: rates, errors, latency percentiles (p95/p99). Traces show where the time went across services. Alert on symptoms users feel (error rate, latency), not on every CPU spike. OpenTelemetry is the standard way to instrument all three.",
  "ask": "Users say the API is 'slow sometimes'. What would you look at, and what would you have wanted in place beforehand?",
  "try": "Add a request-ID middleware and structured logging (Python logging with a JSON formatter) to one of your apps.",
  "docs": [
   {
    "t": "OpenTelemetry: Observability primer",
    "u": "https://opentelemetry.io/docs/concepts/observability-primer/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=aJpzr8648XE",
   "title": "Metrics, Logs and Traces: What To Observe and  Why",
   "ch": "Tech Upskill",
   "len": "8:09"
  }
 },
 "22": {
  "t": "Docker & containers",
  "what": "A container packages your app with its runtime and dependencies, so it runs the same on your laptop, in CI and in production. An image is built from a Dockerfile in layers, and a container is a running image. docker-compose runs multi-service setups (app, Postgres, Redis) locally. Containers are not VMs: they share the host kernel.",
  "ask": "What's the difference between an image and a container? Between a container and a VM? How do you keep a Python image small?",
  "try": "Write a Dockerfile for a small FastAPI app (python:3.12-slim, pip install, uvicorn) plus a compose file with Postgres.",
  "docs": [
   {
    "t": "Docker: What is a container?",
    "u": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=Gjnup-PuquQ",
   "title": "Docker in 100 Seconds",
   "ch": "Fireship",
   "len": "2:07"
  }
 },
 "23": {
  "t": "CI/CD pipelines",
  "what": "Continuous integration runs lint, type checks and tests on every push or PR, so broken code never merges. Continuous delivery or deployment builds an artifact (like a Docker image) and ships it automatically, often to staging first. Add migrations, health checks and a rollback plan. GitHub Actions workflows are YAML files in .github/workflows.",
  "ask": "Describe a CI/CD pipeline you'd set up for a Django app, from git push to production.",
  "try": "Add a GitHub Actions workflow that runs `pytest` and `ruff` on every push to one of your repos.",
  "docs": [
   {
    "t": "GitHub: Understanding GitHub Actions",
    "u": "https://docs.github.com/en/actions/get-started/understand-github-actions"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=42UP1fxi2SY",
   "title": "CI/CD In 5 Minutes | Is It Worth The Hassle: Crash Course System Design #2",
   "ch": "ByteByteGo",
   "len": "5:46"
  }
 },
 "24": {
  "t": "The Twelve-Factor App",
  "what": "Twelve rules for cloud-ready backends: config in environment variables, stateless processes, backing services (DB, Redis) as attached resources, separate build/release/run stages, logs as event streams, disposable processes, and dev/prod parity. Most modern deployment platforms (Vercel, Heroku, Kubernetes) assume you follow them.",
  "ask": "Which of the twelve factors does your last project break, and how would you fix it?",
  "try": "Audit one of your projects against the 12 factors and write down 3 concrete fixes.",
  "docs": [
   {
    "t": "The Twelve-Factor App",
    "u": "https://12factor.net/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=Y6DuHziled0",
   "title": "12 Factor App Explained in 6 Minutes  | Visual Guide for DevOps & Developers",
   "ch": "SKSecOps",
   "len": "5:58"
  }
 },
 "25": {
  "t": "LLM integration: calling a model API",
  "what": "Integrating an LLM means calling a provider's HTTP API (Anthropic, OpenAI and others) from your backend: send messages (system prompt plus user and assistant turns), get text back. Treat it like any third-party API: keep the key server-side, set timeouts, retry on 429 and 529/5xx with backoff, log token usage for cost, and never trust the output blindly, especially if it drives actions.",
  "ask": "How would you add an 'AI summary' feature to an existing Django app? Where does the call happen, and how do you handle slowness, cost and failures?",
  "try": "Call an LLM API from a FastAPI endpoint that summarizes a text you POST, with a timeout and error handling.",
  "docs": [
   {
    "t": "Claude API: Overview",
    "u": "https://platform.claude.com/docs/en/api/overview"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=cy6EAp4iNN4",
   "title": "How To Build an API with Python (LLM Integration, FastAPI, Ollama & More)",
   "ch": "Tech With Tim",
   "len": "21:17"
  }
 },
 "26": {
  "t": "LLM tool calling & structured output",
  "what": "Tool calling (function calling) lets the model ask your code to run a function: you describe tools with a JSON schema, the model returns a tool call with arguments, your backend executes it, and you send the result back. Structured output makes the model return JSON that matches a schema, so you can parse it safely. Validate it (Pydantic) before using it.",
  "ask": "How would you let an LLM look up a customer's order status from your database safely? What must you validate?",
  "try": "Define one tool (get_order_status(order_id)) and implement the request → tool call → tool result → final answer loop.",
  "docs": [
   {
    "t": "Claude docs: Tool use",
    "u": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
   },
   {
    "t": "Claude docs: Structured outputs",
    "u": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
   "title": "What is Tool Calling? Connecting LLMs to Your Data",
   "ch": "IBM Technology",
   "len": "4:57"
  }
 },
 "27": {
  "t": "RAG, embeddings & vector search",
  "what": "Retrieval-Augmented Generation answers questions from your own data: split documents into chunks, embed each chunk as a vector, store the vectors (e.g. Postgres with pgvector), then at question time embed the query, retrieve the most similar chunks and put them in the prompt. Quality depends mostly on chunking, retrieval (hybrid keyword plus vector search, reranking) and evaluation.",
  "ask": "Design a 'chat with our docs' feature for a SaaS. How do you store, retrieve and keep the knowledge up to date?",
  "try": "Install pgvector, store embeddings for 20 short texts, and query the nearest neighbours of a question with `ORDER BY embedding <-> query`.",
  "docs": [
   {
    "t": "pgvector (GitHub)",
    "u": "https://github.com/pgvector/pgvector"
   },
   {
    "t": "Anthropic: Contextual retrieval",
    "u": "https://www.anthropic.com/engineering/contextual-retrieval"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
   "title": "What is Retrieval-Augmented Generation (RAG)?",
   "ch": "IBM Technology",
   "len": "6:36"
  }
 },
 "28": {
  "t": "LLMs in production: streaming, caching, cost",
  "what": "Stream tokens to the user (SSE) so responses feel fast. Cache what you can: prompt caching for long, repeated system prompts, and app-level caches for identical requests. Track tokens and cost per feature, set per-user limits, choose smaller models for simple tasks, and evaluate output quality with test sets before changing prompts or models.",
  "ask": "Your LLM feature costs too much and feels slow. What would you change?",
  "try": "Turn yesterday's endpoint into a streaming one (FastAPI StreamingResponse or SSE) and log input and output tokens per request.",
  "docs": [
   {
    "t": "Claude docs: Streaming messages",
    "u": "https://platform.claude.com/docs/en/build-with-claude/streaming"
   },
   {
    "t": "Claude docs: Prompt caching",
    "u": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=EQOznhaJWR0",
   "title": "Slash API Costs: Mastering Caching for LLM Applications",
   "ch": "Prompt Engineering",
   "len": "12:58"
  }
 },
 "29": {
  "t": "gRPC & service-to-service communication",
  "what": "REST+JSON is great for public APIs. Inside a system, services often use gRPC: typed contracts in .proto files, compact binary Protobuf messages over HTTP/2, generated clients and servers, and streaming. The alternatives are asynchronous messaging through queues or event buses. Choose synchronous calls when you need an answer now, and events when you want loose coupling.",
  "ask": "REST vs gRPC vs messaging between microservices: when would you use each?",
  "try": "Read the gRPC intro and write a .proto file for an OrderService with GetOrder and ListOrders.",
  "docs": [
   {
    "t": "gRPC: Introduction",
    "u": "https://grpc.io/docs/what-is-grpc/introduction/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=gnchfOojMk4",
   "title": "What is RPC? gRPC Introduction.",
   "ch": "ByteByteGo",
   "len": "6:09"
  }
 },
 "30": {
  "t": "API security: OWASP API Top 10",
  "what": "The biggest API risk is broken object-level authorization: GET /orders/43 returns someone else's order because the code checked login but not ownership. The others include broken authentication, excessive data exposure, missing rate limits, mass assignment, SSRF and poor inventory of old endpoints. Check ownership on every object and whitelist the fields you accept and return.",
  "ask": "Name three API vulnerabilities from the OWASP API Top 10 and how you'd prevent each in DRF or FastAPI.",
  "try": "Review one of your API views: does every object lookup filter by the current user or tenant? Fix the one that doesn't.",
  "docs": [
   {
    "t": "OWASP API Security Top 10 (2023)",
    "u": "https://owasp.org/API-Security/editions/2023/en/0x11-t10/"
   }
  ],
  "video": {
   "u": "https://www.youtube.com/watch?v=YYe0FdfdgDU",
   "title": "OWASP API Security Top 10 Course – Secure Your Web Apps",
   "ch": "freeCodeCamp.org",
   "len": "1:27:01"
  }
 }
};
