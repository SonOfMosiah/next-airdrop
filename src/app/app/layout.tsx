import { Connect } from '@/components/Connect';
import { ReactNode } from 'react';

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex flex-col space-y-16">
            <header className="sticky top-0 z-40 flex w-full flex-col">
                <div className="flex h-16 w-full items-center justify-between border-b bg-background py-4">
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
