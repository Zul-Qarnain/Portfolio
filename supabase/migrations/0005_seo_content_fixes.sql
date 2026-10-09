-- 0005_seo_content_fixes.sql
--
-- Two indexing barriers found by the audit are content problems, not technical
-- ones, so they have to be fixed in the data:
--
--   1. The "test" post was published with the literal description "hello".
--      It sat in the XML sitemap as an indexable thin page.
--   2. The one real article stored an <h1> inside its body (so the rendered page
--      had two h1s), used "• text<br>" runs instead of real lists, numbered
--      items twice inside <ol>, and carried images with no dimensions or alt text.
--
-- Drafting instead of deleting keeps the row recoverable:
--   update public.blog_posts set status = 'published' where slug = 'test';
-- The article body rewrite is reproduced verbatim below, and in
-- supabase/backup/blog_posts.json before this migration was written.

-- ---------------------------------------------------------------------------
-- 1. Withdraw the placeholder post from the public surface.
-- ---------------------------------------------------------------------------
update public.blog_posts
   set status = 'draft'
 where slug = 'test'
   and status = 'published';

-- ---------------------------------------------------------------------------
-- 2. Rewrite the article body with valid, accessible, crawlable structure.
--    Facts and ordering are unchanged from the original; only the markup,
--    wording and image attributes differ.
-- ---------------------------------------------------------------------------
update public.blog_posts
   set content = $html$<p><em>Will AI take over jobs, or just change how we work?</em> That is the question most students and professionals are asking right now, and the honest answer is closer to the second one than the first.</p>
<p>Automation has historically removed tasks rather than whole occupations. What is different about this wave is that it reaches cognitive work: writing, analysis, and pattern recognition. That changes who is exposed, but it also changes what is in demand.</p>
<h2>Jobs AI Is Creating</h2>
<p>Demand has appeared for roles that did not exist a decade ago:</p>
<ul><li>AI engineers and machine learning developers</li><li>Data scientists and analysts</li><li>Prompt and context engineering</li><li>AI model trainers and evaluators</li><li>AI ethics, safety and governance specialists</li></ul>
<img class="blog-image-center" src="https://images.stockcake.com/public/e/6/2/e621ff3a-1ec7-4136-b92b-af210665779c_large/futuristic-ai-interface-stockcake.jpg" alt="A person working at a screen with an artificial intelligence interface" width="728" height="408">
<h2>Jobs Most Exposed to Automation</h2>
<p>The work most at risk shares a common trait: it follows a predictable, repeatable rule set.</p>
<ol><li>Manufacturing and assembly</li><li>Basic, script-driven customer support</li><li>Manual data entry</li><li>Retail checkout</li><li>Driving and delivery, as self-driving matures</li></ol>
<img class="blog-image-center" src="https://techwireasia.com/wp-content/uploads/2022/12/shutterstock_1389754598-scaled.jpg" alt="Robotic arms operating on an automated warehouse assembly line" width="2560" height="1354">
<h2>How the Workforce Is Adapting</h2>
<p>Workers who stay relevant are not competing with models; they are working alongside them:</p>
<ul><li>Reskilling through online courses in AI, data and software</li><li>Hybrid roles that pair domain knowledge with tooling</li><li>Deliberately building human-first skills such as leadership, negotiation and empathy</li></ul>
<img class="blog-image-center" src="https://cdn.prod.website-files.com/63ea859d3ade034a987e65c8/67c7bc548b5d874cef8fba4c_envato-labs-image-edit_%2851%29.webp" alt="A team collaborating around a laptop while reviewing AI-generated output" width="2048" height="1537">
<h2>What AI Cannot Replace (Yet)</h2>
<p>Current systems still fall short where work is genuinely social or genuinely novel:</p>
<ul><li>Emotional intelligence and care</li><li>Original creative direction, as opposed to remixing existing output</li><li>Moral judgement and accountability for decisions</li><li>Complex, high-stakes communication</li></ul>
<img class="blog-image-center" src="https://as2.ftcdn.net/jpg/04/65/45/43/1000_F_465454322_dEcqCdfD0xMaP2FLwZVYpGrrzMKIzibT.jpg" alt="Two people in conversation, illustrating human communication" width="1000" height="563">
<h2>So Should We Be Worried?</h2>
<p>Worry is a reasonable response to change, but it is not a strategy. The practical version of "adapt" is small and repeatable:</p>
<ol><li>Keep learning, in the specific area you already work in.</li><li>Use AI tools on real tasks, so you know their limits as well as their strengths.</li><li>Back that up with support for sensible AI policy, because governance is not optional at this scale.</li></ol>
<img class="blog-image-center" src="https://img-cdn.inc.com/image/upload/f_webp%2Cq_auto%2Cc_fit/images/panoramic/getty_161684694_50349.jpg" alt="Office workers using AI-assisted software at their desks" width="2000" height="1333">
<h2>Final Thoughts</h2>
<blockquote><p>"AI won't replace you. But someone using AI might."</p></blockquote>
<p>The question is not whether AI will take your job. It is whether you will learn to work with it. If you want to go deeper on any of these areas, the <a href="/skills">skills</a> and <a href="/projects">projects</a> pages on this site show what I am building, and you can <a href="/contact">reach out</a> directly.</p>$html$,
       updated_at = now(),
       -- Matches the template's own estimate for the rewritten length (~372 words).
       reading_time = 2
 where slug = 'ai-vs-jobs-is-the-future-human-or-machine';
