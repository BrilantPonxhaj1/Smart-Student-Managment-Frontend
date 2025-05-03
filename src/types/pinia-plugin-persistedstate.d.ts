// src/types/pinia-plugin-persistedstate.d.ts
import 'pinia'

declare module 'pinia' {
    // Augment the options accepted by setup stores
    export interface DefineSetupStoreOptions<Id, S, G, A> {
        /**
         * Enable persistence via pinia-plugin-persistedstate.
         * - `true` to persist entire state
         * - or an object to configure (storage, key, pick, omit, etc.)
         */
        persist?: boolean | {
            key?: string
            storage?: Storage
            // …you can add pick?: string[] etc. if you like
        }
    }
}
