// "Learn first" notes for the DB container: one per DB section, shown above that day's 5 questions.
// Reading links all point to one reference, the PostgreSQL Tutorial (postgresqltutorial.com, now on neon.com).
(function(){
const T = "https://neon.com/postgresql/tutorial/";
const N = "https://neon.com/postgresql/";
window.DB_PRIMERS = {
  "SQL 50 · Select": {
    text: "Filter rows with WHERE (AND / OR, IN, BETWEEN, LIKE). NULL needs IS NULL / IS NOT NULL: `col = NULL` is never true, so rows with NULL silently disappear. Select only the columns asked for, and use DISTINCT to drop duplicate rows.",
    links: [["SELECT", T + "select"], ["WHERE", T + "where"], ["SELECT DISTINCT", T + "select-distinct"]],
  },
  "SQL 50 · Basic Joins": {
    text: "INNER JOIN keeps only rows that match on both sides. LEFT JOIN keeps every left row and fills the right side with NULL, so `LEFT JOIN … WHERE right.id IS NULL` finds rows with no match. A self join joins a table to itself (employee → manager). CROSS JOIN produces every combination (students × subjects).",
    links: [["Joins overview", T + "joins"], ["LEFT JOIN", T + "left-join"], ["Self join", T + "self-join"], ["CROSS JOIN", T + "cross-join"]],
  },
  "SQL 50 · Basic Aggregate Functions": {
    text: "COUNT, SUM, AVG, MIN and MAX collapse many rows into one value. COUNT(*) counts rows, COUNT(col) skips NULLs. For ratios, multiply by 100.0 (not 100) to avoid integer division in PostgreSQL, and ROUND(x, 2) the result. Conditional counts: SUM(CASE WHEN … THEN 1 ELSE 0 END).",
    links: [["Aggregate functions", N + "aggregate-functions"], ["CASE", T + "case"], ["COALESCE", T + "coalesce"]],
  },
  "SQL 50 · Sorting and Grouping": {
    text: "GROUP BY returns one row per group, and every selected column must be grouped or aggregated. WHERE filters rows before grouping; HAVING filters groups after (HAVING COUNT(*) >= 5). ORDER BY … LIMIT n gives the top n.",
    links: [["GROUP BY", T + "group-by"], ["HAVING", T + "having"], ["ORDER BY", T + "order-by"], ["LIMIT", T + "limit"]],
  },
  "SQL 50 · Advanced Select and Joins": {
    text: "CASE WHEN builds labels and conditional logic. UNION stacks result sets and removes duplicates (UNION ALL keeps them). Window functions such as LAG / LEAD compare a row with its neighbours without collapsing rows, which is how you find consecutive values or 'price as of a date'.",
    links: [["CASE", T + "case"], ["UNION", T + "union"], ["Window functions", N + "window-function"]],
  },
  "SQL 50 · Subqueries": {
    text: "A subquery can return one value (compare with =), a list (IN, EXISTS) or a whole table (use it in FROM). A correlated subquery runs once per outer row. A CTE (WITH name AS (…)) names a subquery so long queries read top to bottom. Top-N per group: DENSE_RANK() OVER (PARTITION BY … ORDER BY …).",
    links: [["Subquery", T + "subquery"], ["Correlated subquery", T + "correlated-subquery"], ["CTE", T + "cte"], ["Window functions", N + "window-function"]],
  },
  "SQL 50 · Advanced String Functions / Regex / Clause": {
    text: "String functions: UPPER / LOWER, SUBSTRING, CONCAT or ||, LENGTH, STRING_AGG. LIKE uses % (any text) and _ (one character); regex handles patterns like valid emails (`~` in PostgreSQL, REGEXP in MySQL). DELETE with a self join removes duplicates. The Nth highest value: LIMIT 1 OFFSET n-1, or DENSE_RANK.",
    links: [["String functions", N + "string-functions"], ["LIKE", T + "like"], ["DELETE", T + "delete"]],
  },
  "Classic Database Problems": {
    text: "These combine everything so far: joins, GROUP BY / HAVING, subqueries and window functions. RANK leaves gaps after ties, DENSE_RANK doesn't. Consecutive rows → LAG / LEAD or a self join. Read each problem's expected output table carefully before writing SQL.",
    links: [["Window functions", N + "window-function"], ["Subquery", T + "subquery"], ["Self join", T + "self-join"]],
  },
  "PGExercises · Basic": {
    text: "PGExercises runs in your browser against a country-club database: members, facilities and bookings. Study the schema diagram on the Getting Started page first. This block drills SELECT, WHERE, CASE, dates, DISTINCT, UNION, ORDER BY and LIMIT.",
    links: [["PGExercises: Getting Started", "https://pgexercises.com/gettingstarted.html"], ["SELECT", T + "select"], ["WHERE", T + "where"]],
  },
  "PGExercises · Joins and Subqueries": {
    text: "Joins across all three tables (members → bookings → facilities), self joins for 'who recommended whom', and subqueries inside SELECT. Sketch which keys connect the tables before you write the query.",
    links: [["Joins overview", T + "joins"], ["Self join", T + "self-join"], ["Subquery", T + "subquery"]],
  },
  "PGExercises · Modifying Data": {
    text: "INSERT (one row, many rows, or from a SELECT), UPDATE (fixed or calculated values, from another row) and DELETE (with subqueries). Habit: run the WHERE clause as a SELECT first to see exactly which rows you'll change.",
    links: [["INSERT", T + "insert"], ["UPDATE", T + "update"], ["DELETE", T + "delete"]],
  },
  "PGExercises · Aggregation": {
    text: "The biggest block: GROUP BY on several columns, HAVING, and window functions: COUNT(*) OVER (), RANK() OVER (ORDER BY …), running totals with SUM() OVER (ORDER BY …) and rolling averages. If you're asked for 'the total next to each row', use a window function, not GROUP BY.",
    links: [["GROUP BY", T + "group-by"], ["HAVING", T + "having"], ["Window functions", N + "window-function"]],
  },
  "PGExercises · String Operations": {
    text: "Formatting and filtering text: concatenation, LIKE and regex matches, padding numbers with zeros, replacing characters, and grouping by the first letter of a name.",
    links: [["String functions", N + "string-functions"], ["LIKE", T + "like"]],
  },
  "PGExercises · Working with Timestamps": {
    text: "Timestamps and intervals: date_trunc('month', ts), EXTRACT(…), date arithmetic (end - start, now() + interval '1 day') and generate_series() to build a list of dates.",
    links: [["Date functions", N + "date-functions"]],
  },
  "PGExercises · Recursive Queries": {
    text: "WITH RECURSIVE has an anchor query plus a recursive part that joins back to the CTE itself. It's how you walk hierarchies such as recommendation chains or org charts, upwards or downwards.",
    links: [["Recursive query", T + "recursive-query"], ["CTE", T + "cte"]],
  },
};
})();
