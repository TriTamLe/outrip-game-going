# Game Going

Ứng dụng điều phối game nội bộ cho 4 team:

- `Kindness`
- `One-Team`
- `Excellence`
- `Sustainability`

App có 2 màn hình chính:

- `/control`: màn hình điều khiển trên điện thoại hoặc laptop
- `/present`: màn hình trình chiếu cho TV / máy chiếu

Dữ liệu được lưu trên Convex, UI dùng React + TanStack Router + Ant Design + Tailwind CSS v4.

## Tính năng chính

### Scoreboard

- Hiển thị điểm của 4 team theo màu riêng
- Cộng / trừ điểm nhanh ở `/control`
- Có shortcut điểm `-20, -15, -10, -5, +5, +10, +15, +20`
- Có reset điểm từng team với xác nhận
- Hiển thị thứ hạng bằng icon trên cả `/control` và `/present`

### Game: Tâm Đầu Ý Hợp

- Dùng dữ liệu `postureWords`
- `/control` có module chọn active word
- `/present` hiển thị word ở dạng popup lớn giữa màn hình

### Game: Tiếng Tây Tiếng Ta

- Chơi theo từng team
- Dùng dữ liệu `idioms`
- Có các phase:
  - `waiting`
  - `playing`
  - `ending`
- Hỗ trợ:
  - `Passed`
  - `Guessed`
  - `Pause / Resume`
  - `End`
- Có timer đồng bộ bằng Convex
- Trạng thái idiom theo từng team gồm:
  - `not-displayed`
  - `passed`
  - `guessed`
  - `guessed-by-other`

### Rule mode

- Có route quản lý luật chơi riêng
- `/control` có thể bật rule mode cho từng game
- `/present` hiển thị markdown rule ở popup lớn giữa màn hình

Các game hiện có trong phần rules:

- `Tâm Đầu Ý Hợp`
- `Tiếng Tây Tiếng Ta`
- `Cuộc đấu Bất đồng bộ`
- `Cuộc đi săn đầy yêu thương`

### CRUD quản trị dữ liệu

- `/idioms`: quản lý idioms và status reset
- `/posture-words`: quản lý posture words song ngữ Anh / Việt
- `/rules`: quản lý luật chơi theo markdown, có preview ngay trong form

## Route

| Route            | Mục đích                    |
| ---------------- | --------------------------- |
| `/`              | Trang chủ, điều hướng nhanh |
| `/control`       | Màn hình điều khiển         |
| `/present`       | Màn hình trình chiếu        |
| `/idioms`        | Quản lý idioms              |
| `/posture-words` | Quản lý posture words       |
| `/rules`         | Quản lý luật chơi           |

## Data model trên Convex

Các table chính hiện tại:

- `teams`: điểm số của 4 team
- `idioms`: câu thành ngữ và status theo từng team
- `postureWords`: từ cho game Tâm Đầu Ý Hợp
- `rules`: luật chơi theo từng game
- `globalStatus`: trạng thái toàn cục của app
- `postureGame`: state riêng cho game Tâm Đầu Ý Hợp
- `vienameseGame`: state riêng cho round Tiếng Tây Tiếng Ta
- `vienameseSettings`: cấu hình thời lượng cho Tiếng Tây Tiếng Ta

## Tech stack

- React 19
- TypeScript
- Vite
- TanStack Router
- Convex
- Ant Design
- Tailwind CSS v4
- React Icons
- React Markdown

## Code quality

Project đã được set up sẵn:

- ESLint flat config với recommended rules cho JavaScript / TypeScript
- React Hooks rules
- React Refresh rules cho Vite
- Tailwind CSS lint rules
- Prettier + `prettier-plugin-tailwindcss`

Các file config chính:

- `eslint.config.js`
- `.prettierrc.json`
- `.prettierignore`

## Chạy local

### 1. Cài dependencies

```bash
yarn
```

### 2. Kết nối Convex

Nếu đây là lần đầu chạy project:

```bash
npx convex dev
```

Lệnh này sẽ:

- đăng nhập / chọn deployment Convex
- tạo `.env.local`
- sinh code trong `convex/_generated`

Sau bước này app sẽ có `VITE_CONVEX_URL`.

### 3. Chạy frontend

```bash
yarn dev
```

App chạy ở:

```text
http://localhost:3000
```

## Scripts

```bash
yarn dev
yarn typecheck
yarn lint
yarn format
yarn build
yarn convex:dev
yarn convex:deploy
```

## Workflow Convex

Khi thay đổi schema hoặc functions trong thư mục `convex/`, chạy:

```bash
npx convex dev --once
```

hoặc:

```bash
yarn convex:dev
```

Để deploy backend Convex:

```bash
yarn convex:deploy
```

## Cấu trúc thư mục

```text
src/
  features/
    global-status/
    idioms/
    posture-game/
    posture-words/
    rules/
    team-scoreboard/
    vienamese-game/
  pages/
    control.tsx
    idioms.tsx
    index.tsx
    posture-words.tsx
    present.tsx
    rules.tsx
convex/
  globalStatus.ts
  idioms.ts
  postureGame.ts
  postureWords.ts
  rules.ts
  schema.ts
  teams.ts
  vienameseGame.ts
```

## Ghi chú

- App yêu cầu `VITE_CONVEX_URL`; nếu thiếu, frontend sẽ báo lỗi và yêu cầu chạy `npx convex dev`
- `/control` và `/present` được thiết kế cho hai thiết bị / hai màn hình chạy song song
- `yarn typecheck` là cách kiểm tra type chính trong quá trình phát triển
- `yarn lint` sẽ fail nếu còn warning
- `yarn format` sẽ format toàn bộ repo bằng Prettier
