<<<<<<< HEAD
# Tugas Kecil 1 — Student API
## Web Advanced Development

---

## Cara Mengerjakan

1. **Fork** repo ini ke akun GitHub kalian
2. **Clone** fork kalian ke komputer lokal:
   ```bash
   git clone https://github.com/<username-kalian>/tucil1-student-api
   cd tucil1-student-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Buka `index.js` — kerjakan setiap bagian bertanda `TODO`
5. Jalankan server untuk test:
   ```bash
   node index.js
   ```
6. Test semua endpoint di **Postman**
7. **Commit & push** ke fork kalian:
   ```bash
   git add .
   git commit -m "Tucil 1 - NIM - Nama"
   git push
   ```
8. Submit link GitHub repo kalian ke LMS sebelum **Sabtu 23:59**

---

## Struktur File

```
tucil1-student-api/
├── index.js          ← File utama yang harus dikerjakan (CRUD in-memory)
├── index.prisma.js   ← File bonus (refactor ke Prisma)
├── package.json
└── README.md
```

---

## Bonus — Refactor ke Prisma

Setelah `index.js` selesai dan berfungsi, kerjakan `index.prisma.js`:

1. Install Prisma:
   ```bash
   npm install @prisma/client prisma
   npx prisma init
   ```
2. Edit `prisma/schema.prisma` — tambahkan model Student (lihat komentar di `index.prisma.js`)
3. Buat database & migrate:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Kerjakan semua TODO di `index.prisma.js`
5. Jalankan di port 3001: `node index.prisma.js`
=======
# uts_wad
>>>>>>> 5e3cb16288061d0079a6d6418e19b08e23cb9bd7
