NATURAL DIAM WEBSITE

The public website is hosted on GitHub Pages. The stock catalogue reads Supabase first.

Dashboard: https://supabase.com/dashboard/project/eigdjzygkqyslwpcaotp
Stock table: public.stones
Media bucket: videos (public read)

EDIT STOCK
Open Table Editor, select stones, then edit the row. Use a unique id such as #46. Fields: type, carat, origin, heat, shape, certificate, color, dimensions, price_per_carat, video_path, poster_path, status.
Prices are exact USD per carat, not rounded. Leave origin NULL when unknown. Certificate is the company name only, not its report number. status available is public; other statuses are hidden.

ADD VIDEO
Upload the MP4 and its JPG poster into the videos bucket. Put their exact stored paths into video_path and poster_path on the matching stone. Paths are relative to the bucket, for example videos/v1.mp4 and posters/v1.jpg. The dashboard may prefix uploaded filenames; always use its actual path. Leave both paths NULL for a stone with no video.

SECURITY
Only the publishable key is used in the website. Public users can SELECT available stock, not insert, update or delete it. Media are public read; no public upload/delete policy is configured. Never put a secret or service-role key into website files.

FALLBACKS
If Supabase does not respond, the catalogue tries the published Google Sheet, then the baked stock data in gems/assets/stones.js. Those are separate backup copies, not automatic mirrors of new Supabase edits. GitHub-hosted clips/posters remain as media fallback. Keep backups current when stock changes.

The Free Supabase project can pause after inactivity. Fallback does not guarantee current stock or uptime. No keep-alive guarantee is configured.

PRICES AND LANGUAGES
showPrices in gems/assets/stones.js controls visible prices. It is currently true. The existing English/Italian/French/Spanish/German translations are self-written, not native-reviewed.

DNS
No custom domain is configured yet. Do not change MX, TXT, SPF, DKIM or other email records when adding website DNS.
