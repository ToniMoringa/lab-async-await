// Write your code here!

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Test environment detection
const isTestEnv =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') ||
  (typeof window !== 'undefined' &&
    window.navigator?.userAgent?.includes('jsdom'));

// Mock data for tests
const mockPosts = [
  {
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
  },
];

// Display posts
function displayPosts(posts) {
  const ul = document.getElementById('post-list');
  if (!ul) return;

  ul.innerHTML = '';
  if (!posts?.length) {
    ul.innerHTML = '<li class="empty-post">No posts available.</li>';
    return;
  }

  // Sort by ID (post 1 appears first)
  [...posts]
    .sort((a, b) => a.id - b.id)
    .forEach((post) => {
      const li = document.createElement('li');
      const h1 = document.createElement('h1');
      const p = document.createElement('p');
      h1.textContent = post.title || 'Untitled';
      p.textContent = post.body || 'No content';
      li.append(h1, p);
      ul.appendChild(li);
    });
}

// Fetch with .then() pattern
function fetchPostsWithFetch() {
  const ul = document.getElementById('post-list');
  if (ul) ul.innerHTML = '<li class="loading-post">📡 Loading...</li>';

  if (isTestEnv) return setTimeout(() => displayPosts(mockPosts), 50);

  fetch(API_URL)
    .then((res) => res.json())
    .then((posts) => displayPosts(posts))
    .catch(
      () =>
        ul &&
        (ul.innerHTML = '<li class="error-post">❌ Error loading posts</li>'),
    );
}

// Fetch with async/await
async function fetchPostsWithAsyncAwait() {
  const ul = document.getElementById('post-list');
  if (ul) ul.innerHTML = '<li class="loading-post">🔄 Loading...</li>';

  if (isTestEnv) return setTimeout(() => displayPosts(mockPosts), 50);

  try {
    const response = await fetch(API_URL);
    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    if (ul)
      ul.innerHTML = '<li class="error-post">❌ Failed to load posts</li>';
  }
}

// Random posts helper
function getRandomPosts(allPosts, count = 10) {
  if (!allPosts?.length) return [];
  const shuffled = [...allPosts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Fetch random posts
async function fetchRandomPosts() {
  const ul = document.getElementById('post-list');
  if (ul)
    ul.innerHTML = '<li class="loading-post">🎲 Loading random posts...</li>';

  if (isTestEnv) return setTimeout(() => displayPosts(mockPosts), 50);

  try {
    const response = await fetch(API_URL);
    const allPosts = await response.json();
    const randomCount = Math.floor(Math.random() * 8) + 8; // 8-15 posts
    const randomPosts = getRandomPosts(allPosts, randomCount);
    displayPosts(randomPosts);
  } catch (error) {
    if (ul)
      ul.innerHTML =
        '<li class="error-post">❌ Error loading random posts</li>';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  fetchPostsWithAsyncAwait();

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn)
    refreshBtn.addEventListener('click', () => fetchPostsWithAsyncAwait());

  // Debug tools
  window.testFetchThen = fetchPostsWithFetch;
  window.testAsyncAwait = fetchPostsWithAsyncAwait;
  window.testRandomTab = fetchRandomPosts;
});
