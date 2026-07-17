### Task 4.4：Docker 配置


**Files:**
- Create: `web-react/Dockerfile`
- Modify: `docker-compose.yml`锛堟坊鍔?web-react 鏈嶅姟锛?
**Interfaces:**
- Consumes: 闃舵 0 鐨勮剼鎵嬫灦
- Produces: 鍙湪 Docker 涓儹閲嶈浇杩愯鐨?React 鍓嶇

- [ ] **Step 1: 鍒涘缓 `Dockerfile`**

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dev
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
```

- [ ] **Step 2: 鏇存柊 `docker-compose.yml` 娣诲姞 web-react 鏈嶅姟**

鍙傝€冪幇鏈?`web` 鏈嶅姟閰嶇疆锛屾坊鍔?`web-react` 鏈嶅姟锛屾寕杞?`web-react/` 鐩綍鍒板鍣ㄣ€?
- [ ] **Step 3: 鎻愪氦**

```bash
git add web-react/Dockerfile docker-compose.yml
git commit -m "feat(web-react): add Docker configuration"
```

---

