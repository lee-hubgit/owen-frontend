// ===== 配置：把下面替换成你的真实信息 =====
const CONFIG = {
  xianyuUrl:
    "https://www.goofish.com/personal?spm=a21ybx.im.nav.1.f7bd4f10LkCw38", // 你的闲鱼主页
};

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");

  // 年份
  document.getElementById("year").textContent = new Date().getFullYear();

  // 闲鱼链接
  const xianyuLink = document.getElementById("xianyuLink");
  if (xianyuLink) {
    xianyuLink.href = CONFIG.xianyuUrl;
    xianyuLink.target = "_blank";
    xianyuLink.rel = "noopener";
  }

  // 移动端菜单
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
    })
  );

  // 微信二维码弹窗
  const wechatCard = document.getElementById("wechatCard");
  const wechatModal = document.getElementById("wechatModal");
  const openModal = () => {
    wechatModal.classList.add("open");
    wechatModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    wechatModal.classList.remove("open");
    wechatModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  if (wechatCard) wechatCard.addEventListener("click", openModal);
  wechatModal
    .querySelectorAll("[data-close]")
    .forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // 滚动相关：导航背景、进度条、返回顶部
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // 滚动揭示动画
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // 技能进度条：进入视口时填充
  const bars = document.querySelectorAll(".bar i");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute("data-level") || 0;
          entry.target.style.setProperty("--w", level + "%");
          entry.target.classList.add("filled");
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => barObserver.observe(b));

  // 数字滚动动画
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.getAttribute("data-count");
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));
});
