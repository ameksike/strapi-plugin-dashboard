export interface CmpAttrs {
    name: string;
    value: any;
    initialValue?: any;
    mainField?: any;
    label?: string;
    error?: string
    hint?: string;
    type?: string;
    onChange: () => void;
    rawError?: Error;
    placeholder?: string;
    attribute?: {
        pluginOptions?: any;
        customField: string;
        type: string;
        options?: {
            fetch?: {
                url?: string;
                body?: string;
                header?: string;
                method?: string;
            }
        }
    },
    disabled?: boolean;
    required?: boolean;
    unique?: boolean;
}