
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_API_BASE_URL: string    // Add other environment variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: <T = unknown>(pattern: string) => Record<string, () => Promise<T>>;
}
