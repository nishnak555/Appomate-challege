import { TaskForm } from '@/components/tasks/task-form';
import { TaskList } from '@/components/tasks/task-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
                    </div>
                    <p className="text-muted-foreground">Manage your tasks with simplicity and elegance</p>
                </div>

                <div className="space-y-6">
                    <TaskForm />
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TaskList />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
