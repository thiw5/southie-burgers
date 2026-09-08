-- Best Burger in Southie -- launch content
-- 8 fictional forum personas (not real people), one review each, plus cross-board comments.

INSERT INTO restaurants (slug, name, blurb, sort_order) VALUES
  ('lincoln', 'Lincoln', NULL, 1),
  ('moonshine-142', 'Moonshine 142', NULL, 2),
  ('mothers-east-tavern', 'Mothers East Tavern', NULL, 3),
  ('small-victories', 'Small Victories', NULL, 4),
  ('shannons-tavern', 'Shannon''s Tavern', NULL, 5),
  ('common-craft', 'Common Craft', NULL, 6),
  ('publico', 'Publico', NULL, 7),
  ('playwright', 'Playwright', NULL, 8),
  ('greys-hall', 'Gray''s Hall', NULL, 9);
-- NOTE: slug 'greys-hall' is intentionally reused here for the real Gray's Hall
-- (615 E Broadway) -- the original launch content under that slug was a mislabeled
-- placeholder and has been repurposed below as Shannon's Tavern.

INSERT INTO users (email, username, password_hash, password_salt, profile_pic_key, created_at) VALUES
  ('l.street.larry@example.com', 'l_street_larry', '197766487610f1398c6a18625a9347f87f4c9d9523acb13b0d7e202c40037312', '24edba8ece99eaeb492f6aa6cdaf2c22', NULL, strftime('%s','2026-08-10 09:00:00')),
  ('tripledeckahtom@example.com', 'tripledeckahtom', 'e838824b5db339bda7af7b1f6e45fc40b86616ba3ebfd2b021561c44d95b380e', '8f4a7d48156dc864bcf2a550960669da', NULL, strftime('%s','2026-08-10 09:05:00')),
  ('broadway.bridget@example.com', 'broadwaybridget', '9cce2dfe83f0e5d0180d26eb16b0c68893eba85eb5a0dec2b6ab7abcc5478b8a', '551a622b63cf8ea9d8df214938aa9fa1', NULL, strftime('%s','2026-08-10 09:10:00')),
  ('coffee.carnage@example.com', 'coffeeandcarnage', 'b26182f53440393eaa90ae144c0c069a25ed74bc07c3bb0ff6c09a7cebe501a1', '92c55024e4283d00edd0d9f48125dab9', NULL, strftime('%s','2026-08-10 09:15:00')),
  ('old.colony.owen@example.com', 'oldcolonyowen', '22decfa7a93e0e590baeb7adf6b74db2b827b54f64ebe59bdcb2eea75500d07f', '186295ca762fdf563d952f902930da08', NULL, strftime('%s','2026-08-10 09:20:00')),
  ('west.broadway.wes@example.com', 'westbroadwaywes', '106ab93ab49835a896283b4b457d841b75ade85a2533992955d135b474918cfb', 'ed87773ecddc2ccbc8abc1d532059530', NULL, strftime('%s','2026-08-10 09:25:00')),
  ('gate.of.heaven.gary@example.com', 'gateofheavengary', 'e0063ef70c7321110174cc97e9d620ee0e0729955aaaa62b3aba34ee72ab228d', '750e351f51808b7c0700b703197a8273', NULL, strftime('%s','2026-08-10 09:30:00')),
  ('eastie.exile@example.com', 'eastieexile', '1735b68281a953d3799d46c7d6e1df7a0a4acf34b87c8aabc5d8434a3acd3311', 'a1a7e1e3f66a35a388b2115b25c08146', NULL, strftime('%s','2026-08-10 09:35:00'));

-- Posts (one review per restaurant)

