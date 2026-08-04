import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  json,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// Better Auth Tables (required - do NOT modify column names)
// ============================================================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),
})

// ============================================================================
// App Tables (custom schema for releases, issues, etc.)
// ============================================================================

export const stableReleases = pgTable('stable_releases', {
  id: text('id').primaryKey(),
  appName: text('appName').notNull(), // 'NevPlay', 'APK-Pure', etc.
  version: text('version').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  releaseNotes: text('releaseNotes'),
  imageUrl: text('imageUrl'), // URL to release image (stored in Blob)
  apkUrl: text('apkUrl'), // URL to APK file (stored in Blob)
  downloadCount: integer('downloadCount').notNull().default(0),
  githubReleaseId: text('githubReleaseId').notNull().unique(),
  prerelease: boolean('prerelease').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const betaReleases = pgTable('beta_releases', {
  id: text('id').primaryKey(),
  appName: text('appName').notNull(), // 'NevPlay', 'APK-Pure', etc.
  version: text('version').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  releaseNotes: text('releaseNotes'),
  imageUrl: text('imageUrl'), // URL to beta release image
  apkUrl: text('apkUrl'), // URL to beta APK file
  downloadCount: integer('downloadCount').notNull().default(0),
  githubReleaseId: text('githubReleaseId').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const downloadLogs = pgTable('download_logs', {
  id: text('id').primaryKey(),
  releaseId: text('releaseId').notNull(),
  releaseType: text('releaseType', { enum: ['stable', 'beta'] }).notNull(), // 'stable' or 'beta'
  appName: text('appName').notNull(),
  downloadedAt: timestamp('downloadedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
})

export const userIssues = pgTable('user_issues', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category', { enum: ['bug', 'feature', 'suggestion'] }).notNull(),
  type: text('type', { enum: ['critical', 'high', 'normal', 'low'] }).notNull(),
  attachments: json('attachments'), // Array of file URLs
  email: text('email').notNull(),
  status: text('status', { enum: ['open', 'in-progress', 'resolved', 'closed'] })
    .notNull()
    .default('open'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const comingSoonApps = pgTable('coming_soon_apps', {
  id: text('id').primaryKey(),
  appName: text('appName').notNull().unique(),
  description: text('description').notNull(),
  estimatedRelease: text('estimatedRelease'), // e.g., "Q3 2026"
  status: text('status', { enum: ['planned', 'in-development', 'beta-coming', 'coming-soon'] })
    .notNull()
    .default('planned'),
  imageUrl: text('imageUrl'), // URL to app preview/logo
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ============================================================================
// Relations (optional - for type inference)
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
