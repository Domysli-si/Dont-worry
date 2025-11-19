import Dexie, { Table } from 'dexie';
import { Entry, Metric, Activity, Achievement, SyncQueueItem } from '../types';

export class DontWorryDB extends Dexie {
  // Tables
  entries!: Table<Entry, string>;
  metrics!: Table<Metric, string>;
  activities!: Table<Activity, string>;
  achievements!: Table<Achievement, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super('DontWorryDB');
    
    this.version(1).stores({
      entries: 'id, userId, createdAt, type, synced',
      metrics: 'id, entryId, moodScore, createdAt',
      activities: 'id, entryId, activityType',
      achievements: 'id, userId, achievementType, unlockedAt',
      syncQueue: 'id, operation, timestamp, retries'
    });
  }
}

// Export singleton instance
export const db = new DontWorryDB();

// Helper functions for common operations
export const dbHelpers = {
  // Entries
  async createEntry(entry: Omit<Entry, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.entries.add({ ...entry, id });
    return id;
  },

  async getEntries(userId: string, limit = 50): Promise<Entry[]> {
    return await db.entries
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('createdAt')
      .then(entries => entries.slice(0, limit));
  },

  async getEntryById(id: string): Promise<Entry | undefined> {
    return await db.entries.get(id);
  },

  async updateEntry(id: string, changes: Partial<Entry>): Promise<void> {
    await db.entries.update(id, { ...changes, updatedAt: new Date() });
  },

  async deleteEntry(id: string): Promise<void> {
    await db.entries.delete(id);
    // Also delete related metrics and activities
    await db.metrics.where('entryId').equals(id).delete();
    await db.activities.where('entryId').equals(id).delete();
  },

  // Metrics
  async createMetric(metric: Omit<Metric, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.metrics.add({ ...metric, id });
    return id;
  },

  async getMetricsByEntry(entryId: string): Promise<Metric[]> {
    return await db.metrics.where('entryId').equals(entryId).toArray();
  },

  async getMetricsForDateRange(startDate: Date, endDate: Date): Promise<Metric[]> {
    const entries = await db.entries
      .where('createdAt')
      .between(startDate, endDate)
      .toArray();
    
    const entryIds = entries.map(e => e.id);
    const metrics = await db.metrics
      .where('entryId')
      .anyOf(entryIds)
      .toArray();
    
    return metrics;
  },

  // Activities
  async createActivity(activity: Omit<Activity, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.activities.add({ ...activity, id });
    return id;
  },

  async getActivitiesByEntry(entryId: string): Promise<Activity[]> {
    return await db.activities.where('entryId').equals(entryId).toArray();
  },

  // Achievements
  async unlockAchievement(userId: string, achievementType: Achievement['achievementType'], points: number): Promise<void> {
    const existing = await db.achievements
      .where(['userId', 'achievementType'])
      .equals([userId, achievementType])
      .first();
    
    if (!existing) {
      const id = crypto.randomUUID();
      await db.achievements.add({
        id,
        userId,
        achievementType,
        unlockedAt: new Date(),
        points
      });
    }
  },

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db.achievements
      .where('userId')
      .equals(userId)
      .toArray();
  },

  // Sync Queue
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<void> {
    const id = crypto.randomUUID();
    await db.syncQueue.add({ ...item, id });
  },

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return await db.syncQueue.orderBy('timestamp').toArray();
  },

  async clearSyncQueue(): Promise<void> {
    await db.syncQueue.clear();
  },

  async removeSyncQueueItem(id: string): Promise<void> {
    await db.syncQueue.delete(id);
  }
};
