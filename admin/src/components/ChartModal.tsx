import { TextInput, Textarea, Button, Modal, JSONInput, Field } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { FormEvent, useState, useReducer } from "react";
import { Chart, protoChart, toStr } from "../models/Chart";
import { getTranslation } from "../utils/getTranslation";
import { useIntl } from "react-intl";

interface CharModalProps {
    onConfirm?: (value: Chart) => void;
    data?: Chart;
    open?: boolean;
    btnOpen?: boolean;
    ctrl?: Ctrl;
}

interface CharModalCtrlProps {
    data?: Chart;
    open?: boolean;
}

interface Ctrl {
    state: {
        open?: boolean;
        label?: string;
        query?: string;
        config?: string;
    };
    close: () => void;
    open: (data?: Chart) => void;
    set: (data: Chart) => void;
    dispatch: React.Dispatch<{
        label?: string;
        query?: string;
        config?: string;
        open?: boolean;
    }>;
}

type GetChart = (param: string) => Chart | null;

export const ChartModalCtrl = ({ data, open }: CharModalCtrlProps = {}) => {
    const extract = (data?: Chart) => (data ? {
        label: data?.label || "",
        query: data?.query || "",
        config: toStr(data || protoChart)
    } : {});
    const [state, dispatch] = useReducer((state, action) => (
        { ...state, ...action }),
        { config: toStr(data || protoChart), query: protoChart.query, ...extract(data), open }
    );
    return {
        state,
        dispatch,
        close: () => dispatch({ open: false }),
        open: (data?: Chart) => dispatch({ open: true, ...extract(data) }),
        set: (data: Chart) => dispatch(extract(data))
    };
}

export function ChartModal({ onConfirm, data, open, btnOpen, ctrl }: CharModalProps) {
    const { formatMessage } = useIntl();
    const [error, setError] = useState("");
    const [isBtnOpen] = useState(btnOpen ?? false);
    const { state, dispatch } = ctrl || ChartModalCtrl({ data, open });

    const getConfig: GetChart = (value: string) => {
        try {
            const local = state?.config && JSON.parse(state.config);
            if (typeof local !== 'object' || local === null) {
                throw new Error(formatMessage({ id: getTranslation('modal.config.error') }));
            }
            setError("");
            return local as Chart;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            return null;
        }
    }

    const handleError = () => {
        return null;
    };

    const handlerClose = () => {
        dispatch({ label: "", query: "", config: toStr(data || protoChart), open: false });
    };

    const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let proto = getConfig(state?.config!);
        if (proto && !error) {
            proto.label = state?.label;
            proto.query = state?.query;
            onConfirm instanceof Function && onConfirm(proto);
            handlerClose();
        } else {
            console.log(error)
        }
    }

    return (
        <Modal.Root open={state.open} onOpenChange={(value: boolean) => dispatch({ open: value })}>
            {isBtnOpen && <Modal.Trigger>
                <Button variant="secondary" startIcon={<Plus />} onClick={() => dispatch({ open: true })} >{formatMessage({ id: getTranslation('modal.btn.create') })}</Button>
            </Modal.Trigger>}
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>{formatMessage({ id: getTranslation('modal.add') })}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleConfirm} >
                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                        <Field.Root name="label" marginBottom={4} required>
                            <Field.Label>{formatMessage({ id: getTranslation('modal.label.title') })} </Field.Label>
                            <TextInput
                                placeholder={formatMessage({ id: getTranslation('modal.label.placeholder') })}
                                label="Label"
                                name="text"
                                hint="Max 40 characters"
                                error={handleError()}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ label: e.target.value })}
                                value={state.label}
                            />
                        </Field.Root>

                        <Field.Root id="config" marginBottom={4} required>
                            <Field.Label>{formatMessage({ id: getTranslation('modal.config.title') })}</Field.Label>
                            <JSONInput
                                value={state.config}
                                aria-label="JSON"
                                error={error}
                                onChange={(value: string) => dispatch({ config: value })}
                            />
                            <Field.Error />
                            <Field.Hint />
                        </Field.Root>

                        <Field.Root name="query" marginBottom={4} required>
                            <Field.Label>{formatMessage({ id: getTranslation('modal.query.title') })}</Field.Label>
                            <Textarea
                                placeholder={formatMessage({ id: getTranslation('modal.query.placeholder') })}
                                name="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ query: e.target.value })}
                                value={state.query}
                            />
                        </Field.Root>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Close >
                            <Button variant="tertiary" >{formatMessage({ id: getTranslation('modal.btn.cancel') })}</Button>
                        </Modal.Close>
                        <Button >{formatMessage({ id: getTranslation('modal.btn.confirm') })}</Button>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root >
    );
}

export default ChartModal;