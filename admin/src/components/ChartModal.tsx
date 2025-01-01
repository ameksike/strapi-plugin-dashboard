import { TextInput, Textarea, Button, Modal, JSONInput, Field } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { FormEvent, useState } from "react";
import { Chart, protoChart, toStr } from "../models/Chart";

interface CharModalProps {
    onConfirm?: (value: Chart) => void;
    data?: Chart
}

type GetChart = (param: string) => Chart | null;

function ChartModal({ onConfirm, data }: CharModalProps) {
    const [name, setName] = useState(data?.label || "");
    const [query, setQuery] = useState(data?.query || "");
    const [config, setConfig] = useState(toStr(data || protoChart));
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const getConfig: GetChart = (value: string) => {
        try {
            const local = JSON.parse(config);
            if (typeof local !== 'object' || local === null) {
                throw new Error('The value must be a valid JSON object.');
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
        if (name.length > 40) {
            return "Content is too long";
        }
        return null;
    };

    const handlerClose = () => {
        setOpen(false);
        setName("");
        setQuery("");
        setConfig(toStr(data || protoChart));
    };

    const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let proto = getConfig(config);
        if (proto && !error) {
            proto.label = proto.label || name;
            proto.query = proto.query || query;
            onConfirm instanceof Function && onConfirm(proto);
            handlerClose();
        } else {
            console.log(error)
        }
    }

    return (
        <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Trigger>
                <Button variant="secondary" startIcon={<Plus />} onClick={() => setOpen(true)} >Create a chart</Button>
            </Modal.Trigger>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Add a new Chart</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleConfirm} >
                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    
                            <Field.Root name="name" marginBottom={4} required>
                                <Field.Label>Name</Field.Label>
                                <TextInput
                                    placeholder="How do you want to name your chart?"
                                    label="Name"
                                    name="text"
                                    hint="Max 40 characters"
                                    error={handleError()}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    value={name}
                                />
                            </Field.Root>

                            <Field.Root id="config" marginBottom={4} required>
                                <Field.Label>Chart Config</Field.Label>
                                <JSONInput
                                    value={config}
                                    aria-label="JSON"
                                    error={error}
                                    onChange={(value: string) => setConfig(value)}
                                />
                                <Field.Error />
                                <Field.Hint />
                            </Field.Root>

                            <Field.Root name="query" marginBottom={4} required>
                                <Field.Label>Query</Field.Label>
                                <Textarea
                                    placeholder="How do you want to render in your chart?"
                                    name="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                    value={query}
                                />
                            </Field.Root>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Close >
                            <Button variant="tertiary" >Cancel</Button>
                        </Modal.Close>
                        <Button >Confirm</Button>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root >
    );
}

export default ChartModal;