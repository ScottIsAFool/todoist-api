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
}

export interface Section {
    id: number;
    project_id: number;
    order: number;
    name: string;
}