/* =========================================================
   炎冬岁叙 · REPO
   Interaction / rendering / snowfall
   ========================================================= */

(function () {
  "use strict";

  var data = window.REPO_DATA || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };
  var $$ = function (selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  };

  /* -------------------------------------------------------
     Small helpers
     ------------------------------------------------------- */
  function createIcon(id, className) {
    return (
      '<svg class="icon ' + (className || "") + '" aria-hidden="true">' +
      '<use href="#' + id + '"></use>' +
      "</svg>"
    );
  }

  function showToast(title, text, type) {
    var toast = $("#toast");
    var toastTitle = $("#toast-title");
    var toastText = $("#toast-text");
    var toastIcon = $("#toast-icon");
    if (!toast) return;

    clearTimeout(showToast.timer);
    toast.classList.remove("is-leaving");
    toast.classList.toggle("toast--error", type === "error");
    toastTitle.textContent = title;
    toastText.textContent = text;
    toastIcon.innerHTML = createIcon(type === "error" ? "i-close" : "i-check");
    toast.hidden = false;

    showToast.timer = window.setTimeout(function () {
      hideToast();
    }, 7600);
  }

  function hideToast() {
    var toast = $("#toast");
    if (!toast || toast.hidden) return;
    toast.classList.add("is-leaving");
    window.setTimeout(function () {
      toast.hidden = true;
      toast.classList.remove("is-leaving");
    }, 360);
  }

  /* -------------------------------------------------------
     Render gallery
     ------------------------------------------------------- */
  function renderGallery() {
    var gallery = $("#gallery");
    if (!gallery || !Array.isArray(data.gallery)) return;

    var fragment = document.createDocumentFragment();

    data.gallery.forEach(function (item, index) {
      var figure = document.createElement("figure");
      figure.className = "gallery__item";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "gallery__button";
      button.setAttribute("data-lightbox-index", String(index));
      button.setAttribute("aria-label", "查看《" + item.title + "》大图");

      button.innerHTML =
        '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy" decoding="async">' +
        '<span class="gallery__shade"></span>' +
        '<span class="gallery__tag">示例素材</span>' +
        '<span class="gallery__index">' + item.tag + "</span>" +
        '<span class="gallery__text">' +
          "<strong>" + item.title + "</strong>" +
          "<small>" + item.caption + "</small>" +
        "</span>" +
        '<span class="gallery__arrow">' + createIcon("i-arrow") + "</span>";

      figure.appendChild(button);
      fragment.appendChild(figure);
    });

    gallery.innerHTML = "";
    gallery.appendChild(fragment);
  }

  /* -------------------------------------------------------
     Lightbox
     ------------------------------------------------------- */
  function setupLightbox() {
    var dialog = $("#lightbox");
    var lightboxImage = $("#lightbox-image");
    var title = $("#lightbox-title");
    var tag = $("#lightbox-tag");
    var desc = $("#lightbox-desc");
    var closeButton = $("#lightbox-close");
    var gallery = $("#gallery");
    if (!dialog || !gallery) return;

    gallery.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-lightbox-index]");
      if (!trigger) return;

      var index = Number(trigger.getAttribute("data-lightbox-index"));
      var item = data.gallery && data.gallery[index];
      if (!item) return;

      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      title.textContent = item.title;
      tag.textContent = item.tag;
      desc.textContent = item.description || item.caption;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        dialog.close();
      });
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", function () {
      lightboxImage.src = "";
    });
  }

  /* -------------------------------------------------------
     Render downloadable files
     ------------------------------------------------------- */
  function renderFiles() {
    var list = $("#file-list");
    if (!list || !Array.isArray(data.files)) return;

    var fragment = document.createDocumentFragment();

    data.files.forEach(function (file) {
      var link = document.createElement("a");
      link.className = "file-card";
      link.href = encodeURI(file.path);
      link.setAttribute("download", file.name);
      link.setAttribute("aria-label", "下载 " + file.name + "，" + file.size);

      link.innerHTML =
        '<span class="file-card__icon">' + createIcon("i-file") + "</span>" +
        '<span class="file-card__body">' +
          '<span class="file-card__name">' + file.name + "</span>" +
          '<span class="file-card__meta"><em>' + file.type + "</em><span>" + file.size + "</span><span>·</span><span>" + file.meta + "</span></span>" +
        "</span>" +
        '<span class="file-card__download">' + createIcon("i-download") + "</span>";

      fragment.appendChild(link);
    });

    list.innerHTML = "";
    list.appendChild(fragment);
  }

  /* -------------------------------------------------------
     Render excerpt + expand / collapse
     ------------------------------------------------------- */
  function renderExcerpt() {
    var excerpt = $("#excerpt");
    var toggle = $("#excerpt-toggle");
    if (!excerpt || !data.excerpt) return;

    var paragraphs = data.excerpt.paragraphs || [];
    excerpt.innerHTML = paragraphs.map(function (paragraph) {
      return "<p>" + paragraph + "</p>";
    }).join("");

    // Only collapse when there is enough text to make the control useful.
    if (paragraphs.length > 3) {
      excerpt.classList.add("is-collapsed");
    } else if (toggle) {
      toggle.hidden = true;
    }

    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      excerpt.classList.toggle("is-collapsed", expanded);
      toggle.querySelector("span").textContent = expanded ? "继续展卷" : "收起试阅";
    });
  }

  /* -------------------------------------------------------
     Freetalk: avatar + author ID + note
     ------------------------------------------------------- */
  function renderFreetalk() {
    var grid = $("#talk-grid");
    var talk = data.freetalk || {};
    var authors = talk.authors;
    if (!grid || !Array.isArray(authors) || !authors.length) return;

    var intro = $("#freetalk-intro");
    if (intro && talk.intro) intro.textContent = talk.intro;

    var fragment = document.createDocumentFragment();

    authors.forEach(function (author, index) {
      var card = document.createElement("article");
      card.className = "talk-card" + (author.featured ? " talk-card--featured" : "");
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--reveal-delay", Math.min(index, 4) * 70 + "ms");

      var head = document.createElement("header");
      head.className = "talk-card__head";

      var avatarWrap = document.createElement("span");
      avatarWrap.className = "talk-card__avatar-wrap";

      var initial = document.createElement("span");
      initial.className = "talk-card__initial";
      initial.setAttribute("aria-hidden", "true");
      initial.textContent = (author.name || "?").charAt(0);

      var avatar = document.createElement("img");
      avatar.className = "talk-card__avatar";
      avatar.src = author.avatar || "";
      avatar.alt = author.avatarAlt || (author.name + " 的头像");
      avatar.width = 84;
      avatar.height = 84;
      avatar.loading = "lazy";
      avatar.decoding = "async";
      avatar.addEventListener("error", function () {
        avatarWrap.classList.add("is-fallback");
      });

      avatarWrap.appendChild(initial);
      avatarWrap.appendChild(avatar);

      var idBox = document.createElement("div");
      idBox.className = "talk-card__id";

      var name = document.createElement("h3");
      name.className = "talk-card__name";
      name.appendChild(document.createTextNode((author.name || "无名") + " "));

      if (author.handle) {
        var handle = document.createElement("span");
        handle.className = "talk-card__handle";
        handle.textContent = author.handle;
        name.appendChild(handle);
      }

      var role = document.createElement("p");
      role.className = "talk-card__role";
      role.textContent = author.role || "";

      idBox.appendChild(name);
      idBox.appendChild(role);
      head.appendChild(avatarWrap);
      head.appendChild(idBox);

      var text = document.createElement("p");
      text.className = "talk-card__text";
      text.textContent = author.text || "";

      var foot = document.createElement("footer");
      foot.className = "talk-card__foot";

      var meta = document.createElement("span");
      meta.textContent = author.meta || "";

      var mark = document.createElement("span");
      mark.className = "talk-card__mark";
      mark.innerHTML = createIcon("i-snow");

      foot.appendChild(meta);
      foot.appendChild(mark);

      card.appendChild(head);
      card.appendChild(text);
      card.appendChild(foot);
      fragment.appendChild(card);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  /* -------------------------------------------------------
     Message wall: storage + rendering
     ------------------------------------------------------- */
  var wallState = {
    userNotes: [],
    storageOK: true
  };

  function wallConfig() {
    return data.wall || {};
  }

  function wallNoteColors() {
    var config = wallConfig();
    return Array.isArray(config.colors) && config.colors.length
      ? config.colors
      : [
        { id: "snow", label: "雪白" },
        { id: "ice", label: "霜蓝" },
        { id: "sky", label: "浅天蓝" }
      ];
  }

  function normalizeWallColor(value) {
    var colors = wallNoteColors();
    for (var i = 0; i < colors.length; i += 1) {
      if (colors[i].id === value) return value;
    }
    return colors[0].id;
  }

  function readWallNotes() {
    var config = wallConfig();
    if (!config.storageKey) return [];
    try {
      var raw = window.localStorage.getItem(config.storageKey);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (note) {
        return note && typeof note.text === "string" && note.text.trim() &&
          typeof note.createdAt === "number";
      }).map(function (note) {
        var maxLength = config.maxLength || 120;
        return {
          id: String(note.id || "note-" + note.createdAt),
          reader: String(note.reader || config.anonymousName || "匿名的旅人").slice(0, 20),
          text: String(note.text).slice(0, maxLength),
          color: normalizeWallColor(note.color),
          rotate: typeof note.rotate === "number" ? Math.max(-3, Math.min(3, note.rotate)) : 0,
          createdAt: note.createdAt
        };
      }).slice(0, config.maxNotes || 120);
    } catch (error) {
      wallState.storageOK = false;
      return [];
    }
  }

  function writeWallNotes(notes) {
    var config = wallConfig();
    if (!config.storageKey) return false;
    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(notes));
      wallState.storageOK = true;
      return true;
    } catch (error) {
      wallState.storageOK = false;
      return false;
    }
  }

  function formatWallTime(note) {
    if (note.time) return note.time;
    if (!note.createdAt) return "";
    var date = new Date(note.createdAt);
    var now = new Date();
    var sameDay = date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    if (sameDay) return "今天 " + hours + ":" + minutes;
    return (date.getMonth() + 1) + " 月 " + date.getDate() + " 日";
  }

  function buildWallNote(note, index, isUser) {
    var article = document.createElement("article");
    article.className = "note note--" + normalizeWallColor(note.color);
    var rotate = typeof note.rotate === "number" ? note.rotate : ((index % 5) - 2) * 1.1;
    article.style.setProperty("--rot", rotate.toFixed(1) + "deg");
    article.setAttribute("data-note-id", note.id);

    var fastener = document.createElement("span");
    fastener.className = index % 2 === 1 ? "note__pin" : "note__tape";
    fastener.setAttribute("aria-hidden", "true");
    article.appendChild(fastener);

    var text = document.createElement("p");
    text.className = "note__text";
    text.textContent = note.text;
    article.appendChild(text);

    var meta = document.createElement("footer");
    meta.className = "note__meta";

    var reader = document.createElement("span");
    reader.className = "note__reader";
    reader.textContent = note.reader || wallConfig().anonymousName || "匿名的旅人";

    var time = document.createElement("time");
    time.className = "note__time";
    if (isUser && note.createdAt) {
      time.setAttribute("datetime", new Date(note.createdAt).toISOString());
    }
    time.textContent = formatWallTime(note);

    meta.appendChild(reader);
    meta.appendChild(time);
    article.appendChild(meta);
    return article;
  }

  function buildAddNoteTile() {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "note-add";
    button.setAttribute("data-wall-open", "");

    var icon = document.createElement("span");
    icon.className = "note-add__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "+";

    var title = document.createElement("strong");
    title.textContent = "我也要留言";

    var hint = document.createElement("small");
    hint.textContent = "留一张空白的便利贴给你";

    button.appendChild(icon);
    button.appendChild(title);
    button.appendChild(hint);
    button.addEventListener("click", openComposer);
    return button;
  }

  function renderWall(options) {
    var container = $("#wall-notes");
    if (!container) return;

    var config = wallConfig();
    var seed = Array.isArray(config.seed) ? config.seed : [];
    var fragment = document.createDocumentFragment();

    wallState.userNotes.forEach(function (note, index) {
      fragment.appendChild(buildWallNote(note, index, true));
    });

    seed.forEach(function (note, index) {
      fragment.appendChild(buildWallNote(note, index + wallState.userNotes.length, false));
    });

    fragment.appendChild(buildAddNoteTile());
    container.innerHTML = "";
    container.appendChild(fragment);

    var count = $("#wall-count");
    if (count) count.textContent = String(seed.length + wallState.userNotes.length);

    if (options && options.highlightId) {
      highlightWallNote(options.highlightId, options.animateCount);
    }
  }

  function highlightWallNote(id, animateCount) {
    var container = $("#wall-notes");
    if (!container) return;

    var target = null;
    $$(".note", container).forEach(function (note) {
      if (note.getAttribute("data-note-id") === id) target = note;
    });
    if (!target) return;

    target.classList.add("is-new");
    window.setTimeout(function () {
      target.classList.remove("is-new");
    }, 950);

    var count = $("#wall-count");
    if (animateCount && count) {
      count.classList.remove("is-bump");
      void count.offsetWidth;
      count.classList.add("is-bump");
    }

    window.setTimeout(function () {
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "center"
      });
    }, 80);
  }

  function readStoredName() {
    try {
      return window.localStorage.getItem("yandong-wall-name-v1") || "";
    } catch (error) {
      return "";
    }
  }

  function storeWallName(name) {
    try {
      if (name) window.localStorage.setItem("yandong-wall-name-v1", name);
    } catch (error) {
      /* 本地存储不可用时忽略 */
    }
  }

  function openComposer() {
    var dialog = $("#composer");
    if (!dialog) return;

    var status = $("#composer-status");
    if (status) {
      status.hidden = true;
      status.textContent = "";
    }

    var nameInput = $("#composer-name");
    if (nameInput && !nameInput.value) nameInput.value = readStoredName();

    document.body.classList.add("modal-open");

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    window.setTimeout(function () {
      var textarea = $("#composer-text");
      if (textarea) textarea.focus();
    }, 60);
  }

  function closeComposer() {
    var dialog = $("#composer");
    document.body.classList.remove("modal-open");
    if (!dialog) return;

    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function setupWallComposer() {
    var dialog = $("#composer");
    var form = $("#composer-form");
    var textarea = $("#composer-text");
    var nameInput = $("#composer-name");
    var counter = $("#composer-count");
    var status = $("#composer-status");
    var closeButton = $("#composer-close");
    var cancelButton = $("#composer-cancel");
    if (!dialog || !form) return;

    var config = wallConfig();
    var maxLength = config.maxLength || 120;

    var updateCount = function () {
      if (counter && textarea) counter.textContent = String(textarea.value.length);
    };

    if (textarea) {
      textarea.addEventListener("input", updateCount);
      updateCount();
    }

    if (closeButton) closeButton.addEventListener("click", closeComposer);
    if (cancelButton) cancelButton.addEventListener("click", closeComposer);

    dialog.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeComposer();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!textarea) return;

      var text = textarea.value.trim();
      if (!text) {
        if (status) {
          status.textContent = "先写一句话，再把它贴上去吧。";
          status.hidden = false;
        }
        textarea.focus();
        return;
      }

      if (text.length > maxLength) text = text.slice(0, maxLength);

      var reader = (nameInput && nameInput.value.trim()) || config.anonymousName || "匿名的旅人";
      reader = reader.replace(/\s+/g, " ").slice(0, 20);

      var colorInput = form.querySelector('input[name="color"]:checked');
      var note = {
        id: "note-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        reader: reader,
        text: text,
        color: normalizeWallColor(colorInput ? colorInput.value : "snow"),
        rotate: Math.round((Math.random() * 5.6 - 2.8) * 10) / 10,
        createdAt: Date.now()
      };

      wallState.userNotes.unshift(note);
      wallState.userNotes = wallState.userNotes.slice(0, config.maxNotes || 120);
      var saved = writeWallNotes(wallState.userNotes);

      if (nameInput && nameInput.value.trim()) {
        storeWallName(reader);
      }

      renderWall({ highlightId: note.id, animateCount: true });

      if (status) status.hidden = true;
      textarea.value = "";
      updateCount();
      closeComposer();

      if (saved) {
        showToast("留言已上墙", "谢谢你留下的话。它就贴在这面墙上，下次来还在。");
      } else {
        showToast("留言已上墙", "浏览器没有允许本地保存，刷新后这条留言会消失。", "error");
      }
    });
  }

  function setupWall() {
    wallState.userNotes = readWallNotes();
    renderWall();

    var openButton = $("#wall-open");
    if (openButton) openButton.addEventListener("click", openComposer);

    setupWallComposer();

    window.addEventListener("storage", function (event) {
      if (event.key !== wallConfig().storageKey) return;
      wallState.userNotes = readWallNotes();
      renderWall();
    });
  }

  /* -------------------------------------------------------
     Navigation + header state
     ------------------------------------------------------- */
  function setupNavigation() {
    var header = $("#site-header");
    var nav = $("#site-nav");
    var toggle = $("#nav-toggle");

    function closeNav() {
      if (!nav || !toggle) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "打开导航");
      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        if (open) {
          closeNav();
          return;
        }
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "关闭导航");
        header.classList.add("is-open");
        document.body.classList.add("nav-open");
      });

      $$("a", nav).forEach(function (link) {
        link.addEventListener("click", closeNav);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNav();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 820) closeNav();
      });
    }

    var ticking = false;
    function updateHeader() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }, { passive: true });

    updateHeader();
  }

  /* -------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------- */
  function setupReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px"
    });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* -------------------------------------------------------
     PostMail form
     ------------------------------------------------------- */
  function returnUrl(parameter, hash) {
    var url = new URL(window.location.href);
    url.search = "?" + parameter;
    url.hash = hash;
    return url.href;
  }

  function setupForm() {
    var form = $("#postmail-form");
    var message = $("#message");
    var mailText = $("#mail-text");
    var counter = $("#char-count");
    var status = $("#form-status");
    var sendButton = $("#send-button");
    var successInput = $("#success-url");
    var errorInput = $("#error-url");
    if (!form) return;

    if (successInput) successInput.value = returnUrl("sent=1", "archive");
    if (errorInput) errorInput.value = returnUrl("err=1", "letter");

    function setStatus(text) {
      if (!status) return;
      status.textContent = text || "";
      status.hidden = !text;
    }

    if (window.location.protocol === "file:") {
      setStatus("当前是本地文件模式。请先双击 start-server.bat，通过本地服务器打开页面，寄信后才能自动返回。");
      if (status) status.classList.add("form-status--info");
    }

    if (message && counter) {
      var updateCounter = function () {
        counter.textContent = String(message.value.length);
      };
      message.addEventListener("input", updateCounter);
      updateCounter();
    }

    form.addEventListener("submit", function (event) {
      var trap = form.elements.namedItem("website");
      if (trap && trap.value) {
        event.preventDefault();
        setStatus("留言未能寄出，请稍后重试。");
        return;
      }

      if (message && !message.value.trim()) {
        event.preventDefault();
        setStatus("请先写下一点什么，再把信寄出去。");
        message.focus();
        return;
      }

      if (window.location.protocol === "file:") {
        event.preventDefault();
        setStatus("请先运行 start-server.bat，通过本地服务器打开页面后再寄信。");
        if (status) status.classList.add("form-status--info");
        return;
      }

      setStatus("");
      if (sendButton) {
        sendButton.setAttribute("aria-disabled", "true");
        var label = $(".button--send__label", sendButton);
        if (label) label.textContent = "正在寄出…";
      }

      // PostMail reads the "text" field as the mail body. Compose it so the
      // sender name and optional reply address survive the trip even if the
      // service ignores extra form fields.
      if (mailText && message) {
        var nameField = form.elements.namedItem("name");
        var emailField = form.elements.namedItem("email");
        var senderName = nameField && nameField.value.trim() ? nameField.value.trim() : "一位路过的旅人";
        var replyEmail = emailField && emailField.value.trim() ? emailField.value.trim() : "未填写";
        mailText.value = "称呼：" + senderName + "\n回信邮箱：" + replyEmail + "\n\n" + message.value.trim();
      }
    });
  }

  /* -------------------------------------------------------
     Sent / error states
     ------------------------------------------------------- */
  function setupReturnState() {
    var params = new URLSearchParams(window.location.search);
    var sent = params.get("sent") === "1";
    var error = params.get("err") === "1";
    var note = $("#delivery-note");

    if (sent) {
      if (note) note.hidden = false;
      showToast("信已寄出", "谢谢你的回声。已为你翻到展品那一页。");
      window.setTimeout(function () {
        var archive = $("#archive");
        if (!archive) return;
        archive.scrollIntoView({
          behavior: reduceMotion.matches ? "auto" : "smooth",
          block: "start"
        });
      }, 520);
    }

    if (error) {
      showToast("信没有寄出去", "可能是网络或服务暂时不可用。请稍后再试，或直接邮件联系站长。", "error");
      window.setTimeout(function () {
        var letter = $("#letter");
        if (letter) {
          letter.scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            block: "start"
          });
        }
      }, 520);
    }
  }

  function setupToastClose() {
    var close = $("#toast-close");
    if (close) close.addEventListener("click", hideToast);
  }

  /* -------------------------------------------------------
     Snowfall canvas
     ------------------------------------------------------- */
  function setupSnowfall() {
    var canvas = $("#snowfall");
    if (!canvas || reduceMotion.matches) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var flakes = [];
    var rafId = null;
    var lastTime = 0;
    var isRunning = !document.hidden;

    function makeFlake(initial) {
      var radius = Math.random() * 2.15 + 0.65;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -10 - Math.random() * 40,
        r: radius,
        speed: 9 + Math.random() * 25 + radius * 2,
        drift: 4 + Math.random() * 13,
        sway: 0.35 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.24 + Math.random() * 0.56,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.7
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.round(Math.min(150, Math.max(46, width / 12)));
      flakes = new Array(count);
      for (var i = 0; i < count; i += 1) {
        flakes[i] = makeFlake(true);
      }
    }

    function drawFlake(flake) {
      ctx.save();
      ctx.translate(flake.x, flake.y);

      if (flake.r > 1.65) {
        ctx.rotate(flake.spin);
        ctx.strokeStyle = "rgba(255, 255, 255, " + (flake.alpha * 0.72) + ")";
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        for (var arm = 0; arm < 3; arm += 1) {
          var angle = (Math.PI / 3) * arm;
          var length = flake.r * 2.35;
          ctx.moveTo(-Math.cos(angle) * length, -Math.sin(angle) * length);
          ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(0, 0, flake.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, " + flake.alpha + ")";
      ctx.shadowColor = "rgba(48, 111, 145, " + (flake.alpha * 0.5) + ")";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }

    function loop(time) {
      if (!isRunning) {
        rafId = null;
        return;
      }

      var delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < flakes.length; i += 1) {
        var flake = flakes[i];
        flake.spin += flake.spinSpeed * delta;
        flake.y += flake.speed * delta;
        flake.x += Math.sin(time * 0.00055 * flake.sway + flake.phase) * flake.drift * delta;
        flake.x += 2.6 * delta;

        if (flake.y > height + 12) {
          flakes[i] = makeFlake(false);
          continue;
        }
        if (flake.x > width + 12) flake.x = -12;
        if (flake.x < -12) flake.x = width + 12;

        drawFlake(flake);
      }

      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (rafId !== null) return;
      isRunning = true;
      lastTime = 0;
      rafId = window.requestAnimationFrame(loop);
    }

    function stop() {
      isRunning = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
      }, 180);
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", function (event) {
        if (event.matches) {
          stop();
          canvas.style.display = "none";
        } else {
          canvas.style.display = "";
          resize();
          start();
        }
      });
    }

    resize();
    start();
  }

  /* -------------------------------------------------------
     Boot
     ------------------------------------------------------- */
  function boot() {
    renderGallery();
    renderFiles();
    renderExcerpt();
    renderFreetalk();
    setupWall();
    setupLightbox();
    setupNavigation();
    setupReveal();
    setupForm();
    setupReturnState();
    setupToastClose();
    setupSnowfall();

    // Image fade-in for a quieter first paint.
    $$(".gallery__button img").forEach(function (image) {
      if (image.complete) {
        image.classList.add("is-loaded");
      } else {
        image.addEventListener("load", function () {
          image.classList.add("is-loaded");
        }, { once: true });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
