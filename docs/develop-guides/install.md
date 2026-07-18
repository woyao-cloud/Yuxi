#### 后端项目本地调试向导

项目后端使用 Python 3.13 + FastAPI + uv 管理。有两种调试方式：

方式 1：在 Docker 中调试（推荐，最省心）

后端容器已配置热重载，修改本地代码后自动生效：

# 启动所有依赖服务 + API
docker compose up -d api

# 查看实时日志
docker logs api-dev --tail 50 -f

# 修改 backend/server/ 下的代码，uvicorn 会自动重载

方式 2：本地运行 Python（需要自己装依赖）

# 1. 进入 backend 目录
cd backend

# 2. 安装依赖（使用 uv）
uv sync

# 3. 启动开发服务器（服务需要先启动）
docker compose up -d postgres redis neo4j milvus minio
# powershell 配置环境变量
 $env:POSTGRES_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/yuxi"
 $env:REDIS_URL = "redis://localhost:6379/0" 
 $env:VITE_API_URL = "http://localhost:5050"
 $env:POSTGRES_PASSWORD = "postgres"

# 4. 运行 API
uv run uvicorn server.main:app --host 0.0.0.0 --port 5050 --reload

![alt text](image.png)
方式 3：本地调试 + IDE 断点（PyCharm/VSCode）

# 启动依赖服务
docker compose up -d postgres redis neo4j milvus minio

# 在 IDE 中打开 backend/ 目录
# 运行时配置：
#   - 模块: uvicorn
#   - 参数: server.main:app --reload --port 5050
#   - 工作目录: backend/
#   - Python 解释器: 选择 uv 创建的虚拟环境

重要提示

- 依赖服务（PostgreSQL、Redis、Neo4j、Milvus、MinIO）建议通过 Docker 运行
- .env 文件必须配置好（参考 .env.template）
- 首次启动时，Docker 方式会自动处理所有依赖，推荐使用方式 1


# 问题及解决方法
 ## 1
 但热重载触发了反复重启，因为 saves/skills/ 目录下的临时文件被 WatchFiles 检测到了。可以这样解决：

# 排除 saves 目录，避免反复重启
uv run uvicorn server.main:app --host 0.0.0.0 --port 5050 --reload --reload-dir server --reload-dir package --reload-exclude saves

或者打开新终端，忽略日志看实际服务：

# 查看当前 API 是否正常响应
curl http://localhost:5050/api/system/health


# 前端vue

cd web
$env:VITE_API_URL = "http://localhost:5050"
pnpm dev

直接修改 web/vite.config.js 第 18 行：

// 修改前
target: env.VITE_API_URL || 'http://api:5050',

// 修改后
target: env.VITE_API_URL || 'http://localhost:5050',

改完保存，Vite 会自动热重载，不需要重启。

## 前端reactjs
 pnpm dev

# 查找占用 5173 端口的进程
netstat -ano | findstr :5173

# 杀掉进程（最后一列是 PID）
taskkill /F /PID <PID>