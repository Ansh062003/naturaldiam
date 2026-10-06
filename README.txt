NATURAL DIAM - LIVE SHOWCASE SITE (static, reads Google Sheet live)

SITE LAYOUT: index.html = homepage (naturaldiam.it). gems/ = live stock catalogue (naturaldiam.it/gems). Upload the whole folder to the web host root. No WordPress, PHP or database needed.

LIVE DATA: gems/assets/stones.js already has sheetCsvUrl set to the published Google Sheet CSV. To change the sheet, edit that URL. Prices from the sheet are rounded to nearest 50 USD (nearest 25 under 500).
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv"
The site re-reads the sheet on every page load. If the sheet cannot be loaded, it shows the 24 baked stones.
Sheet columns used (header names, any order): Stock No, Stone, Carat, Treatment, Shape, Origin, Certificate, Colour, Size, Price per ct, Status. Rows with Status sold/hold/reserved are hidden.

NEW STONES / VIDEOS: a new row in the sheet shows up automatically (card says "Video coming soon").
To add its video: put the mp4 in gems/assets/videos/ and a poster jpg in gems/assets/posters/, then add a line to gems/assets/videos.js
  in VIDEO_MAP:  "#45":"assets/videos/v45.mp4"   and in __poster: "assets/videos/v45.mp4":"assets/posters/v45.jpg"
(Or put a YouTube / Vimeo / Google Drive link in a "Video" column of the sheet.)

DNS (domain person): add ONLY website records. DO NOT change MX, TXT, SPF, DKIM or any email records.
