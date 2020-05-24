export interface EventData {
    day_order: number;
    added_by_uid: number;
    assigned_by_uid: number;
    labels?: number[];
    sync_id?: number;
    in_history: boolean;
    has_notifications: boolean;
    parent_id?: number;
    checked: boolean;
    date_added: Date;
    id: number;
    content: string;
    user_id: number;
    due?: Due;
    children?: any;
    priority: number;
    child_order: number;
    is_deleted: boolean;
    responsible_uid?: any;
    project_id: number;
    collapsed: boolean;
};

export interface TodoistEvent {
    event_name: string;
    user_id: number;
    event_data: EventData;
};

export interface Due {
    date: string;
    is_recurring: boolean;
    lang: string;
    string: string;
    timezone?: string;
};