INSERT INTO posts (restaurant_id, user_id, title, body, photo_key, created_at) VALUES
(
  (SELECT id FROM restaurants WHERE slug = 'lincoln'),
  (SELECT id FROM users WHERE username = 'l_street_larry'),
  'lincoln burger is fine, the hype is the problem',
  'went in on a wednesday, no wait, sat at the bar. burger was cooked right, good char on it, brioche bun held up which is more than i can say for half the places on this list. the issue is everyone in this town acts like it invented the wheel. its a very good bar burger. its not a religious experience. fries were a little underseasoned but the bartender fixed me up when i asked.

7.5 out of 10, would go back, will not be arguing with anyone who says its the best in southie because thats a boring hill to die on.',
  NULL,
  strftime('%s','2026-08-15 19:20:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'moonshine-142'),
  (SELECT id FROM users WHERE username = 'tripledeckahtom'),
  'moonshine 142, worth the brunch line once',
  'my sister made us wait 40 min on a sunday for this. burger itself, solid. smash patty, good crust, cheese actually melted all the way instead of sitting there like a wet napkin. bacon jam on it was a little sweet for my taste but i get why people like it.

the wait is the real review here. if youre going at brunch time bring a friend and a book. dinner is a totally different experience, walked right in on a tuesday. get it at dinner, thank me later.',
  NULL,
  strftime('%s','2026-08-16 12:40:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'mothers-east-tavern'),
  (SELECT id FROM users WHERE username = 'broadwaybridget'),
  'mothers east tavern doesnt care about your instagram and thats why i love it',
  'no menu photos going viral here, no line, just a burger, a beer, and a bartender who remembers what you drink after the second visit. patty is thin, a little charred at the edges, comes with fries that are clearly just the frozen kind and i do not care one bit.

this isnt a top 3 burger. its a top 3 tuesday night when you dont want to think about anything. know what youre walking into and youll have a great time.',
  NULL,
  strftime('%s','2026-08-17 20:05:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'small-victories'),
  (SELECT id FROM users WHERE username = 'coffeeandcarnage'),
  'the coffee shop burger nobody asked for is somehow top 5',
  'i know, a coffee shop burger sounds like a bit. it is not a bit. they only run it thursday through saturday after 4 and you will be mad at yourself if you show up tuesday expecting it.

small patty, big flavor, some kind of aioli i didnt ask enough questions about. bun was toasted properly which sounds like a low bar until you remember half this list cant clear it. does not try to be a pub burger and doesnt need to be.

edit: someone asked in the comments, no they do not take reservations for the burger, just show up.',
  NULL,
  strftime('%s','2026-08-18 17:15:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'shannons-tavern'),
  (SELECT id FROM users WHERE username = 'oldcolonyowen'),
  'shannon''s tavern burger, and a word about southie writers while im here',
  'dark wood, old radiators, feels like it was here before the rest of the block. burger is a classic pub build, nothing fancy, cooked medium like i asked which is rarer than it should be around here. onion rings on the side, get those instead of fries, not close.

sitting at the bar with this thing i kept thinking about all souls, macdonald wrote about a southie that doesnt fully exist anymore but a place like this is about as close as it gets to that old neighborhood feeling. not saying the burger is literary. saying the room has more history than the menu does.',
  NULL,
  strftime('%s','2026-08-19 21:00:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'greys-hall'),
  (SELECT id FROM users WHERE username = 'broadwaybridget'),
  'gray''s hall burger is proof a wine bar can still make a real one',
  'quick correction before anything else: its gray''s hall, not greys, the sign out front on east broadway spells it right even if half this website apparently didnt. moving on.

this is the american provisions crew''s spot, so the wine list is the actual headline here, natural stuff by the glass, which had me assuming the food was an afterthought. it is not. gray's burger is chili ferment, american cheese, pickles, and it eats like somebody who cooks seasonal small plates all day still respects a straightforward burger when they build one. patty had a good char, cheese did its job, chili ferment adds a little tang and heat without turning it into a novelty.

space is cozy not fussy, chef gabe branch is clearly not just playing it safe with cheese boards. its been open a few years now off the new years eve opening but it still reads as the new kid next to places that have been slinging burgers here since before some of us could drive. get the hand cut fries on the side, dont skip them.

not dethroning anybody on this list. but it earned its own board instead of getting lumped into other spots, thats the whole point of this post.',
  NULL,
  strftime('%s','2026-08-29 19:30:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'common-craft'),
  (SELECT id FROM users WHERE username = 'westbroadwaywes'),
  'common craft, good taps, burger is the undercard not the main event',
  'lets be honest, people go to common craft for the beer list first and the food second. burger held its own though. good pretzel bun, patty was a little thinner than id want but the cheese pull made up for some of it.

sat on the deck upstairs in july and it felt like a scene out of one of those gritty boston crime novels, minus the crime, ill take marinicks version of southie in a book over living it, but ill take common craft over most of the other spots on the deck alone.',
  NULL,
  strftime('%s','2026-08-20 18:30:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'publico'),
  (SELECT id FROM users WHERE username = 'gateofheavengary'),
  'publico burger discourse, my final answer',
  'ok im putting this out there and i know the comments are going to be a mess. publico burger is the most consistent one in southie. every single time, same char, same melt, same perfectly fine amount of napkins needed. terrace yard means you wait, thats the toll for consistency.

people who say its overrated have usually gone once, on a saturday at 8pm, and let the wait ruin the meal before they even ate it. go on a monday. thank me later. not the flashiest burger in the neighborhood but its the one i trust the most.',
  NULL,
  strftime('%s','2026-08-21 19:45:00')
),
(
  (SELECT id FROM restaurants WHERE slug = 'playwright'),
  (SELECT id FROM users WHERE username = 'eastieexile'),
  'playwright is still the measuring stick and i will die on this',
  'ive had every burger on this list at this point, some multiple times because i have no self control. playwright is still the one everything else gets compared to in my head. thick patty, real cheddar not the plastic stuff, toasted bun that doesnt fall apart halfway through.

its not the trendiest pick, i get it, everyone wants to talk about the new spot. but ive never once left playwright disappointed and i cannot say that about half the places people are hyping up this year. do with that what you will.',
  NULL,
  strftime('%s','2026-08-22 20:15:00')
);

-- Comments, a mix of agreeable, defensive, and combative replies across boards

INSERT INTO comments (post_id, user_id, body, created_at) VALUES
(
  (SELECT id FROM posts WHERE title = 'lincoln burger is fine, the hype is the problem'),
  (SELECT id FROM users WHERE username = 'eastieexile'),
  '7.5 feels low honestly but i cant argue with the fries comment, theyve been inconsistent for me too. sometimes great sometimes like they forgot the salt exists.',
  strftime('%s','2026-08-15 21:10:00')
),
(
  (SELECT id FROM posts WHERE title = 'lincoln burger is fine, the hype is the problem'),
  (SELECT id FROM users WHERE username = 'gateofheavengary'),
  'disagree completely, lincoln is a 9 and its not close. youre underrating the bun to patty ratio which is the whole game.',
  strftime('%s','2026-08-16 08:05:00')
),
(
  (SELECT id FROM posts WHERE title = 'lincoln burger is fine, the hype is the problem'),
  (SELECT id FROM users WHERE username = 'l_street_larry'),
  'gary i respect the passion but "bun to patty ratio" is not a stat youre allowed to just invent. its a good burger. thats all im saying.',
  strftime('%s','2026-08-16 09:30:00')
),
(
  (SELECT id FROM posts WHERE title = 'moonshine 142, worth the brunch line once'),
  (SELECT id FROM users WHERE username = 'broadwaybridget'),
  'the bacon jam thing is what got me too, way too sweet for a burger imo, felt like dessert snuck onto my plate uninvited.',
  strftime('%s','2026-08-16 14:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'moonshine 142, worth the brunch line once'),
  (SELECT id FROM users WHERE username = 'coffeeandcarnage'),
  'dinner recommendation is underrated advice, ive only ever gone at night and never waited more than 10 min. brunch crowd can have it.',
  strftime('%s','2026-08-17 10:20:00')
),
(
  (SELECT id FROM posts WHERE title = 'mothers east tavern doesnt care about your instagram and thats why i love it'),
  (SELECT id FROM users WHERE username = 'tripledeckahtom'),
  'this is the most accurate description of that place ive ever read. frozen fries and i still go back monthly, make it make sense.',
  strftime('%s','2026-08-18 19:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'mothers east tavern doesnt care about your instagram and thats why i love it'),
  (SELECT id FROM users WHERE username = 'westbroadwaywes'),
  'gonna be the dissenting voice, i want a little more effort for the price. its fine but "fine" and "love" feel like two different reviews smashed together.',
  strftime('%s','2026-08-19 07:40:00')
),
(
  (SELECT id FROM posts WHERE title = 'the coffee shop burger nobody asked for is somehow top 5'),
  (SELECT id FROM users WHERE username = 'oldcolonyowen'),
  'walked by this place for two years assuming it was strictly a laptop and oat milk situation. this post is the only reason i tried the burger. no notes, genuinely surprised.',
  strftime('%s','2026-08-19 08:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'the coffee shop burger nobody asked for is somehow top 5'),
  (SELECT id FROM users WHERE username = 'eastieexile'),
  'top 5 is a stretch for me but i respect the specificity on the hours, thats genuinely useful info that saved me a wasted trip.',
  strftime('%s','2026-08-20 12:10:00')
),
(
  (SELECT id FROM posts WHERE title = 'shannon''s tavern burger, and a word about southie writers while im here'),
  (SELECT id FROM users WHERE username = 'westbroadwaywes'),
  'the all souls comparison is a little much for a burger review but i cant lie the room does have that feel to it. onion rings advice is correct though, always has been.',
  strftime('%s','2026-08-20 09:15:00')
),
(
  (SELECT id FROM posts WHERE title = 'shannon''s tavern burger, and a word about southie writers while im here'),
  (SELECT id FROM users WHERE username = 'broadwaybridget'),
  'no owen is right, some of these old bars carry more of the actual neighborhood in the walls than any new development ever will. also yes the onion rings, every time.',
  strftime('%s','2026-08-20 18:45:00')
),
(
  (SELECT id FROM posts WHERE title = 'common craft, good taps, burger is the undercard not the main event'),
  (SELECT id FROM users WHERE username = 'gateofheavengary'),
  'undercard is generous, i go for the taps and forget the kitchen exists most nights. no shade, just being honest about my own habits there.',
  strftime('%s','2026-08-21 08:30:00')
),
(
  (SELECT id FROM posts WHERE title = 'common craft, good taps, burger is the undercard not the main event'),
  (SELECT id FROM users WHERE username = 'l_street_larry'),
  'the deck in july is doing a lot of heavy lifting in this review and honestly, fair, ambiance counts for something.',
  strftime('%s','2026-08-22 20:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'publico burger discourse, my final answer'),
  (SELECT id FROM users WHERE username = 'oldcolonyowen'),
  'the monday advice is the real content here. saturday at 8 is a self inflicted wound, always has been, people just like complaining more than they like solving their own problem.',
  strftime('%s','2026-08-22 07:50:00')
),
(
  (SELECT id FROM posts WHERE title = 'publico burger discourse, my final answer'),
  (SELECT id FROM users WHERE username = 'coffeeandcarnage'),
  'gonna push back a little, "consistent" is doing some heavy lifting when i had a dry one back in june. still good, not flawless.',
  strftime('%s','2026-08-23 11:20:00')
),
(
  (SELECT id FROM posts WHERE title = 'publico burger discourse, my final answer'),
  (SELECT id FROM users WHERE username = 'gateofheavengary'),
  'one dry patty in a summer doesnt undo the track record but ill allow the point exists, kitchens have off nights.',
  strftime('%s','2026-08-23 13:05:00')
),
(
  (SELECT id FROM posts WHERE title = 'playwright is still the measuring stick and i will die on this'),
  (SELECT id FROM users WHERE username = 'tripledeckahtom'),
  'the measuring stick thing is true whether people admit it or not, its the burger everyone else in this thread is quietly comparing their picks to.',
  strftime('%s','2026-08-23 08:15:00')
),
(
  (SELECT id FROM posts WHERE title = 'playwright is still the measuring stick and i will die on this'),
  (SELECT id FROM users WHERE username = 'broadwaybridget'),
  'gonna be that person, i think playwright gets a pass because its been around forever, not because its actually the best one on this list anymore. still good though, not saying its bad.',
  strftime('%s','2026-08-24 15:40:00')
),
(
  (SELECT id FROM posts WHERE title = 'playwright is still the measuring stick and i will die on this'),
  (SELECT id FROM users WHERE username = 'eastieexile'),
  'bridget thats a bold take with no backup, name one burger on this list you think actually beats it and lets talk.',
  strftime('%s','2026-08-24 18:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'gray''s hall burger is proof a wine bar can still make a real one'),
  (SELECT id FROM users WHERE username = 'coffeeandcarnage'),
  'the chili ferment thing sounds like it could go wrong in about four different directions and somehow doesnt, ordered it twice now just to be sure. wine bar burgers are usually a garnish, this one isnt.',
  strftime('%s','2026-08-30 12:00:00')
),
(
  (SELECT id FROM posts WHERE title = 'gray''s hall burger is proof a wine bar can still make a real one'),
  (SELECT id FROM users WHERE username = 'eastieexile'),
  'gonna need convincing that a burger from the same menu as bananas foster creme brulee belongs in this conversation, but the fries recommendation checks out so ill allow the post.',
  strftime('%s','2026-08-31 09:15:00')
);

-- A handful of votes so scores arent all zero on launch
INSERT INTO votes (user_id, target_type, target_id, value) VALUES
((SELECT id FROM users WHERE username = 'eastieexile'), 'post', (SELECT id FROM posts WHERE title = 'publico burger discourse, my final answer'), 1),
((SELECT id FROM users WHERE username = 'oldcolonyowen'), 'post', (SELECT id FROM posts WHERE title = 'publico burger discourse, my final answer'), 1),
((SELECT id FROM users WHERE username = 'l_street_larry'), 'post', (SELECT id FROM posts WHERE title = 'playwright is still the measuring stick and i will die on this'), 1),
((SELECT id FROM users WHERE username = 'tripledeckahtom'), 'post', (SELECT id FROM posts WHERE title = 'playwright is still the measuring stick and i will die on this'), 1),
((SELECT id FROM users WHERE username = 'coffeeandcarnage'), 'post', (SELECT id FROM posts WHERE title = 'the coffee shop burger nobody asked for is somehow top 5'), 1),
((SELECT id FROM users WHERE username = 'broadwaybridget'), 'post', (SELECT id FROM posts WHERE title = 'mothers east tavern doesnt care about your instagram and thats why i love it'), 1),
((SELECT id FROM users WHERE username = 'westbroadwaywes'), 'post', (SELECT id FROM posts WHERE title = 'shannon''s tavern burger, and a word about southie writers while im here'), 1),
((SELECT id FROM users WHERE username = 'gateofheavengary'), 'post', (SELECT id FROM posts WHERE title = 'lincoln burger is fine, the hype is the problem'), -1);
