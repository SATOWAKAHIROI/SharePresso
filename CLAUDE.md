# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Lint
npm run lint

# Prismaスキーマ変更後のマイグレーション
npx prisma migrate dev --name <migration_name>

# Prismaクライアント再生成（schema.prisma変更後）
npx prisma generate

# Supabase型定義の再生成
npx supabase gen types typescript --project-id oxzfdrvnzmkfgwvlggit > app/types/supabase.ts

# Docker起動
docker-compose up --build
```

## Architecture

Next.js 16 App Router を使用。`app/` 配下がルーティングの起点。

**認証:** Supabase Auth（Google / Apple OAuth）。サーバーコンポーネントからは `app/lib/supabase/server.ts` の `createClient()` を使用。管理者権限が必要な操作は `app/lib/supabase/admin.ts` の `supabaseAdmin` を使用。

**DB アクセス:** Prisma（`@prisma/adapter-pg` 経由で Supabase PostgreSQL に接続）。`app/lib/prisma.ts` の `prisma` シングルトンを import して使用する。PrismaClient は `app/generated/prisma/` に生成される（gitignore済み）。

**画像:** Supabase Storage に保存し、URLを `PostImage.url` に格納する。

**API:** Next.js の Route Handlers（`app/api/` 配下）で実装する。

## Environment Variables

| 変数名 | 用途 | ファイル |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL | `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー | `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 管理者キー（サーバーのみ） | `.env.local` |
| `DATABASE_URL` | PostgreSQL 接続文字列 | `.env` |

## Database Schema

主要モデルの関係：

- **User** — 投稿・いいね・リポスト・フォロー・通知の起点
- **Post** — `repostOfId`（シンプルリポスト元）と `quotePostId`（引用リポスト元）の自己参照を持つ
- **Repost** — `type: REPOST | QUOTE` で種別を区別。`comment` は QUOTE のみ使用
- **PostHashtag** — Post と Hashtag の中間テーブル（複合主キー）
- **Notification** — `type: LIKE | REPOST | QUOTE | FOLLOW`。`actorId` が通知を発生させたユーザー

スキーマ変更時は必ず `npx prisma migrate dev` → `npx prisma generate` の順で実行すること。

## Todo 管理

タスクを1つ完了するたびに、必ず `TODO.md` の該当項目を `- [x]` に更新すること。まとめて更新せず、完了した直後に反映する。

## Key Constraints

- `PostImage` は1投稿あたり最大4枚
- `Like` は `@@unique([userId, postId])` で重複いいね防止
- `Follow` は `@@unique([followerId, followingId])` で重複フォロー防止
- `Repost` は `@@unique([userId, postId, type])` で同一タイプの重複リポスト防止
- `next.config.ts` に `output: "standalone"` が必須（Docker の standalone ビルドに必要）
