import type { Problem } from "./types.js";

export const LANGUAGES = [
  { id: 50, name: "C", monaco: "c" },
  { id: 54, name: "C++", monaco: "cpp" },
  { id: 51, name: "C#", monaco: "csharp" },
  { id: 62, name: "Java", monaco: "java" },
  { id: 63, name: "JavaScript", monaco: "javascript" },
  { id: 74, name: "TypeScript", monaco: "typescript" },
  { id: 71, name: "Python 3", monaco: "python" },
  { id: 60, name: "Go", monaco: "go" },
  { id: 73, name: "Rust", monaco: "rust" },
  { id: 78, name: "Kotlin", monaco: "kotlin" },
  { id: 83, name: "Swift", monaco: "swift" },
  { id: 68, name: "PHP", monaco: "php" },
  { id: 72, name: "Ruby", monaco: "ruby" }
];

export const PROBLEMS: Problem[] = [
  {
    id: "two-sum", title: "Pair With Target", difficulty: "Easy", topics: ["Array", "Hash Map"],
    description: "Given an array of integers nums and an integer target, return the indices of two distinct elements whose values sum to target. Exactly one solution exists. Return the smaller index first.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 <= nums.length <= 100000", "-1000000000 <= nums[i], target <= 1000000000", "Exactly one valid answer exists."],
    starterCode: {
      "C++": "#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}",
      "TypeScript": "function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  return [];\n}",
      "Python 3": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    return []",
      "JavaScript": "function twoSum(nums, target) {\n  // Your code here\n  return [];\n}"
    },
    sampleInput: "4\n2 7 11 15\n9", sampleOutput: "0 1"
  },
  {
    id: "valid-palindrome", title: "Normalized Palindrome", difficulty: "Easy", topics: ["String", "Two Pointers"],
    description: "Given a string s, determine whether it is a palindrome after converting uppercase letters to lowercase and removing every character that is not a letter or digit. Return true or false.",
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: "true" },
      { input: '"race a car"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 200000", "s contains printable ASCII characters."],
    starterCode: { "TypeScript": "function isPalindrome(s: string): boolean {\n  // Your code here\n  return false;\n}", "Python 3": "def is_palindrome(s: str) -> bool:\n    # Your code here\n    return False" },
    sampleInput: "A man, a plan, a canal: Panama", sampleOutput: "true"
  },
  {
    id: "max-subarray", title: "Maximum Subarray Sum", difficulty: "Medium", topics: ["Array", "Dynamic Programming", "Kadane"],
    description: "Given a non-empty integer array, find the maximum sum of any contiguous, non-empty subarray.",
    examples: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has sum 6." },
      { input: "[1]", output: "1" }
    ],
    constraints: ["1 <= nums.length <= 200000", "-10000 <= nums[i] <= 10000"],
    starterCode: { "C++": "int maxSubArray(vector<int>& nums) {\n    // Your code here\n    return 0;\n}", "TypeScript": "function maxSubArray(nums: number[]): number {\n  // Your code here\n  return 0;\n}", "Python 3": "def max_sub_array(nums: list[int]) -> int:\n    # Your code here\n    return 0" },
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4", sampleOutput: "6"
  }
];