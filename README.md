## Hi there 👋

<!--
**Chiara-group/chiara-group** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->

## Deploy dan SEO di Vercel

Impor repo ini ke Vercel dan lakukan deployment Production. `vercel.json` sudah menetapkan perintah build dan direktori output `dist/`. Build menyalin halaman asli dan menambahkan metadata SEO di `<head>` pada salinan yang dipublikasikan. Build juga membuat `/robots.txt` dan `/sitemap.xml`.

Aktifkan **System Environment Variables** di pengaturan proyek agar build memakai domain produksi dari `VERCEL_PROJECT_PRODUCTION_URL`. Ini mendukung alamat `*.vercel.app` maupun domain sendiri. Jika proyek punya beberapa domain, atur `SITE_URL` ke URL HTTPS utama di environment **Production** dan **Preview**, lalu deploy ulang. Semua URL SEO akan memakai domain dari `SITE_URL` jika tersedia. [Dokumentasi Vercel](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_project_production_url)

Setelah deployment Production aktif, verifikasi URL produksi di Google Search Console, kirim `/sitemap.xml` di menu **Sitemaps**, lalu gunakan **URL Inspection** untuk meminta pengindeksan beranda. [Panduan Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

Untuk menjalankan build lokal dengan PowerShell, ganti URL contoh dengan alamat produksi proyek.

```powershell
$env:SITE_URL = 'https://example.com'
node scripts/build-seo.mjs
```
