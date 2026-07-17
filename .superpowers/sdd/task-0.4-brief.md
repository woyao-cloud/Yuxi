### Task 0.4：配置 ESLint + Prettier

  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: 瀹夎渚濊禆骞堕獙璇?*

```bash
cd web-react
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-config-prettier prettier prettier-plugin-tailwindcss
pnpm lint
```

鏈熷緟杈撳嚭锛氭棤閿欒鎴栦粎璀﹀憡銆?
- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/
git commit -m "chore(web-react): configure ESLint and Prettier"
```

---

## 闃舵 1锛氬熀纭€妗嗘灦

