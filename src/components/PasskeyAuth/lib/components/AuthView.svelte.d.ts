import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        registerRequestUrl: string;
        registerResponseUrl: string;
        loginRequestUrl: string;
        loginResponseUrl: string;
        locale?: string;
        title?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type AuthViewProps = typeof __propDef.props;
export type AuthViewEvents = typeof __propDef.events;
export type AuthViewSlots = typeof __propDef.slots;
export default class AuthView extends SvelteComponent<AuthViewProps, AuthViewEvents, AuthViewSlots> {
}
export {};
