import { TodoistEvent } from "../src/webhookEntities";

export const validEventData: TodoistEvent = {
    event_name: "task:completed",
    user_id: 1234567,
    event_data: {
        day_order: 0,
        added_by_uid: 1234567,
        assigned_by_uid: 1234567,
        in_history: false,
        has_notifications: false,
        checked: false,
        date_added: new Date("2020-05-24"),
        id: 2345678,
        content: "kwijibo",
        user_id: 1234567,
        priority: 1,
        child_order: 0,
        is_deleted: false,
        project_id: 3456789,
        collapsed: false
    }
};