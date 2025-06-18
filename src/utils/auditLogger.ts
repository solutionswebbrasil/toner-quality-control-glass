
import { supabase } from '@/integrations/supabase/client';

interface AuditLogData {
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
}

export const auditLogger = {
  async logAction(data: AuditLogData): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: data.action,
          table_name: data.table_name,
          record_id: data.record_id,
          old_values: data.old_values,
          new_values: data.new_values,
          ip_address: null, // Could be implemented with additional client-side logic
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
      // Don't throw error to avoid breaking the main operation
    }
  },

  async logCreate(tableName: string, recordId: string, newValues: any): Promise<void> {
    await this.logAction({
      action: 'CREATE',
      table_name: tableName,
      record_id: recordId,
      new_values: newValues
    });
  },

  async logUpdate(tableName: string, recordId: string, oldValues: any, newValues: any): Promise<void> {
    await this.logAction({
      action: 'UPDATE',
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues
    });
  },

  async logDelete(tableName: string, recordId: string, oldValues: any): Promise<void> {
    await this.logAction({
      action: 'DELETE',
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues
    });
  },

  async logBulkDelete(tableName: string, count: number): Promise<void> {
    await this.logAction({
      action: 'BULK_DELETE',
      table_name: tableName,
      record_id: `${count}_records`,
      new_values: { deleted_count: count }
    });
  }
};
