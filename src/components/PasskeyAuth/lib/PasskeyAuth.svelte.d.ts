import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        registerRequestUrl: string;
        registerResponseUrl: string;
        loginRequestUrl: string;
        loginResponseUrl: string;
        logoutUrl: string;
        sessionUrl: string;
        locale?: string;
        title?: string | undefined;
        dashboardTitle?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type PasskeyAuthProps = typeof __propDef.props;
export type PasskeyAuthEvents = typeof __propDef.events;
export type PasskeyAuthSlots = typeof __propDef.slots;
export default class PasskeyAuth extends SvelteComponent<PasskeyAuthProps, PasskeyAuthEvents, PasskeyAuthSlots> {
}
export {};
