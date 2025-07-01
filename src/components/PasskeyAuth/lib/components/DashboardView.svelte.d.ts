import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        logoutUrl: string;
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
export type DashboardViewProps = typeof __propDef.props;
export type DashboardViewEvents = typeof __propDef.events;
export type DashboardViewSlots = typeof __propDef.slots;
export default class DashboardView extends SvelteComponent<DashboardViewProps, DashboardViewEvents, DashboardViewSlots> {
}
export {};
