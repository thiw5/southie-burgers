import { escapeHtml, renderBody, timeAgo } from "./utils.js";

const CSS = `
:root {
  --diner-red: #c8102e;
  --diner-red-dark: #8f0c20;
  --cream: #f3e9d2;
  --checker: #1b1b1b;
  --chrome: #c9ced6;
  --text: #241a12;
  --link: #8f0c20;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--cream);
  color: var(--text);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 15px;
}
a { color: var(--link); }
.checker-strip {
  height: 10px;
  background-image: linear-gradient(45deg, var(--checker) 25%, transparent 25%),
    linear-gradient(-45deg, var(--checker) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--checker) 75%),
    linear-gradient(-45deg, transparent 75%, var(--checker) 75%);
  background-size: 20px 20px;
  background-color: #fff;
}
header.site {
  background: var(--diner-red);
  border-bottom: 4px solid var(--checker);
  padding: 18px 20px 12px;
}
header.site .wrap {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.brand {
  font-family: Impact, 'Arial Narrow', sans-serif;
  letter-spacing: 1px;
  color: #fff5da;
  text-shadow: 2px 2px 0 #6d0817, 0 0 12px rgba(255,180,60,0.55);
  font-size: 30px;
  text-decoration: none;
  line-height: 1;
}
.brand span { color: #ffd23f; }
nav.userbar { font-size: 13px; color: #fbe3c4; font-family: 'Courier New', monospace; }
nav.userbar a { color: #fff5da; text-decoration: none; margin-left: 10px; }
nav.userbar a:hover { text-decoration: underline; }
main { max-width: 980px; margin: 0 auto; padding: 18px 20px 60px; }
.board-list { border: 1px solid #d8c6a0; background: #fffdf7; }
.board-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #e7dcc0;
  gap: 12px;
}
.board-row:last-child { border-bottom: none; }
.board-row:nth-child(even) { background: #f8f1de; }
.board-row a.rname { font-family: Impact, 'Arial Narrow', sans-serif; font-size: 20px; color: var(--diner-red-dark); text-decoration: none; letter-spacing: .5px; }
.board-row .blurb { font-size: 13px; color: #5a4a36; font-family: 'Courier New', monospace; }
.board-row .meta { font-size: 12px; color: #7a6a52; white-space: nowrap; font-family: 'Courier New', monospace; }
.thread-row { display: flex; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #e7dcc0; align-items: flex-start; }
.thread-row:nth-child(even) { background: #f8f1de; }
.vote-col { display: flex; flex-direction: column; align-items: center; width: 46px; font-family: 'Courier New', monospace; }
.vote-col form { margin: 0; }
.vote-btn { background: none; border: none; cursor: pointer; font-size: 15px; line-height: 1; padding: 2px 4px; color: #7a6a52; }
.vote-btn:hover { color: var(--diner-red); }
.vote-score { font-weight: bold; font-size: 14px; margin: 2px 0; }
.thread-title { font-size: 17px; font-weight: bold; text-decoration: none; color: #241a12; }
.thread-meta { font-size: 12px; color: #7a6a52; font-family: 'Courier New', monospace; margin-top: 3px; }
.post-body { line-height: 1.55; }
.post-body p { margin: 0 0 10px; }
.avatar { width: 32px; height: 32px; border-radius: 3px; object-fit: cover; border: 1px solid #c9b98c; vertical-align: middle; }
.avatar-lg { width: 64px; height: 64px; border-radius: 4px; object-fit: cover; border: 2px solid #c9b98c; }
.card { border: 1px solid #d8c6a0; background: #fffdf7; padding: 18px; margin-bottom: 16px; }
.comment { border-left: 3px solid var(--chrome); padding: 10px 0 10px 14px; margin-top: 12px; }
.comment .who { font-family: 'Courier New', monospace; font-size: 12px; color: #5a4a36; margin-bottom: 4px; }
.comment .who b { color: var(--diner-red-dark); }
label { display: block; margin: 10px 0 4px; font-weight: bold; font-size: 13px; }
input[type=text], input[type=email], input[type=password], textarea, select {
  width: 100%; padding: 8px; border: 1px solid #b8a878; background: #fffef9; font-family: inherit; font-size: 14px;
}
textarea { min-height: 120px; resize: vertical; }
.btn {
  display: inline-block; background: var(--diner-red); color: #fff5da; border: none;
  padding: 9px 18px; font-family: Impact, 'Arial Narrow', sans-serif; letter-spacing: .5px;
  font-size: 15px; cursor: pointer; text-decoration: none; margin-top: 10px;
}
.btn:hover { background: var(--diner-red-dark); }
.btn.secondary { background: #6b6458; }
.error-box { background: #fbe0e0; border: 1px solid var(--diner-red); color: #7a1010; padding: 10px 14px; margin-bottom: 14px; font-size: 14px; }
.crumbs { font-size: 12px; font-family: 'Courier New', monospace; color: #7a6a52; margin-bottom: 12px; }
.crumbs a { color: #7a6a52; }
footer.site { text-align: center; padding: 20px; font-size: 12px; color: #7a6a52; font-family: 'Courier New', monospace; }
img.post-photo { max-width: 100%; border: 1px solid #d8c6a0; margin: 10px 0; }
.jukebox-note { font-size: 11px; color: #a5967a; font-family: 'Courier New', monospace; text-align: right; margin-top: -6px; }
.stats-bar {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  font-family: 'Courier New', monospace; font-size: 12px; color: #7a6a52;
  padding: 8px 2px 12px; border-bottom: 2px dashed #c9b98c; margin-bottom: 14px;
}
.quickjump { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.quickjump a {
  display: inline-block; background: #fffdf7; border: 1px solid #c9b98c; color: var(--diner-red-dark);
  font-family: Impact, 'Arial Narrow', sans-serif; letter-spacing: .5px; font-size: 13px;
  padding: 5px 10px; text-decoration: none; border-radius: 2px;
}
.quickjump a:hover { background: var(--diner-red); color: #fff5da; border-color: var(--diner-red); }
.quickjump a.other { background: var(--diner-red); color: #fff5da; border-color: var(--diner-red-dark); }
.rtag {
  display: inline-block; background: var(--diner-red-dark); color: #fff5da;
  font-family: Impact, 'Arial Narrow', sans-serif; letter-spacing: .5px; font-size: 12px;
  padding: 2px 8px; border-radius: 2px; text-decoration: none; margin-bottom: 6px;
}
.rtag:hover { background: var(--diner-red); }
.feed-post { border: 1px solid #d8c6a0; background: #fffdf7; padding: 18px; margin-bottom: 22px; box-shadow: 3px 3px 0 #e7dcc0; }
.feed-post .comments-block { margin-top: 16px; border-top: 2px dashed #c9b98c; padding-top: 12px; }
.feed-post .comments-heading { font-family: 'Courier New', monospace; font-size: 12px; color: #7a6a52; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
.section-divider { border: none; border-top: 2px dashed #c9b98c; margin: 26px 0; }
`;

