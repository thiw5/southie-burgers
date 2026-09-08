import { html, redirect, slugify } from "./utils.js";
import {
  hashPassword,
  verifyPassword,
  createSession,
  clearSessionCookie,
  getCurrentUser,
  destroySession,
} from "./auth.js";
import {
  layout,
  renderMainFeed,
  renderThreadList,
  renderPost,
  renderNewPostForm,
  renderNewBoardForm,
  renderAuthForm,
  renderProfile,
} from "./templates.js";

const DEFAULT_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" fill="#c9b98c"/>
<circle cx="32" cy="24" r="12" fill="#fffdf7"/>
<path d="M8 58c3-14 15-20 24-20s21 6 24 20" fill="#fffdf7"/>
</svg>`;

async function storePhoto(env, file) {
  if (!file || typeof file === "string" || !file.size) return null;
  const ext = (file.type && file.type.split("/")[1]) || "jpg";
  const key = `${crypto.randomUUID()}.${ext.replace(/[^a-z0-9]/gi, "")}`;
  await env.PHOTOS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return key;
}

async function getRestaurantBySlug(env, slug) {
  return env.DB.prepare("SELECT * FROM restaurants WHERE slug = ?").bind(slug).first();
}

async function attachVoteCounts(env, targetType, ids) {
  if (!ids.length) return {};
  const placeholders = ids.map(() => "?").join(",");
  const rows = await env.DB.prepare(
    `SELECT target_id,
            SUM(CASE WHEN value = 1 THEN 1 ELSE 0 END) as up,
            SUM(CASE WHEN value = -1 THEN 1 ELSE 0 END) as down
     FROM votes WHERE target_type = ? AND target_id IN (${placeholders})
     GROUP BY target_id`
  )
    .bind(targetType, ...ids)
    .all();
  const map = {};
  for (const r of rows.results) map[r.target_id] = { up: r.up, down: r.down };
  return map;
}

async function myVotes(env, user, targetType, ids) {
  if (!user || !ids.length) return {};
  const placeholders = ids.map(() => "?").join(",");
  const rows = await env.DB.prepare(
    `SELECT target_id, value FROM votes WHERE user_id = ? AND target_type = ? AND target_id IN (${placeholders})`
  )
    .bind(user.id, targetType, ...ids)
    .all();
  const map = {};
  for (const r of rows.results) map[r.target_id] = r.value;
  return map;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const siteName = env.SITE_NAME || "Best Burger in Southie";

    try {
      if (path === "/static/default-avatar.svg") {
        return new Response(DEFAULT_AVATAR_SVG, {
          headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
        });
      }

      if (path.startsWith("/media/") && method === "GET") {
        const key = decodeURIComponent(path.slice("/media/".length));
        const obj = await env.PHOTOS.get(key);
        if (!obj) return new Response("not found", { status: 404 });
        return new Response(obj.body, {
          headers: {
            "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      const user = await getCurrentUser(request, env);

      // ---- Home: full feed, all posts + comments inline ----
      if (path === "/" && method === "GET") {
        const { results: restaurants } = await env.DB.prepare(
          `SELECT * FROM restaurants ORDER BY sort_order ASC`
        ).all();

        const { results: posts } = await env.DB.prepare(
          `SELECT p.*, u.username, u.profile_pic_key, r.name as restaurant_name, r.slug as restaurant_slug
           FROM posts p
           JOIN users u ON u.id = p.user_id
           JOIN restaurants r ON r.id = p.restaurant_id
           ORDER BY p.created_at DESC`
        ).all();

        const postIds = posts.map((p) => p.id);
        let allComments = [];
        if (postIds.length) {
          const placeholders = postIds.map(() => "?").join(",");
          const { results } = await env.DB.prepare(
            `SELECT c.*, u.username, u.profile_pic_key
             FROM comments c JOIN users u ON u.id = c.user_id
             WHERE c.post_id IN (${placeholders})
             ORDER BY c.created_at ASC`
          )
            .bind(...postIds)
            .all();
          allComments = results;
        }
        const commentsByPost = {};
        for (const c of allComments) {
          (commentsByPost[c.post_id] = commentsByPost[c.post_id] || []).push(c);
        }
        const commentIds = allComments.map((c) => c.id);

        const postVotes = await attachVoteCounts(env, "post", postIds);
        const commentVotes = await attachVoteCounts(env, "comment", commentIds);
        const myPostVotes = await myVotes(env, user, "post", postIds);
        const myCommentVotes = await myVotes(env, user, "comment", commentIds);

        // main board is sorted by score (upvotes minus downvotes), ties broken by newest first
        const scoreOf = (p) => (postVotes[p.id]?.up || 0) - (postVotes[p.id]?.down || 0);
        posts.sort((a, b) => scoreOf(b) - scoreOf(a) || b.created_at - a.created_at);

        return html(
          layout({
            title: "main board",
            body: renderMainFeed(
              restaurants,
              posts,
              commentsByPost,
              user,
              postVotes,
              commentVotes,
              myPostVotes,
              myCommentVotes
            ),
            user,
            siteName,
          })
        );
      }

      // ---- Signup ----
      if (path === "/signup" && method === "GET") {
        return html(layout({ title: "sign up", body: renderAuthForm("signup"), user, siteName }));
      }
      if (path === "/signup" && method === "POST") {
        const form = await request.formData();
        const email = String(form.get("email") || "").trim().toLowerCase();
        const username = String(form.get("username") || "").trim();
        const password = String(form.get("password") || "");
        const picFile = form.get("profile_pic");

        if (!email || !username || !password || password.length < 8) {
          return html(
            layout({
              title: "sign up",
              body: renderAuthForm("signup", "fill out all fields, password needs 8+ characters"),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }
        if (!/^[a-zA-Z0-9_\-]{2,24}$/.test(username)) {
          return html(
            layout({
              title: "sign up",
              body: renderAuthForm("signup", "username can only use letters, numbers, - and _"),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }

        const existing = await env.DB.prepare(
          "SELECT id FROM users WHERE email = ? OR username = ?"
        )
          .bind(email, username)
          .first();
        if (existing) {
          return html(
            layout({
              title: "sign up",
              body: renderAuthForm("signup", "that email or username is already taken"),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }

        const { hash, salt } = await hashPassword(password);
        const profilePicKey = await storePhoto(env, picFile);
        const now = Math.floor(Date.now() / 1000);
        const inserted = await env.DB.prepare(
          `INSERT INTO users (email, username, password_hash, password_salt, profile_pic_key, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
          .bind(email, username, hash, salt, profilePicKey, now)
          .run();
        const userId = inserted.meta.last_row_id;
        const cookie = await createSession(env.DB, userId);
        return redirect("/", [cookie]);
      }

      // ---- Login ----
      if (path === "/login" && method === "GET") {
        return html(layout({ title: "log in", body: renderAuthForm("login"), user, siteName }));
      }
      if (path === "/login" && method === "POST") {
        const form = await request.formData();
        const email = String(form.get("email") || "").trim().toLowerCase();
        const password = String(form.get("password") || "");
        const row = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (!row || !(await verifyPassword(password, row.password_hash, row.password_salt))) {
          return html(
            layout({
              title: "log in",
              body: renderAuthForm("login", "email or password is wrong"),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }
        const cookie = await createSession(env.DB, row.id);
        return redirect("/", [cookie]);
      }

      if (path === "/logout") {
        await destroySession(request, env);
        return redirect("/", [clearSessionCookie()]);
      }

      // ---- Profile ----
      if (path.startsWith("/u/") && method === "GET") {
        const username = decodeURIComponent(path.slice("/u/".length));
        const profileUser = await env.DB.prepare("SELECT * FROM users WHERE username = ?")
          .bind(username)
          .first();
        if (!profileUser) return new Response("not found", { status: 404 });
        const { results: posts } = await env.DB.prepare(
          "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
        )
          .bind(profileUser.id)
          .all();
        return html(
          layout({ title: username, body: renderProfile(profileUser, posts), user, siteName })
        );
      }

      // ---- New board ----
      if (path === "/boards/new" && method === "GET") {
        if (!user) return redirect("/login");
        return html(layout({ title: "new board", body: renderNewBoardForm(), user, siteName }));
      }
      if (path === "/boards/new" && method === "POST") {
        if (!user) return redirect("/login");
        const form = await request.formData();
        const name = String(form.get("name") || "").trim();
        const blurb = String(form.get("blurb") || "").trim() || null;
        if (!name) {
          return html(
            layout({ title: "new board", body: renderNewBoardForm("give it a name"), user, siteName }),
            { status: 400 }
          );
        }
        const slug = slugify(name);
        if (!slug || slug === "other-spots") {
          return html(
            layout({ title: "new board", body: renderNewBoardForm("pick a different name"), user, siteName }),
            { status: 400 }
          );
        }
        const existing = await getRestaurantBySlug(env, slug);
        if (existing) {
          return html(
            layout({
              title: "new board",
              body: renderNewBoardForm(`a board for "${name}" already exists`),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }
        // keep "other spots" pinned to the bottom of the list
        const { sort_order: otherSpotsOrder } =
          (await env.DB.prepare("SELECT sort_order FROM restaurants WHERE slug = 'other-spots'").first()) || {};
        const newOrder = otherSpotsOrder ?? 999;
        if (otherSpotsOrder !== undefined && otherSpotsOrder !== null) {
          await env.DB.prepare("UPDATE restaurants SET sort_order = sort_order + 1 WHERE slug = 'other-spots'").run();
        }
        await env.DB.prepare(
          "INSERT INTO restaurants (slug, name, blurb, sort_order) VALUES (?, ?, ?, ?)"
        )
          .bind(slug, name, blurb, newOrder)
          .run();
        return redirect(`/r/${slug}`);
      }

      // ---- Restaurant board: thread list ----
      const boardMatch = path.match(/^\/r\/([a-z0-9\-]+)$/);
      if (boardMatch && method === "GET") {
        const restaurant = await getRestaurantBySlug(env, boardMatch[1]);
        if (!restaurant) return new Response("not found", { status: 404 });
        const { results: posts } = await env.DB.prepare(
          `SELECT p.*, u.username,
             (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
           FROM posts p JOIN users u ON u.id = p.user_id
           WHERE p.restaurant_id = ?
           ORDER BY p.created_at DESC`
        )
          .bind(restaurant.id)
          .all();
        const votes = await attachVoteCounts(
          env,
          "post",
          posts.map((p) => p.id)
        );
        const withVotes = posts.map((p) => ({ ...p, ...(votes[p.id] || { up: 0, down: 0 }) }));
        return html(
          layout({
            title: restaurant.name,
            body: renderThreadList(restaurant, withVotes),
            user,
            siteName,
          })
        );
      }

      // ---- New post form ----
      const newPostMatch = path.match(/^\/r\/([a-z0-9\-]+)\/new$/);
      if (newPostMatch && method === "GET") {
        const restaurant = await getRestaurantBySlug(env, newPostMatch[1]);
        if (!restaurant) return new Response("not found", { status: 404 });
        if (!user) return redirect("/login");
        return html(
          layout({
            title: `new thread in ${restaurant.name}`,
            body: renderNewPostForm(restaurant),
            user,
            siteName,
          })
        );
      }
      if (newPostMatch && method === "POST") {
        const restaurant = await getRestaurantBySlug(env, newPostMatch[1]);
        if (!restaurant) return new Response("not found", { status: 404 });
        if (!user) return redirect("/login");
        const form = await request.formData();
        const title = String(form.get("title") || "").trim();
        const body = String(form.get("body") || "").trim();
        const photoFile = form.get("photo");
        if (!title || !body) {
          return html(
            layout({
              title: "new thread",
              body: renderNewPostForm(restaurant, "title and body are both required"),
              user,
              siteName,
            }),
            { status: 400 }
          );
        }
        const photoKey = await storePhoto(env, photoFile);
        const now = Math.floor(Date.now() / 1000);
        const inserted = await env.DB.prepare(
          `INSERT INTO posts (restaurant_id, user_id, title, body, photo_key, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
          .bind(restaurant.id, user.id, title, body, photoKey, now)
          .run();
        return redirect(`/post/${inserted.meta.last_row_id}`);
      }

      // ---- Single post + comments ----
      const postMatch = path.match(/^\/post\/(\d+)$/);
      if (postMatch && method === "GET") {
        const postId = Number(postMatch[1]);
        const post = await env.DB.prepare(
          `SELECT p.*, u.username, u.profile_pic_key FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?`
        )
          .bind(postId)
          .first();
        if (!post) return new Response("not found", { status: 404 });
        const restaurant = await env.DB.prepare("SELECT * FROM restaurants WHERE id = ?")
          .bind(post.restaurant_id)
          .first();
        const { results: comments } = await env.DB.prepare(
          `SELECT c.*, u.username, u.profile_pic_key FROM comments c
           JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC`
        )
          .bind(postId)
          .all();

        const postVoteCounts = await attachVoteCounts(env, "post", [postId]);
        const commentVoteCounts = await attachVoteCounts(
          env,
          "comment",
          comments.map((c) => c.id)
        );
        const commentsWithVotes = comments.map((c) => ({
          ...c,
          ...(commentVoteCounts[c.id] || { up: 0, down: 0 }),
        }));
        const postWithVotes = { ...post, ...(postVoteCounts[postId] || { up: 0, down: 0 }) };

        const myPostVote = await myVotes(env, user, "post", [postId]);
        const myCommentVotes = await myVotes(
          env,
          user,
          "comment",
          comments.map((c) => c.id)
        );

        return html(
          layout({
            title: post.title,
            body: renderPost({
              restaurant,
              post: postWithVotes,
              comments: commentsWithVotes,
              user,
              votes: { post: myPostVote[postId], comments: myCommentVotes },
            }),
            user,
            siteName,
          })
        );
      }

      const commentMatch = path.match(/^\/post\/(\d+)\/comment$/);
      if (commentMatch && method === "POST") {
        if (!user) return redirect("/login");
        const postId = Number(commentMatch[1]);
        const form = await request.formData();
        const body = String(form.get("body") || "").trim();
        if (body) {
          const now = Math.floor(Date.now() / 1000);
          await env.DB.prepare(
            "INSERT INTO comments (post_id, user_id, body, created_at) VALUES (?, ?, ?, ?)"
          )
            .bind(postId, user.id, body, now)
            .run();
        }
        return redirect(`/post/${postId}`);
      }

      // ---- Voting ----
      if (path === "/vote" && method === "POST") {
        if (!user) return redirect("/login");
        const form = await request.formData();
        const targetType = String(form.get("target_type") || "");
        const targetId = Number(form.get("target_id"));
        const value = Number(form.get("value"));
        if (!["post", "comment"].includes(targetType) || ![1, -1].includes(value)) {
          return new Response("bad request", { status: 400 });
        }
        const existing = await env.DB.prepare(
          "SELECT * FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?"
        )
          .bind(user.id, targetType, targetId)
          .first();
        if (existing && existing.value === value) {
          await env.DB.prepare("DELETE FROM votes WHERE id = ?").bind(existing.id).run();
        } else if (existing) {
          await env.DB.prepare("UPDATE votes SET value = ? WHERE id = ?")
            .bind(value, existing.id)
            .run();
        } else {
          await env.DB.prepare(
            "INSERT INTO votes (user_id, target_type, target_id, value) VALUES (?, ?, ?, ?)"
          )
            .bind(user.id, targetType, targetId, value)
            .run();
        }
        let redirectTo = "/";
        if (targetType === "post") {
          redirectTo = `/post/${targetId}`;
        } else {
          const comment = await env.DB.prepare("SELECT post_id FROM comments WHERE id = ?")
            .bind(targetId)
            .first();
          if (comment) redirectTo = `/post/${comment.post_id}`;
        }
        const referer = request.headers.get("Referer");
        return redirect(referer || redirectTo);
      }

      return new Response("not found", { status: 404 });
    } catch (err) {
      return new Response(`server error: ${err.message}`, { status: 500 });
    }
  },
};

export { slugify };
