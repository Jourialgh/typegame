const SNIPPETS = [
  {
    id: 1,
    language: "javascript",
    difficulty: "easy",
    code: `function add(a, b) {
  return a + b;
}`,
  },
  {
    id: 2,
    language: "javascript",
    difficulty: "medium",
    code: `function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
  },
  {
    id: 3,
    language: "javascript",
    difficulty: "easy",
    code: `const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
console.log(doubled);`,
  },
  {
    id: 4,
    language: "python",
    difficulty: "easy",
    code: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
  },
  {
    id: 5,
    language: "python",
    difficulty: "medium",
    code: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
  },
  {
    id: 6,
    language: "python",
    difficulty: "easy",
    code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y`,
  },
  {
    id: 7,
    language: "css",
    difficulty: "easy",
    code: `.button {
  padding: 8px 16px;
  border-radius: 4px;
  background: #569cd6;
}`,
  },
  {
    id: 8,
    language: "css",
    difficulty: "medium",
    code: `.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}`,
  },
  {
    id: 9,
    language: "bash",
    difficulty: "easy",
    code: `for file in *.txt; do
  echo "Processing $file"
done`,
  },
  {
    id: 10,
    language: "javascript",
    difficulty: "medium",
    code: `async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}`,
  },
  {
    id: 11,
    language: "python",
    difficulty: "medium",
    code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True`,
  },
  {
    id: 12,
    language: "bash",
    difficulty: "medium",
    code: `if [ -z "$1" ]; then
  echo "Usage: $0 <name>"
  exit 1
fi`,
  },
];
