// Main JavaScript for Parampara

document.addEventListener("DOMContentLoaded", async () => {
  await loadVillagePosts();
  initNavbar();
  initBackToTop();
});

async function loadVillagePosts() {
  const postsGrid = document.getElementById("village-posts");
  if (!postsGrid) return;

  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("API failed");

    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.warn("API unavailable, using mock data");
    renderPosts(getMockPosts());
  }
}

function getMockPosts() {
  return [
    {
      title: "Holi Celebration in Vrindavan",
      village: "Vrindavan",
      timestamp: new Date().toISOString(),
      content:
        "Villages came alive with colors as locals celebrated Holi with traditional songs and dance.",
      type: "Festival",
    },
    {
      title: "Madhubani Art Workshop",
      village: "Madhubani",
      timestamp: new Date().toISOString(),
      content:
        "Local artists shared ancient painting techniques passed down through generations.",
      type: "Craft",
    },
    {
      title: "Harvest Season Begins",
      village: "Pushkar",
      timestamp: new Date().toISOString(),
      content:
        "Farmers perform traditional rituals to bless the new harvest season.",
      type: "Tradition",
    },
    {
      title: "Warli Painting Revival",
      village: "Dahanu",
      timestamp: new Date().toISOString(),
      content:
        "Youth joining elders to learn Warli tribal art and keep the tradition alive.",
      type: "Art",
    },
    {
      title: "Folk Music Evening",
      village: "Jaisalmer",
      timestamp: new Date().toISOString(),
      content:
        "Desert folk musicians performed Rajasthani ballads under the open sky.",
      type: "Music",
    },
    {
      title: "Pottery Making Demo",
      village: "Khurja",
      timestamp: new Date().toISOString(),
      content:
        "Master potters demonstrated traditional wheel-throwing techniques to visitors.",
      type: "Craft",
    },
  ];
}

function renderPosts(posts) {
  const postsGrid = document.getElementById("village-posts");
  if (!postsGrid) return;

  if (!posts || posts.length === 0) {
    postsGrid.innerHTML =
      '<p style="text-align: center; color: var(--text-muted);">No posts yet. Check back soon for updates from villages!</p>';
    return;
  }

  postsGrid.innerHTML = posts
    .slice(0, 6)
    .map(
      (post) => `
        <div class="post-card">
          <h4>${escapeHtml(post.title)}</h4>
          <p class="post-meta">${escapeHtml(post.village)} • ${formatDate(
            post.timestamp
          )}</p>
          <p>${escapeHtml(post.content)}</p>
          <span style="display: inline-block; padding: 0.25rem 0.75rem; background: var(--primary-color); border-radius: 20px; font-size: 0.85rem; margin-top: 1rem; color: white;">
            ${escapeHtml(post.type)}
          </span>
        </div>
      `
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initNavbar() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerBtn.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");

  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}