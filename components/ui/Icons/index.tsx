import {
    AlertTriangle,
    ArrowRight,
    ArrowUpDown,
    Blocks,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    Edit,
    Eye,
    File,
    FileText,
    Gem,
    GitFork,
    HelpCircle,
    History,
    Home,
    Image,
    Infinity,
    Layers,
    Laptop,
    Loader2,
    LucideProps,
    Minus,
    Moon,
    MoreHorizontal,
    MoreVertical,
    Pause,
    Pizza,
    Plus,
    Rocket,
    Settings,
    ShieldCheck,
    SlidersHorizontal,
    SunMedium,
    Trash,
    User,
    Workflow,
    X,
    Zap,
    HelpCircleIcon,
    Maximize2,
    Minimize2,
    RefreshCcw,
    Star,
} from 'lucide-react'

export const Icons = {
    close: X,
    spinner: Loader2,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronDown: ChevronDown,
    edit: Edit,
    trash: Trash,
    post: FileText,
    page: File,
    media: Image,
    settings: Settings,
    billing: CreditCard,
    ellipsis: MoreHorizontal,
    ellipsisVertical: MoreVertical,
    fork: GitFork,
    add: Plus,
    subtract: Minus,
    warning: AlertTriangle,
    user: User,
    arrowRight: ArrowRight,
    help: HelpCircle,
    pizza: Pizza,
    sun: SunMedium,
    sort: ArrowUpDown,
    moon: Moon,
    laptop: Laptop,
    infinity: Infinity,
    slidersHorizontal: SlidersHorizontal,
    eye: Eye,
    pause: Pause,
    layers: Layers,
    blocks: Blocks,
    workflow: Workflow,
    shieldCheck: ShieldCheck,
    gem: Gem,
    gitHub: ({ ...props }: LucideProps) => (
        <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="github"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            {...props}
        >
            <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            ></path>
        </svg>
    ),
    logo: ({ ...props }: LucideProps) => (
        <svg
            data-prefix="fab"
            data-icon="supaLogo"
            role="img"
            viewBox="0 0 120 134"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M53.2851 1.77712C57.3978 -0.592375 62.4646 -0.592375 66.5777 1.77712L113.216 28.6461C117.329 31.0156 119.862 35.3942 119.862 40.1332V56.11L93.3853 56.1174L69.8772 56.1253C68.8285 56.1253 67.9782 55.2768 67.9782 54.2304V29.7726C67.9782 28.8816 66.8572 28.4833 66.293 29.1739L26.4812 77.8972L0 51.2766V40.1332C0 35.3942 2.53361 31.0156 6.64627 28.6461L53.2851 1.77712Z"
                fill="currentColor"
            />
            <path
                d="M26.4812 77.8972L49.9935 77.9194C51.0418 77.9199 51.8911 78.7683 51.8911 79.8143V104.252C51.8911 105.144 53.0121 105.542 53.5763 104.851L93.3853 56.1174L119.862 82.7232V93.8712C119.862 98.6102 117.329 102.989 113.216 105.358L66.5777 132.227C62.4646 134.597 57.3978 134.597 53.2851 132.227L6.64627 105.358C2.53361 102.989 0 98.6102 0 93.8712V77.8967L26.4812 77.8972Z"
                fill="currentColor"
            />
        </svg>
    ),
    twitter: ({ ...props }: LucideProps) => (
        <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
    ),
    check: Check,
    home: Home,
    rocket: Rocket,
    history: History,
    copy: Copy,
    power: Zap,
    youTube: ({ ...props }: LucideProps) => (
        <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                clipRule="evenodd"
            />
        </svg>
    ),
    questionMarkCircle: HelpCircleIcon,
    maximize: Maximize2,
    minimize: Minimize2,
    refresh: RefreshCcw,
    star: Star,
    heart: ({ ...props }: LucideProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
        </svg>
    ),
    heartFull: ({ ...props }: LucideProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
    ),
}