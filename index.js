const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

async function seedData() {
  const walletCount = await prisma.wallet.count();

  if (walletCount === 0) {
    console.log("Seeding data awal...");

    const wallet1 = await prisma.wallet.create({
      data: {
        name: "BCA Tabungan",
        currency: "IDR",
      },
    });

    const wallet2 = await prisma.wallet.create({
      data: {
        name: "Cash",
        currency: "IDR",
      },
    });

    await prisma.transaction.createMany({
      data: [
        {
          amount: 5000000,
          type: "income",
          category: "salary",
          date: new Date("2025-01-05"),
          walletId: wallet1.id,
        },
        {
          amount: 45000,
          type: "expense",
          category: "food",
          date: new Date("2025-01-06"),
          walletId: wallet1.id,
        },
        {
          amount: 25000,
          type: "expense",
          category: "transport",
          date: new Date("2025-01-07"),
          walletId: wallet1.id,
        },
        {
          amount: 80000,
          type: "expense",
          category: "food",
          date: new Date("2025-01-10"),
          walletId: wallet1.id,
        },
        {
          amount: 500000,
          type: "income",
          category: "freelance",
          date: new Date("2025-01-15"),
          walletId: wallet1.id,
        },
        {
          amount: 200000,
          type: "income",
          category: "salary",
          date: new Date("2025-01-05"),
          walletId: wallet2.id,
        },
        {
          amount: 30000,
          type: "expense",
          category: "food",
          date: new Date("2025-01-08"),
          walletId: wallet2.id,
        },
      ],
    });

    console.log("Data awal berhasil dimasukkan");
  }
}

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    message: "API jalan",
  });
});

/* ==================================================
1A. GET /wallets
================================================== */
app.get("/wallets", async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1B. POST /wallets
================================================== */
app.post("/wallets", async (req, res) => {
  try {
    const { name, currency } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        error: "name wajib diisi",
      });
    }

    const wallet = await prisma.wallet.create({
      data: {
        name,
        currency,
      },
    });

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1C. DELETE /wallets/:id
================================================== */
app.delete("/wallets/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const wallet = await prisma.wallet.findUnique({
      where: { id },
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet tidak ditemukan",
      });
    }

    await prisma.transaction.deleteMany({
      where: { walletId: id },
    });

    await prisma.wallet.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1D. GET /wallets/:id/transactions
================================================== */
app.get("/wallets/:id/transactions", async (req, res) => {
  try {
    const walletId = parseInt(req.params.id);

    const transactions = await prisma.transaction.findMany({
      where: {
        walletId,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1E. POST /wallets/:id/transactions
================================================== */
app.post("/wallets/:id/transactions", async (req, res) => {
  try {
    const walletId = parseInt(req.params.id);

    const { amount, type, category, note, date } = req.body;

    if (amount === undefined || !type || !category || !date) {
      return res.status(400).json({
        error: "amount, type, category, dan date wajib diisi",
      });
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet tidak ditemukan",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        note,
        date: new Date(date),
        walletId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1F. DELETE /transactions/:id
================================================== */
app.delete("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction tidak ditemukan",
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1G. GET /wallets/:id/balance
================================================== */
app.get("/wallets/:id/balance", async (req, res) => {
  try {
    const walletId = parseInt(req.params.id);

    const transactions = await prisma.transaction.findMany({
      where: { walletId },
    });

    let balance = 0;

    for (const trx of transactions) {
      if (trx.type === "income") {
        balance += trx.amount;
      } else {
        balance -= trx.amount;
      }
    }

    res.status(200).json({
      walletId,
      balance,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ==================================================
1H. GET /wallets/:id/summary
================================================== */
app.get("/wallets/:id/summary", async (req, res) => {
  try {
    const walletId = parseInt(req.params.id);

    const transactions = await prisma.transaction.findMany({
      where: { walletId },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const trx of transactions) {
      if (trx.type === "income") {
        totalIncome += trx.amount;
      } else {
        totalExpense += trx.amount;
      }
    }

    res.status(200).json({
      walletId,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

seedData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
