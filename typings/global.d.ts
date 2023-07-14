declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    NEWS_API_KEY: string;
  }
}
