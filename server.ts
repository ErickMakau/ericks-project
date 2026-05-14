import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Mock API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication Mock
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // In real app, verify with DB
    if (email && password) {
      const isAdmin = email.includes('admin');
      res.json({
        token: 'mock_jwt_token_from_server',
        user: {
          id: 'u1',
          name: isAdmin ? 'Admin User' : 'Standard User',
          email: email,
          role: isAdmin ? 'ADMIN' : 'USER',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
