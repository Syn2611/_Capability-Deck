# Colliers V&A capability statement: CloudPages kit

This kit rebuilds the capability statement as **15 fast CloudPages**. Each page is about 50 to 165 KB,
instead of 3.6 MB. The images live in Content Builder and the styles and script are two shared Code
Resources. Visitors download them once and every other page reuses them.

**Home page hero:** the scroll animation plays as on the main site. Its frames load from the main
site on Cloudflare (`colliers-va-capability.pegasus456.workers.dev/hero-frames/`). Everything else comes from
Salesforce. If the frames ever cannot load, the hero shows the harbour still from Content Builder
with the full text, so the page never looks broken.

## What is in this kit

| Folder / file | What it is |
| --- | --- |
| `images/` | 65 images to upload to Content Builder (JPG, PNG and one SVG) |
| `image-list.csv` | The same 65 images, with the page each one is used on |
| `va-capability-images.txt` | A content block that tells every page where each image lives |
| `code-resources/valuations-styles.css` | Shared styles (Code Resource, type **CSS**) |
| `code-resources/valuations-script.js` | Shared script (Code Resource, type **JavaScript**) |
| `pages/01-valuations.html` … `15-valuations-service-stations.html` | One file per landing page. The file name is the page URL |

Work through the steps in order. Images come first, so no page is ever published without them.

---

## Step 1: Upload the images (about 5 minutes)

1. Go to **Content Builder** and create a folder, e.g. `VA Capability Statement`.
2. Open the folder, click **Upload** and select **all 65 files** in `images/` at once.

## Step 2: Fill in the image addresses (about 20 to 30 minutes, one time only)

1. Open `va-capability-images.txt` in **Notepad**. Each line looks like this:
   `SET @img_photo_office_800 = ""   /* va-photo-office-800.jpg */`
2. In Content Builder, click an image to open its details and copy its **URL**. It looks like
   `https://image.s….sfmc-content.com/lib/…/m/1/….jpg`.
3. Paste the URL **between the two quotes** on the line with that file name:
   `SET @img_photo_office_800 = "https://image.s….jpg"   /* va-photo-office-800.jpg */`
4. Repeat for all 65 lines. Leave everything else in the file as it is. Save.

## Step 3: Create the content block

1. In Content Builder: **Create → Content Blocks → Code Snippet** (or **HTML** if Code Snippet is not offered).
2. Paste the whole of the filled-in `va-capability-images.txt`.
3. Name it `va-capability-images`.
4. Open its **Properties** and set **Customer Key** to exactly `va-capability-images`. Save.
   - If your account will not let you change the key, send me the key it shows and I will update the pages.

## Step 4: Create the two Code Resources

In **CloudPages**, in the **Cap** folder:

1. **Add Content → Code Resource**. Choose type **CSS**. Name and URL: `valuations-styles`.
   Paste the contents of `code-resources/valuations-styles.css`. **Save** and **Publish**.
2. **Add Content → Code Resource**. Choose type **JavaScript**. Name and URL: `valuations-script`.
   Paste the contents of `code-resources/valuations-script.js`. **Save** and **Publish**.
3. Check that both open in the browser:
   - `https://cloud.realestate.colliers.com/valuations-styles`
   - `https://cloud.realestate.colliers.com/valuations-script`

   If the address is different, tell me and I will update the pages.

## Step 5: Update the home page

1. Open the existing **valuations** landing page.
2. Replace all of its code with `pages/01-valuations.html` (open the file in Notepad, **Ctrl+A**, **Ctrl+C**,
   then **Ctrl+A** and **Ctrl+V** in the page's code view or HTML block).
3. **Save** and **Publish**.

## Step 6: Create the other 14 pages

For each file from `02-…` to `15-…`:

1. **Add Content → Landing Page**.
2. Use the file name (without the number and `.html`) as the name and URL, e.g. `valuations-office`.
3. Choose **Blank**, paste the file's code as you did for the home page, then **Save** and **Publish**.

| File | Page URL |
| --- | --- |
| 02-valuations-sectors.html | valuations-sectors |
| 03-valuations-contact.html | valuations-contact |
| 04-valuations-office.html | valuations-office |
| 05-valuations-industrial-logistics.html | valuations-industrial-logistics |
| 06-valuations-retail.html | valuations-retail |
| 07-valuations-hotels-living.html | valuations-hotels-living |
| 08-valuations-agribusiness.html | valuations-agribusiness |
| 09-valuations-healthcare-retirement-living.html | valuations-healthcare-retirement-living |
| 10-valuations-government-legal.html | valuations-government-legal |
| 11-valuations-mortgage.html | valuations-mortgage |
| 12-valuations-data-centres.html | valuations-data-centres |
| 13-valuations-self-storage.html | valuations-self-storage |
| 14-valuations-childcare-education.html | valuations-childcare-education |
| 15-valuations-service-stations.html | valuations-service-stations |

## Step 7: Check

Open `https://cloud.realestate.colliers.com/valuations` in a private window and check:

- All photos show (hero, sector tiles, track record, leaders, certification logos).
- The section bar scrolls, a leader card opens its profile and the Track record filter works.
- **Sectors** in the top menu and every sector tile open the CloudPages sector pages, not Cloudflare.
- Each sector page's **Next sector**, **Contact** and breadcrumb links stay on CloudPages.

**If images are missing:** the content block is not being found. Check its Customer Key (Step 3).
**If the page looks unstyled:** check the CSS Code Resource opens at the address in Step 4.

## Updating later

- **Change an image:** upload the new file, then replace its URL in the content block. Every page updates.
- **Change styles or behaviour:** I send you a new CSS or JS file. Republish the Code Resource only.
- **Change wording:** I send the updated page file(s). Republish only those pages.
