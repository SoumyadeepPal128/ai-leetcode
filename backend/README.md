# AI LeetCode - Backend Scaffold (v1: generate -> code -> verdict loop)

## What's here

```
src/
  index.js              Express app entry point
  routes/
    generate.js          POST /api/generate - prompt in, validated problem out
    execute.js            POST /api/execute  - user code in, verdict out
  services/
    llm.js                Calls Claude API to generate a problem (the "AI" part)
    piston.js              Runs code safely via the Piston execution API
  data/
    sampleProblem.js       Hardcoded problem for testing without an API key
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

You do NOT need to fill in ANTHROPIC_API_KEY yet for step 1 below - the
sample problem lets you test execution first.

## Step 1: Test the execution/verdict loop (no API key needed)

This proves the "hard infra" part works before touching AI at all.

```bash
npm run dev
```

In another terminal:

```bash
# seed the hardcoded sample problem into memory
curl -X POST http://localhost:4000/api/dev/seed-sample

# submit a CORRECT solution -> should return allPassed: true
curl -X POST http://localhost:4000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "sample-1",
    "language": "python",
    "code": "a, b = map(int, input().split())\nprint(a + b)"
  }'

# submit a WRONG solution -> should return allPassed: false with the failing case
curl -X POST http://localhost:4000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "sample-1",
    "language": "python",
    "code": "a, b = map(int, input().split())\nprint(a - b)"
  }'
```

If both of those behave as expected, your execution + judging pipeline is solid.

## Step 2: Get an Anthropic API key

1. Go to https://console.anthropic.com/ and sign up / log in.
2. Go to "API Keys" and create a new key.
3. Paste it into `.env` as `ANTHROPIC_API_KEY=sk-ant-...`.
4. Note: API usage is billed by usage (tokens in/out), separate from any
   Claude.ai subscription you might have. Check current pricing at
   https://www.anthropic.com/pricing before generating a lot of problems.

## Step 3: Test real generation end to end

```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "the classic two sum problem: given an array and a target, find two numbers that add up to it"}'
```

This will:
1. Call Claude to generate a problem statement + reference solution + sample inputs
2. Actually RUN the reference solution on each sample input via Piston
3. Store the input -> real output pairs as the test cases
4. Return the problem, with a real `id` you can now POST to `/api/execute`

Then submit your own solution against that generated problem's `id`,
same as Step 1.

## Notes / known simplifications (intentional, for v1)

- Problems are stored in memory (`Map`), so they reset when the server
  restarts. Swap for Postgres/SQLite once the loop feels solid.
- Only Python is wired into problem generation (the reference solution is
  always Python). JavaScript submissions can still be judged via
  `/api/execute` if you write the test cases by hand, but the LLM prompt
  above only generates Python reference solutions for now.
- No auth, no sharing yet - on purpose. Get this loop rock solid first.
- The public Piston instance (`emkc.org`) is rate-limited and meant for
  light use. Fine for development; self-host Piston with Docker before
  showing this to more than a couple people at once.
