// The 30-day plan: every day, track and item. Edit tasks here.
// Item keys (d<day>-<track>-<index>) are what gets saved, so don't reorder
// items inside a day once you've started ticking them.
(function(){
const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const lc = s => "https://leetcode.com/problems/" + s + "/";
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
// P = LeetCode problem (counts toward stats), L = learn/read/watch with link, T = task
const P = (n, t, s) => ({k:"p", n, t, u: lc(s || slug(t))});
const L = (t, u) => ({k:"l", t, u});
const T = (t, u) => ({k:"t", t, u});
const V = t => yt("neetcode " + t); // video solution search for DSA problems
const RP = "https://realpython.com/";
const PGT = "https://www.postgresqltutorial.com/";
const JOB = [T("Apply to 5 jobs + send 1 follow-up / recruiter message")];

const DAYS = [
 {f:"Big-O + Arrays & Hashing", s:"Set up Postgres, first SELECTs", dsa:[
   L("Watch: Big-O notation explained", yt("neetcode big o notation")),
   L("Skim the Big-O cheat sheet (arrays, hash maps, sorting)", "https://www.bigocheatsheet.com/"),
   P(1,"Two Sum"), P(217,"Contains Duplicate"), P(242,"Valid Anagram")],
  sql:[T("Install PostgreSQL + DBeaver (or pgAdmin); create a database called practice", "https://www.postgresql.org/download/"),
   L("SQLBolt lessons 1–4: SELECT, WHERE, ORDER BY, LIMIT", "https://sqlbolt.com/lesson/select_queries_introduction"),
   P(1757,"Recyclable and Low Fat Products"), P(584,"Find Customer Referee"), P(595,"Big Countries")],
  py:[L("Read: Facts and myths about Python names and values", "https://nedbatchelder.com/text/names.html"),
   T("Code: reproduce the a = b = [] aliasing bug, then fix it"),
   T("Answer aloud: `is` vs `==`? Which built-in types are mutable vs immutable?")],
  sd:[L("Watch: What happens when you type a URL into a browser", yt("bytebytego what happens when you type a url")),
   T("Notes: DNS → TCP → TLS → HTTP request → server → response, one line each")]},

 {f:"Hashing patterns", s:"JOINs and NULLs", dsa:[
   P(49,"Group Anagrams"), P(347,"Top K Frequent Elements"), P(383,"Ransom Note"),
   T("Notes: 'use a hashmap to count / group' pattern")],
  sql:[L("SQLBolt lessons 6–8: INNER JOIN, OUTER JOIN, NULLs", "https://sqlbolt.com/lesson/select_queries_with_joins"),
   P(1148,"Article Views I"), P(1683,"Invalid Tweets"), P(1378,"Replace Employee ID With The Unique Identifier")],
  py:[L("Read: Python TimeComplexity (list, dict, set)", "https://wiki.python.org/moin/TimeComplexity"),
   T("Learn: how dict/set use hashing; why a list can't be a dict key"),
   T("Answer aloud: complexity of `x in list` vs `x in set` — and why?")],
  sd:[L("Watch: REST vs GraphQL vs gRPC", yt("bytebytego rest vs graphql vs grpc")),
   L("Watch: WebSockets vs long polling vs SSE", yt("websockets vs long polling vs server sent events")),
   T("Notes: which backend features actually need WebSockets?")]},

 {rev:true, f:"Revision + resume", s:"Week 1 checkpoint", items:[
   T("Redo from memory (no peeking): Two Sum, Group Anagrams, Top K Frequent Elements"),
   T("Re-run every SQL query from this week in your local Postgres"),
   T("Resume: 1 page; each project bullet = action + tech + measurable result"),
   T("LinkedIn: update headline, turn on Open to Work; list 30 target companies in a sheet"),
   T("Write 5 questions from this week you still can't answer — tackle them first on Monday")]},

 {f:"Array tricks", s:"Aggregates & GROUP BY", dsa:[
   P(238,"Product of Array Except Self"), P(36,"Valid Sudoku"), P(128,"Longest Consecutive Sequence"),
   T("Notes: prefix/suffix products; 'set for O(1) lookup' trick")],
  sql:[L("SQLBolt lessons 9–12: expressions, aggregates, GROUP BY / HAVING, query order", "https://sqlbolt.com/lesson/select_queries_with_expressions"),
   T("Memorize the logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT"),
   P(1068,"Product Sales Analysis I"), P(1581,"Customer Who Visited but Did Not Make Any Transactions"), P(620,"Not Boring Movies")],
  py:[L("Read: Python scope — LEGB rule, global, nonlocal", RP + "python-scope-legb-rule/"),
   T("Learn: shallow vs deep copy; the mutable default argument trap def f(x=[])"),
   T("Answer aloud: what is a closure? Write one on paper.")],
  sd:[L("Watch: Vertical vs horizontal scaling", yt("vertical vs horizontal scaling system design")),
   L("Watch: Load balancers — L4 vs L7, round robin, least connections", yt("bytebytego load balancer")),
   T("Notes: why app servers must be stateless to scale; where do sessions go?")]},

 {f:"Two pointers", s:"Tables, keys & constraints", dsa:[
   L("Watch: Two pointers pattern", yt("neetcode two pointers")),
   P(125,"Valid Palindrome"), P(167,"Two Sum II - Input Array Is Sorted"), P(15,"3Sum","3sum")],
  sql:[L("SQLBolt lessons 13–18: INSERT, UPDATE, DELETE, CREATE, ALTER, DROP", "https://sqlbolt.com/lesson/inserting_rows"),
   T("Learn: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, ON DELETE CASCADE"),
   L("Load the dvdrental sample database into Postgres", PGT + "postgresql-getting-started/postgresql-sample-database/"),
   P(197,"Rising Temperature"), P(1661,"Average Time of Process per Machine")],
  py:[T("Learn: *args / **kwargs, keyword-only args, unpacking"),
   T("Learn: list / dict / set comprehensions and generator expressions"),
   T("Code: flatten a 2-level nested list in one comprehension; invert a dict"),
   T("Answer aloud: difference between [x for x in …] and (x for x in …)?")],
  sd:[L("Latency numbers every programmer should know", "https://gist.github.com/jboner/2841832"),
   L("Watch: Back-of-the-envelope estimation", yt("system design back of the envelope estimation")),
   T("Practice: estimate QPS + storage for 10M daily users posting 2 photos/day")]},

 {f:"Two pointers II", s:"JOIN deep dive", dsa:[
   P(11,"Container With Most Water"), P(283,"Move Zeroes"), P(26,"Remove Duplicates from Sorted Array")],
  sql:[L("Read: PostgreSQL joins — self, cross, full outer", PGT + "postgresql-tutorial/postgresql-joins/"),
   T("dvdrental: find customers who never rented (LEFT JOIN … WHERE r.rental_id IS NULL)"),
   P(577,"Employee Bonus"), P(1280,"Students and Examinations"), P(570,"Managers with at Least 5 Direct Reports")],
  py:[L("Read: Introduction to Python generators", RP + "introduction-to-python-generators/"),
   T("Learn: iterator protocol (__iter__ / __next__), yield vs return, yield from"),
   T("Code: generator that streams a huge log file and yields only ERROR lines"),
   T("Answer aloud: why are generators memory-efficient?")],
  sd:[L("Watch: Caching strategies — cache-aside, write-through, write-back", yt("bytebytego caching strategies")),
   T("Learn: TTL, invalidation, cache stampede / thundering herd"),
   T("Notes: how you'd cache a Django product-detail API with Redis")]},

 {f:"Sliding window", s:"Aggregation practice", dsa:[
   L("Watch: Sliding window pattern", yt("neetcode sliding window")),
   P(121,"Best Time to Buy and Sell Stock"), P(3,"Longest Substring Without Repeating Characters"), P(424,"Longest Repeating Character Replacement")],
  sql:[P(1934,"Confirmation Rate"), P(1251,"Average Selling Price"), P(1075,"Project Employees I"), P(1633,"Percentage of Users Attended a Contest")],
  py:[L("Read: Primer on Python decorators", RP + "primer-on-python-decorators/"),
   T("Code: @timer, @retry(times=3) and @cache decorators using functools.wraps"),
   T("Answer aloud: what does functools.wraps fix? How do decorators with arguments work?")],
  sd:[L("Watch: How a CDN works", yt("bytebytego cdn")),
   L("Watch: Object vs block vs file storage", yt("bytebytego object block file storage")),
   T("Notes: serving user-uploaded images — presigned URL → S3 → CDN")]},

 {f:"Sliding window + prefix sum", s:"Conditional aggregation", dsa:[
   P(567,"Permutation in String"), P(303,"Range Sum Query - Immutable","range-sum-query-immutable"), P(560,"Subarray Sum Equals K")],
  sql:[T("Learn: CASE WHEN inside SUM/COUNT, COALESCE, ROUND, date_trunc"),
   P(1211,"Queries Quality and Percentage"), P(1193,"Monthly Transactions I"), P(1174,"Immediate Food Delivery II")],
  py:[L("Read: Object-oriented programming in Python", RP + "python3-object-oriented-programming/"),
   T("Learn: instance vs class attributes, @property, @classmethod vs @staticmethod"),
   T("Code: BankAccount class with a validated @property balance"),
   T("Answer aloud: when would you use classmethod vs staticmethod?")],
  sd:[L("Watch: SQL vs NoSQL — how to choose", yt("bytebytego sql vs nosql")),
   T("Notes: you've used MongoDB — 3 cases where Mongo fits, 3 where Postgres is better")]},

 {f:"Stack", s:"Subqueries, IN vs EXISTS", dsa:[
   L("Watch: Stack problems pattern", yt("neetcode stack")),
   P(20,"Valid Parentheses"), P(155,"Min Stack"), P(150,"Evaluate Reverse Polish Notation")],
  sql:[T("Learn: subqueries in WHERE / FROM / SELECT, IN vs EXISTS, correlated subqueries"),
   P(550,"Game Play Analysis IV"), P(2356,"Number of Unique Subjects Taught by Each Teacher"), P(1141,"User Activity for the Past 30 Days I")],
  py:[L("Read: Python method resolution order", "https://docs.python.org/3/howto/mro.html"),
   T("Learn: inheritance, super(), MRO / C3, the diamond problem"),
   T("Learn: mixins — read how DRF's ListModelMixin / CreateModelMixin compose a ViewSet"),
   T("Answer aloud: what does Class.__mro__ print for a diamond hierarchy?")],
  sd:[L("Watch: Database replication — leader/follower, replication lag", yt("bytebytego database replication")),
   T("Notes: the read-your-own-writes problem with read replicas — how do you solve it?")]},

 {rev:true, f:"Revision + SQL self-test", s:"Week 1 wrap-up", items:[
   T("Redo from memory: 3Sum, Longest Substring Without Repeating Characters, Product of Array Except Self, Min Stack"),
   T("SQL self-test on dvdrental, 45 min: top 5 customers by spend · films never rented · revenue per month · category with most rentals · sales per staff member"),
   T("Record yourself: explain caching, load balancers, SQL vs NoSQL — 2 minutes each"),
   T("Python: write a decorator, a generator and a closure from scratch, no notes"),
   T("Apply to 10 jobs; follow up on last week's applications")]},

 {f:"Monotonic stack", s:"CTEs (WITH)", dsa:[
   P(739,"Daily Temperatures"), P(496,"Next Greater Element I"), P(232,"Implement Queue using Stacks")],
  sql:[L("Read: PostgreSQL CTEs", PGT + "postgresql-tutorial/postgresql-cte/"),
   P(1070,"Product Sales Analysis III"), P(596,"Classes More Than 5 Students"), P(1729,"Find Followers Count"), P(619,"Biggest Single Number")],
  py:[L("Read: Python data model (special methods)", "https://docs.python.org/3/reference/datamodel.html#special-method-names"),
   T("Learn: __new__ vs __init__, __repr__ vs __str__, __eq__ + __hash__, __len__, __getitem__, __call__"),
   T("Code: a Money class that supports +, ==, sorting and use as a dict key"),
   T("Answer aloud: why does defining __eq__ make instances unhashable?")],
  sd:[L("Watch: Sharding and partitioning", yt("bytebytego database sharding")),
   L("Watch: Consistent hashing", yt("bytebytego consistent hashing")),
   T("Notes: shard key for an orders table — user_id vs order_id trade-offs")]},

 {f:"Binary search", s:"Window functions I", dsa:[
   L("Watch: Binary search template", yt("neetcode binary search")),
   P(704,"Binary Search"), P(35,"Search Insert Position"), P(74,"Search a 2D Matrix")],
  sql:[L("PostgreSQL docs: Window functions tutorial", "https://www.postgresql.org/docs/current/tutorial-window.html"),
   T("Learn: ROW_NUMBER vs RANK vs DENSE_RANK, PARTITION BY"),
   P(1045,"Customers Who Bought All Products"), P(176,"Second Highest Salary"), P(185,"Department Top Three Salaries")],
  py:[L("Read: contextlib", "https://docs.python.org/3/library/contextlib.html"),
   T("Learn: with, __enter__ / __exit__, @contextmanager; try / except / else / finally; raise … from …"),
   T("Code: a Timer context manager + a 'transaction' context manager that rolls back on exception")],
  sd:[L("Watch: CAP theorem", yt("bytebytego cap theorem")),
   T("Learn: strong vs eventual consistency, PACELC"),
   T("Notes: is a bank balance CP or AP? A like counter?")]},

 {f:"Binary search on the answer", s:"Window functions II", dsa:[
   P(875,"Koko Eating Bananas"), P(153,"Find Minimum in Rotated Sorted Array"), P(33,"Search in Rotated Sorted Array")],
  sql:[T("Learn: LAG / LEAD, running totals SUM() OVER (ORDER BY …), moving averages with ROWS BETWEEN"),
   P(180,"Consecutive Numbers"), P(1321,"Restaurant Growth"), P(1204,"Last Person to Fit in the Bus")],
  py:[L("Read: Memory management in Python", RP + "python-memory-management/"),
   T("Learn: reference counting, the cyclic GC, __slots__, small-int caching and string interning"),
   T("Answer aloud: why can `a is b` be True for 256 but False for 1000?")],
  sd:[L("Watch: Kafka vs RabbitMQ — message queues", yt("bytebytego kafka vs rabbitmq")),
   T("Learn: pub/sub, at-least-once delivery, idempotent consumers, dead-letter queues"),
   T("Notes: map this to your Celery + Redis work — what happens if a worker dies mid-task?")]},

 {f:"Linked list", s:"Advanced SELECT & joins", dsa:[
   L("Watch: Linked lists in Python", yt("neetcode linked list")),
   P(206,"Reverse Linked List"), P(21,"Merge Two Sorted Lists"), P(141,"Linked List Cycle")],
  sql:[P(1731,"The Number of Employees Which Report to Each Employee"), P(1789,"Primary Department for Each Employee"),
   P(610,"Triangle Judgement"), P(1164,"Product Price at a Given Date"), P(1907,"Count Salary Categories")],
  py:[L("Read: What is the Python GIL?", RP + "python-gil/"),
   T("Learn: CPU-bound vs I/O-bound; why threads don't speed up CPU work; Python 3.13 free-threaded build"),
   T("Answer aloud: how would you speed up a CPU-heavy image-resize job in Python?")],
  sd:[L("Watch: Monolith vs microservices", yt("bytebytego monolith vs microservices")),
   L("Watch: What is an API gateway", yt("bytebytego api gateway")),
   T("Notes: when is a monolith the right choice for a startup?")]},

 {f:"Fast & slow pointers", s:"Subqueries II", dsa:[
   P(876,"Middle of the Linked List"), P(19,"Remove Nth Node From End of List"), P(143,"Reorder List")],
  sql:[P(1978,"Employees Whose Manager Left the Company"), P(626,"Exchange Seats"), P(1341,"Movie Rating"),
   P(602,"Friend Requests II: Who Has the Most Friends","friend-requests-ii-who-has-the-most-friends"), P(585,"Investments in 2016")],
  py:[L("Read: Speed up your Python program with concurrency", RP + "python-concurrency/"),
   T("Code: download 20 URLs with threading, ThreadPoolExecutor and multiprocessing — compare timings"),
   T("Answer aloud: threading vs multiprocessing vs asyncio — when would you use each?")],
  sd:[L("Watch: Rate limiting algorithms", yt("bytebytego rate limiting algorithms")),
   T("Learn: token bucket, leaky bucket, fixed window, sliding window"),
   T("Code: a token bucket in ~20 lines of Python (you'll test it on Day 20)")]},

 {f:"LRU Cache", s:"Strings & dates in SQL", dsa:[
   P(146,"LRU Cache"), P(2,"Add Two Numbers"),
   T("Also implement LRU with collections.OrderedDict — interviewers ask for both")],
  sql:[P(1667,"Fix Names in a Table"), P(1527,"Patients With a Condition"), P(196,"Delete Duplicate Emails"),
   P(1484,"Group Sold Products By The Date"), P(1327,"List the Products Ordered in a Period"), P(1517,"Find Users With Valid E-Mails")],
  py:[L("Read: Async IO in Python", RP + "async-io-python/"),
   T("Learn: event loop, coroutines, await, asyncio.gather, create_task"),
   T("Code: fetch 20 URLs with asyncio + httpx; compare with yesterday"),
   L("Answer aloud: FastAPI `async def` vs `def` endpoints — read FastAPI's own explanation", "https://fastapi.tiangolo.com/async/")],
  sd:[L("Watch: Retries, exponential backoff, circuit breakers", yt("circuit breaker retry exponential backoff system design")),
   T("Learn: timeouts, health checks, logs vs metrics vs traces"),
   T("Notes: what would you monitor for a payments API?")]},

 {rev:true, f:"Revision + first mock interview", s:"Week 2 checkpoint", items:[
   T("Redo from memory: LRU Cache, Reverse Linked List, Search in Rotated Sorted Array, Daily Temperatures"),
   T("SQL: redo 185 and 180 without looking; explain window functions aloud"),
   L("First peer mock interview (DSA) — Exponent peer mocks or a friend", "https://www.tryexponent.com/practice"),
   T("Record a 3-minute 'tell me about your last project': architecture, your role, one hard bug, impact"),
   T("Apply to 10 jobs")]},

 {f:"Trees — DFS basics", s:"Normalization", dsa:[
   L("Watch: Binary tree traversals (DFS / BFS)", yt("neetcode binary tree traversal")),
   P(104,"Maximum Depth of Binary Tree"), P(226,"Invert Binary Tree"), P(100,"Same Tree")],
  sql:[L("Watch: Database normalization 1NF → 3NF", yt("database normalization 1nf 2nf 3nf explained")),
   T("Exercise: normalize a flat 'orders' sheet (customer, address, product, qty, price) into 3NF tables"),
   T("Answer aloud: when would you deliberately denormalize?")],
  py:[L("Read: dataclasses", "https://docs.python.org/3/library/dataclasses.html"),
   L("Read: Pydantic v2 models", "https://docs.pydantic.dev/latest/concepts/models/"),
   T("Learn: type hints — Optional, Union, generics, TypedDict"),
   T("Answer aloud: dataclass vs Pydantic model vs plain class?")],
  sd:[L("Read: Hello Interview — system design in a hurry", "https://www.hellointerview.com/learn/system-design"),
   T("Memorize a framework: requirements → entities → API → high-level design → deep dives → bottlenecks"),
   T("Write your own 1-page design template to reuse")]},

 {f:"Tree DFS", s:"Schema design lab", dsa:[
   P(572,"Subtree of Another Tree"), P(543,"Diameter of Binary Tree"), P(110,"Balanced Binary Tree")],
  sql:[T("Write DDL for an e-commerce schema: users, addresses, products, orders, order_items, payments"),
   T("Add FKs + constraints, insert sample rows, write 'top 5 products by revenue in the last 30 days'"),
   T("Answer aloud: why store the price on order_items, not only on products?")],
  py:[L("Read: collections module", "https://docs.python.org/3/library/collections.html"),
   T("Learn: Counter, defaultdict, deque, OrderedDict, namedtuple, heapq, itertools basics"),
   T("Code: top-3 most common words in a file; a moving average with deque(maxlen=n)")],
  sd:[L("Design: URL shortener", yt("bytebytego design url shortener")),
   T("Solo on paper for 30 min first, then compare"),
   T("Deep dive: base62 vs hash + collisions, 301 vs 302, caching hot links")]},

 {f:"Tree BFS", s:"Indexes I — B-trees", dsa:[
   P(102,"Binary Tree Level Order Traversal"), P(199,"Binary Tree Right Side View"), P(235,"Lowest Common Ancestor of a Binary Search Tree")],
  sql:[L("Use The Index, Luke — Ch. 1: Anatomy of an index", "https://use-the-index-luke.com/sql/anatomy"),
   L("Use The Index, Luke — Ch. 2: The WHERE clause", "https://use-the-index-luke.com/sql/where-clause"),
   T("Learn: B-tree structure, why lookups are O(log n), what indexes cost on writes")],
  py:[L("pytest docs: fixtures", "https://docs.pytest.org/en/stable/how-to/fixtures.html"),
   L("unittest.mock — patch", "https://docs.python.org/3/library/unittest.mock.html"),
   T("Learn: fixtures, @pytest.mark.parametrize, patching an external API call"),
   T("Code: tests for your Day 14 token-bucket rate limiter")],
  sd:[L("Design: Rate limiter", yt("bytebytego design rate limiter")),
   T("Solo 30 min → compare"),
   T("Deep dive: Redis INCR + EXPIRE vs sorted-set sliding window; distributed limits")]},

 {f:"Binary search trees", s:"Indexes II — EXPLAIN", dsa:[
   P(98,"Validate Binary Search Tree"), P(230,"Kth Smallest Element in a BST"), P(1448,"Count Good Nodes in Binary Tree")],
  sql:[L("PostgreSQL docs: Using EXPLAIN", "https://www.postgresql.org/docs/current/using-explain.html"),
   T("Lab: 1M rows via generate_series; EXPLAIN ANALYZE before/after adding an index"),
   T("Learn: composite index column order, covering index (INCLUDE), partial index, why LIKE '%abc' skips a B-tree")],
  py:[L("Django docs: Middleware", "https://docs.djangoproject.com/en/stable/topics/http/middleware/"),
   T("Learn: Django request lifecycle — WSGI/ASGI → middleware → URL resolver → view → response"),
   T("Code: a middleware that logs request duration"),
   T("Answer aloud: WSGI vs ASGI?")],
  sd:[L("Design: Notification system", yt("bytebytego design notification system")),
   T("Solo 30 min → compare"),
   T("Deep dive: a queue per channel (email/SMS/push), retries, dedup, user preferences")]},

 {f:"Heap / priority queue", s:"Transactions & isolation", dsa:[
   L("Watch: Heaps and Python's heapq", yt("neetcode heap priority queue")),
   P(703,"Kth Largest Element in a Stream"), P(1046,"Last Stone Weight"), P(215,"Kth Largest Element in an Array")],
  sql:[L("PostgreSQL docs: Transaction isolation", "https://www.postgresql.org/docs/current/transaction-iso.html"),
   T("Learn ACID + anomalies: dirty read, non-repeatable read, phantom, lost update"),
   T("Lab: two psql sessions — reproduce a non-repeatable read in READ COMMITTED, prevent it with REPEATABLE READ")],
  py:[L("Django docs: QuerySet API", "https://docs.djangoproject.com/en/stable/ref/models/querysets/"),
   T("Learn: QuerySet laziness, Q and F objects, annotate vs aggregate, values / values_list"),
   T("Learn: transaction.atomic, select_for_update, and why heavy logic in signals hurts")],
  sd:[L("Design: Chat system", yt("bytebytego design chat system")),
   T("Solo 30 min → compare"),
   T("Deep dive: WebSocket servers, message ordering, presence, message storage")]},

 {f:"Heap II", s:"Locking & the N+1 problem", dsa:[
   P(973,"K Closest Points to Origin"), P(621,"Task Scheduler")],
  sql:[L("PostgreSQL docs: Explicit locking", "https://www.postgresql.org/docs/current/explicit-locking.html"),
   T("Learn: row locks, SELECT … FOR UPDATE, deadlocks, optimistic (version column) vs pessimistic locking"),
   L("Django docs: Database access optimization", "https://docs.djangoproject.com/en/stable/topics/db/optimization/"),
   T("Lab: create an N+1 in Django, spot it with django-debug-toolbar, fix with select_related / prefetch_related")],
  py:[L("Django REST framework docs", "https://www.django-rest-framework.org/"),
   T("Learn: Serializer vs ModelSerializer, validate_<field>, nested serializers, ViewSets + routers"),
   T("Learn: auth (Session / Token / JWT with simplejwt), permissions, throttling, pagination")],
  sd:[L("Design: News feed", yt("bytebytego design news feed system")),
   T("Deep dive: fan-out on write vs fan-out on read; the celebrity problem")]},

 {rev:true, f:"Full mock loop", s:"Week 3 checkpoint", items:[
   T("Timed loop: 1 DSA medium (45 min) + 3 SQL problems (30 min) + 1 system design (45 min)"),
   T("Redo from memory: Validate BST, Level Order Traversal, Kth Largest Element, Top K Frequent"),
   L("Peer mock #2 — system design", "https://www.tryexponent.com/practice"),
   T("Prepare answers: why you left, salary expectation, a conflict you handled"),
   T("Apply to 10 jobs")]},

 {f:"Graphs on grids", s:"MongoDB modeling (your strength)", dsa:[
   L("Watch: Graph BFS / DFS on a grid", yt("neetcode number of islands graph")),
   P(200,"Number of Islands"), P(733,"Flood Fill"), P(695,"Max Area of Island")],
  sql:[L("MongoDB docs: Data modeling", "https://www.mongodb.com/docs/manual/data-modeling/"),
   T("Learn: embed vs reference, Mongo indexes, aggregation pipeline ($match, $group, $lookup)"),
   T("Answer aloud: model users + orders in Mongo and in Postgres — trade-offs?")],
  py:[L("FastAPI docs: Dependencies", "https://fastapi.tiangolo.com/tutorial/dependencies/"),
   T("Learn: dependency injection, request/response models, BackgroundTasks, middleware, lifespan"),
   T("Answer aloud: Django vs FastAPI — when do you pick each?")],
  sd:[L("Design: E-commerce checkout / order system", yt("system design ecommerce order checkout")),
   T("Deep dive: inventory reservation, payment idempotency keys, order state machine, outbox pattern")]},

 {f:"Graphs — BFS & topological sort", s:"Redis", dsa:[
   P(133,"Clone Graph"), P(994,"Rotting Oranges"), P(207,"Course Schedule"),
   T("Notes: topological sort with Kahn's algorithm")],
  sql:[L("Redis docs: Data types", "https://redis.io/docs/latest/develop/data-types/"),
   T("Learn: strings, hashes, lists, sets, sorted sets; TTL; eviction policies (allkeys-lru)"),
   T("Explain: cache, session store, rate limiter, leaderboard (ZSET), lock (SET NX PX)")],
  py:[L("Celery docs: Tasks", "https://docs.celeryq.dev/en/stable/userguide/tasks.html"),
   T("Learn: broker vs result backend, retries with backoff, acks_late, idempotent tasks, beat, chains / groups / chords"),
   T("Answer aloud: a Celery task sent an email twice — why, and how do you prevent it?")],
  sd:[L("Design: Unique ID generator (Snowflake)", yt("bytebytego unique id generator snowflake")),
   T("Learn: UUID vs auto-increment vs Snowflake; why ordered IDs matter for B-tree indexes")]},

 {f:"Backtracking", s:"Scaling a database", dsa:[
   L("Watch: Backtracking template", yt("neetcode backtracking subsets")),
   P(78,"Subsets"), P(46,"Permutations"), P(39,"Combination Sum")],
  sql:[T("Learn: connection pooling (PgBouncer, Django CONN_MAX_AGE), read replicas via Django DB routers"),
   T("Learn: Postgres partitioning (range / list / hash) vs sharding across servers"),
   T("Answer aloud: 'Our Postgres is slow' — walk through slow-query log → EXPLAIN → indexes → pooling → cache → replicas")],
  py:[L("OWASP Top 10", "https://owasp.org/www-project-top-ten/"),
   T("Learn: JWT vs sessions, refresh tokens, OAuth2 authorization-code flow, bcrypt / argon2"),
   T("Learn: SQL injection, XSS, CSRF, CORS — how Django protects against each")],
  sd:[L("Design: Dropbox / file storage", yt("bytebytego design google drive dropbox")),
   T("Deep dive: presigned uploads, chunking, metadata DB vs blob store, sync conflicts")]},

 {f:"Dynamic programming I", s:"Timed SQL mock", dsa:[
   L("Watch: Dynamic programming for beginners", yt("neetcode dynamic programming climbing stairs")),
   P(70,"Climbing Stairs"), P(746,"Min Cost Climbing Stairs"), P(198,"House Robber")],
  sql:[T("Mock: 5 SQL-50 problems you haven't redone — 60-minute timer, no hints")],
  py:[T("REST design: status codes 200/201/204/400/401/403/404/409/422/429/500; idempotent methods; PUT vs PATCH"),
   T("Pagination (offset vs cursor), versioning, filtering, consistent error format"),
   L("Skim: Microsoft REST API guidelines", "https://github.com/microsoft/api-guidelines")],
  sd:[L("Design: Ticket booking (seat locking)", yt("system design ticket booking ticketmaster")),
   T("Deep dive: hold a seat for 10 min (Redis TTL vs DB row lock); preventing double booking")]},

 {f:"Dynamic programming II", s:"DB theory out loud", dsa:[
   P(322,"Coin Change"), P(53,"Maximum Subarray"), P(62,"Unique Paths")],
  sql:[T("Record yourself, 1 min each: B-tree index, composite order, EXPLAIN, ACID, isolation levels, N+1, normalization, replication vs sharding")],
  py:[T("Output-prediction drill: mutable defaults, late-binding lambdas in loops, `is` vs `==`, [[0]*3]*3, return inside finally"),
   T("Rapid-fire 30 Python questions from your notes — mark every hesitation and review it")],
  sd:[T("Redesign your last job's system at 100× scale: draw it, find the bottleneck, fix it — you'll be asked this")]},

 {f:"Intervals + final mocks", s:"Day 30 — wrap up", dsa:[
   P(56,"Merge Intervals"), P(57,"Insert Interval"),
   T("Timed: 2 random mediums from this month, 45 min each, talking aloud")],
  sql:[T("Final SQL mock: redo 185, 1321 and 1934 in 30 minutes")],
  py:[T("Final Python/Django mock: have a friend (or Claude) ask you 20 questions")],
  sd:[T("Final design mock, 45 min: Pastebin or a parking-lot booking API"),
   T("Write your month-2 plan: rest of NeetCode 150 + big-tech system design")]}
];

const TRACKS = [
  {id:"dsa", name:"DSA", hrs:"2 h", c:"var(--dsa)"},
  {id:"sql", name:"SQL / Databases", hrs:"1.5 h", c:"var(--sql)"},
  {id:"py",  name:"Python / Frameworks", hrs:"1 h", c:"var(--py)"},
  {id:"sd",  name:"System Design", hrs:"1 h", c:"var(--sd)"},
  {id:"job", name:"Job search", hrs:"45 min", c:"var(--job)"}
];
const WEEKS = [
  {n:1, t:"Foundations", from:0, to:9},
  {n:2, t:"Core depth", from:10, to:16},
  {n:3, t:"Applied — designs, indexes, frameworks", from:17, to:23},
  {n:4, t:"Graphs, DP, scaling, mocks", from:24, to:29}
];

// Day 1 = Fri 25 Sep 2026
const START = new Date(2026, 8, 25);
DAYS.forEach((d, i) => { d.date = new Date(START.getFullYear(), START.getMonth(), START.getDate() + i); d.idx = i; });
DAYS.forEach(d => {
  if (d.rev) { d.items.forEach((it, j) => it.key = `d${d.idx+1}-rev-${j}`); return; }
  d.job = JOB.map(x => ({...x}));
  TRACKS.forEach(tr => (d[tr.id] || []).forEach((it, j) => it.key = `d${d.idx+1}-${tr.id}-${j}`));
});

window.PLAN = { DAYS, TRACKS, WEEKS, START, V };
})();
