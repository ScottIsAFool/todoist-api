export interface Project {
    id: number;
    color: number;
    name: string;
    comment_count: number;
    shared: boolean;
    sync_id: number;
    inbox_project: boolean;
    team_inbox?: boolean;
    order?: number;
    parent?: number;
};

export interface Section {
    id: number;
    project_id: number;
    order: number;
    name: string;
};

export interface DueDate {
    recurring: boolean;
    string: string;
    date: string;
    datetime?: Date;
    timezone: string;
};

export interface Task {
    id: number;
    project_id: number;
    section_id: number;
    order: number;
    content: string;
    completed: boolean;
    label_ids: number[];
    priority: number;
    comment_count: number;
    created: Date;
    url: string;
    parent?: number;
    due: DueDate;
};

export interface Attachment {
    file_type: string;
    file_name: string;
    image: string;
    file_url: string;
    image_width: number;
    image_height: number;
    file_size: number;
    upload_state: string;
    resource_type: string;
};

export interface Comment {
    id: number;
    task_id?: number;
    project_id?: number;
    posted: Date;
    content: string;
    attachment?: Attachment;
};