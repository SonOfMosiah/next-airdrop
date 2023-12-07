import { Connect } from '@/components/Connect';
import { ReactNode } from 'react';

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex flex-col space-y-16 bg-gray-100 dark:bg-gray-800">
            <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-700">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="container flex items-center justify-between">
                        <div className="flex-1"></div>
                        <div className="flex space-x-4">
                            <Connect />
                        </div>
                    </div>
                </div>
            </header>
            <div className="container">
                <main className="flex w-full flex-1 flex-col">{children}</main>
            </div>
        </div>
    );
}