export function layout({ title, body, user, siteName }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} :: ${escapeHtml(siteName)}</title>
<style>${CSS}</style>
</head>
<body>
<div class="checker-strip"></div>
<header class="site">
  <div class="wrap">
    <a class="brand" href="/">BEST BURGER <span>IN SOUTHIE</span></a>
    <nav class="userbar">
      ${
        user
          ? `logged in as <a href="/u/${encodeURIComponent(user.username)}"><b>${escapeHtml(
              user.username
            )}</b></a><a href="/logout">log out</a>`
          : `<a href="/login">log in</a><a href="/signup">sign up</a>`
      }
    </nav>
  </div>
</header>
<div class="checker-strip"></div>
<main>
${body}
</main>
<footer class="site">bestburgerinsouthie.com | est. digital 2026</footer>
</body>
</html>`;
}

function restaurantTag(restaurant) {
  return `<a class="rtag" href="/r/${escapeHtml(restaurant.slug)}">${escapeHtml(
    restaurant.name
  ).toUpperCase()}</a>`;
}

export function renderMainFeed(restaurants, posts, commentsByPost, user, postVotes, commentVotes, myPostVotes, myCommentVotes) {
  const totalComments = Object.values(commentsByPost).reduce((n, c) => n + c.length, 0);

  const quickjump = restaurants
    .map((r) =>
      r.slug === "other-spots"
        ? `<a class="other" href="/r/${escapeHtml(r.slug)}/new">+ talk about another spot</a>`
        : `<a href="/r/${escapeHtml(r.slug)}">${escapeHtml(r.name)}</a>`
    )
    .join("\n") + `\n<a class="other" href="/boards/new" style="background:#6b6458;border-color:#6b6458;">+ start a new board</a>`;

  const feed = posts
    .map((p) => {
      const restaurant = { slug: p.restaurant_slug, name: p.restaurant_name };
      const score = (postVotes[p.id]?.up || 0) - (postVotes[p.id]?.down || 0);
      const comments = commentsByPost[p.id] || [];
      const commentsHtml = comments
        .map((c) => {
          const cScore = (commentVotes[c.id]?.up || 0) - (commentVotes[c.id]?.down || 0);
          return `<div class="comment">
            <div class="who"><img class="avatar" style="width:20px;height:20px;" src="${avatarSrc(
              c.profile_pic_key
            )}"> <b>${escapeHtml(c.username)}</b> &middot; ${timeAgo(c.created_at)}</div>
            <div style="display:flex; gap:10px;">
              ${voteWidget(user, "comment", c.id, cScore, myCommentVotes[c.id])}
              <div class="post-body">${renderBody(c.body)}</div>
            </div>
          </div>`;
        })
        .join("\n");
      const commentForm = user
        ? `<form method="post" action="/post/${p.id}/comment" style="margin-top:12px;">
            <textarea name="body" required placeholder="reply about ${escapeHtml(p.restaurant_name)}..."></textarea>
            <button class="btn" type="submit">post comment</button>
          </form>`
        : `<p style="font-size:13px; margin-top:12px;"><a href="/login">log in</a> or <a href="/signup">sign up</a> to comment.</p>`;

      return `<div class="feed-post">
        <div style="display:flex; gap:14px;">
          ${voteWidget(user, "post", p.id, score, myPostVotes[p.id])}
          <div style="flex:1;">
            ${restaurantTag(restaurant)}
            <div><a class="thread-title" href="/post/${p.id}">${escapeHtml(p.title)}</a></div>
            <div class="thread-meta" style="margin-bottom:8px;">
              <img class="avatar" style="width:18px;height:18px;" src="${avatarSrc(
                p.profile_pic_key
              )}"> posted by <b>${escapeHtml(p.username)}</b> ${timeAgo(p.created_at)}
            </div>
            <div class="post-body">${renderBody(p.body)}</div>
            ${p.photo_key ? `<img class="post-photo" src="/media/${encodeURIComponent(p.photo_key)}">` : ""}
          </div>
        </div>
        <div class="comments-block">
          <div class="comments-heading">${comments.length} comment${comments.length === 1 ? "" : "s"}</div>
          ${commentsHtml}
          ${commentForm}
        </div>
      </div>`;
    })
    .join("\n");

  return `<div class="quickjump">${quickjump}</div>
  <div class="stats-bar">
    <span>${restaurants.length} boards &middot; ${posts.length} threads &middot; ${totalComments} comments</span>
  </div>
  ${feed}`;
}

export function renderThreadList(restaurant, posts) {
  const rows = posts
    .map((p) => {
      const score = (p.up || 0) - (p.down || 0);
      return `<div class="thread-row">
        <div class="vote-col">
          <span class="vote-score">${score}</span>
        </div>
        <div>
          <a class="thread-title" href="/post/${p.id}">${escapeHtml(p.title)}</a>
          <div class="thread-meta">posted by <b>${escapeHtml(p.username)}</b> ${timeAgo(
        p.created_at
      )} &middot; ${p.comment_count || 0} comments</div>
        </div>
      </div>`;
    })
    .join("\n");
  return `<div class="crumbs"><a href="/">main board</a> &raquo; ${escapeHtml(restaurant.name)}</div>
  <div class="card">
    <h2 style="margin-top:0; font-family: Impact, 'Arial Narrow', sans-serif; color: var(--diner-red-dark);">${escapeHtml(
      restaurant.name
    )}</h2>
    <a class="btn" href="/r/${escapeHtml(restaurant.slug)}/new">start a thread</a>
  </div>
  <div class="board-list">${rows || '<div class="board-row">no posts yet. be the first.</div>'}</div>`;
}

function voteWidget(user, targetType, targetId, score, myVote) {
  if (!user) {
    return `<div class="vote-col"><span class="vote-score">${score}</span></div>`;
  }
  return `<div class="vote-col">
    <form method="post" action="/vote">
      <input type="hidden" name="target_type" value="${targetType}">
      <input type="hidden" name="target_id" value="${targetId}">
      <input type="hidden" name="value" value="1">
      <button class="vote-btn" type="submit" title="upvote" style="${
        myVote === 1 ? "color:var(--diner-red);" : ""
      }">&#9650;</button>
    </form>
    <span class="vote-score">${score}</span>
    <form method="post" action="/vote">
      <input type="hidden" name="target_type" value="${targetType}">
      <input type="hidden" name="target_id" value="${targetId}">
      <input type="hidden" name="value" value="-1">
      <button class="vote-btn" type="submit" title="downvote" style="${
        myVote === -1 ? "color:var(--diner-red);" : ""
      }">&#9660;</button>
    </form>
  </div>`;
}

export function renderPost({ restaurant, post, comments, user, votes }) {
  const postScore = (post.up || 0) - (post.down || 0);
  const commentsHtml = comments
    .map((c) => {
      const cScore = (c.up || 0) - (c.down || 0);
      return `<div class="comment">
        <div class="who"><img class="avatar" style="width:20px;height:20px;" src="${avatarSrc(
          c.profile_pic_key
        )}"> <b>${escapeHtml(c.username)}</b> &middot; ${timeAgo(c.created_at)}</div>
        <div style="display:flex; gap:10px;">
          ${voteWidget(user, "comment", c.id, cScore, votes.comments[c.id])}
          <div class="post-body">${renderBody(c.body)}</div>
        </div>
      </div>`;
    })
    .join("\n");

  const commentForm = user
    ? `<form method="post" action="/post/${post.id}/comment" class="card" style="margin-top:16px;">
        <label for="body">add a comment</label>
        <textarea name="body" id="body" required></textarea>
        <button class="btn" type="submit">post comment</button>
      </form>`
    : `<div class="card" style="margin-top:16px;"><a href="/login">log in</a> or <a href="/signup">sign up</a> to comment.</div>`;

  return `<div class="crumbs"><a href="/">main board</a> &raquo; <a href="/r/${escapeHtml(
    restaurant.slug
  )}">${escapeHtml(restaurant.name)}</a></div>
  <div class="card">
    <div style="display:flex; gap:14px;">
      ${voteWidget(user, "post", post.id, postScore, votes.post)}
      <div style="flex:1;">
        ${restaurantTag(restaurant)}
        <h1 style="margin:0 0 4px; font-size:22px;">${escapeHtml(post.title)}</h1>
        <div class="thread-meta" style="margin-bottom:10px;">
          <img class="avatar" style="width:20px;height:20px;" src="${avatarSrc(
            post.profile_pic_key
          )}"> posted by <b>${escapeHtml(post.username)}</b> ${timeAgo(post.created_at)}
        </div>
        <div class="post-body">${renderBody(post.body)}</div>
        ${post.photo_key ? `<img class="post-photo" src="/media/${encodeURIComponent(post.photo_key)}">` : ""}
      </div>
    </div>
  </div>
  <h3 style="font-family: Impact, 'Arial Narrow', sans-serif; color: var(--diner-red-dark); margin-bottom:6px;">${comments.length} comments</h3>
  ${commentsHtml}
  ${commentForm}`;
}

export function renderNewPostForm(restaurant, error) {
  return `<div class="crumbs"><a href="/">boards</a> &raquo; <a href="/r/${escapeHtml(
    restaurant.slug
  )}">${escapeHtml(restaurant.name)}</a> &raquo; new thread</div>
  <div class="card">
    <h2 style="margin-top:0;">start a thread in ${escapeHtml(restaurant.name)}</h2>
    ${error ? `<div class="error-box">${escapeHtml(error)}</div>` : ""}
    <form method="post" action="/r/${escapeHtml(restaurant.slug)}/new" enctype="multipart/form-data">
      <label for="title">title</label>
      <input type="text" name="title" id="title" required maxlength="140">
      <label for="body">your take</label>
      <textarea name="body" id="body" required></textarea>
      <label for="photo">photo (optional)</label>
      <input type="file" name="photo" id="photo" accept="image/*">
      <button class="btn" type="submit">post it</button>
    </form>
  </div>`;
}

export function renderNewBoardForm(error) {
  return `<div class="crumbs"><a href="/">boards</a> &raquo; new board</div>
  <div class="card">
    <h2 style="margin-top:0;">start a new board</h2>
    <p style="font-size:13px; color:#5a4a36;">for a southie spot that doesnt have its own board yet. this creates a real board with its own url, not just a thread under "other spots".</p>
    ${error ? `<div class="error-box">${escapeHtml(error)}</div>` : ""}
    <form method="post" action="/boards/new">
      <label for="name">restaurant / bar name</label>
      <input type="text" name="name" id="name" required maxlength="80">
      <label for="blurb">short blurb (optional)</label>
      <input type="text" name="blurb" id="blurb" maxlength="140">
      <button class="btn" type="submit">create board</button>
    </form>
  </div>`;
}

export function renderAuthForm(kind, error) {
  const isSignup = kind === "signup";
  return `<div class="card" style="max-width:420px; margin:0 auto;">
    <h2 style="margin-top:0;">${isSignup ? "create an account" : "log in"}</h2>
    ${error ? `<div class="error-box">${escapeHtml(error)}</div>` : ""}
    <form method="post" action="/${kind}" enctype="multipart/form-data">
      ${
        isSignup
          ? `<label for="username">username (public)</label>
             <input type="text" name="username" id="username" required maxlength="24">`
          : ""
      }
      <label for="email">email</label>
      <input type="email" name="email" id="email" required>
      <label for="password">password</label>
      <input type="password" name="password" id="password" required minlength="8">
      ${
        isSignup
          ? `<label for="profile_pic">profile picture (public, optional)</label>
             <input type="file" name="profile_pic" id="profile_pic" accept="image/*">`
          : ""
      }
      <button class="btn" type="submit">${isSignup ? "sign up" : "log in"}</button>
    </form>
    <p style="font-size:12px; margin-top:14px;">
      ${
        isSignup
          ? `already have an account? <a href="/login">log in</a>`
          : `need an account? <a href="/signup">sign up</a>`
      }
    </p>
  </div>`;
}

export function renderProfile(profileUser, posts) {
  const rows = posts
    .map(
      (p) =>
        `<div class="board-row"><a class="rname" style="font-size:15px;" href="/post/${p.id}">${escapeHtml(
          p.title
        )}</a><div class="meta">${timeAgo(p.created_at)}</div></div>`
    )
    .join("\n");
  return `<div class="card" style="display:flex; gap:16px; align-items:center;">
    <img class="avatar-lg" src="${avatarSrc(profileUser.profile_pic_key)}">
    <div>
      <h2 style="margin:0;">${escapeHtml(profileUser.username)}</h2>
      <div class="thread-meta">member since ${timeAgo(profileUser.created_at)}</div>
    </div>
  </div>
  <h3 style="font-family: Impact, 'Arial Narrow', sans-serif; color: var(--diner-red-dark);">threads started</h3>
  <div class="board-list">${rows || '<div class="board-row">nothing posted yet.</div>'}</div>`;
}

export function avatarSrc(key) {
  return key ? `/media/${encodeURIComponent(key)}` : "/static/default-avatar.svg";
}
