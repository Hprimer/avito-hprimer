export interface MyTask {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee: {
        id: number;
        fullName: string;
        email: string;
        avatarUrl: string;
    };

}
export interface ExtendedTask extends MyTask {
    assigneeId: number;
    boardId: number;
    boardName: string;
}