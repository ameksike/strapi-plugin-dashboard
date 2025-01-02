import { SingleSelectOption } from "@strapi/design-system";
import { SingleSelect } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Chart, Filters, Vars } from "../models/Chart";
import { useReducer } from "react";
import { Button } from "@strapi/design-system";

interface FilterPanelProp {
    data: Chart;
    ctrl?: FilterCtrl;
    onApply?: (state: Filters) => void;
}

export function FilterPanel({ data, ctrl, onApply }: FilterPanelProp) {
    const { dispatch, state } = ctrl || FilterPanelCtrl(data);

    return (
        <Box >
            {data.vars?.map(item => {
                return (<SingleSelect
                    key={item.key}
                    onClear={() => dispatch({ [item.key]: null })}
                    value={state[item.key]}
                    onChange={(value: string) => dispatch({ [item.key]: value })}
                >
                    {(item.value as Array<{ key: string; value: string }>).map(i => (<SingleSelectOption key={i.key} value={i.key}>{i.value}</SingleSelectOption>))}
                    <SingleSelectOption value="strawberry">Strawberry</SingleSelectOption>
                </SingleSelect>)
            })}
            <Button onClick={() => onApply instanceof Function && onApply(state)}> Apply </Button>
        </Box>
    );
}

export interface FilterCtrl {
    state: Filters;
    dispatch: React.Dispatch<Filters>;
}

export const FilterPanelCtrl = (data: Chart) => {
    const extract = (dta?: Vars[]) => {
        return dta?.reduce((acc, item) => (acc[item.key as string] = item.defaults) && acc, {} as { [key: string]: any }) || {};
    }
    const [state, dispatch] = useReducer((state, action) => (
        { ...state, ...action }),
        { ...extract(data.vars) }
    );
    return {
        state,
        dispatch
    };
}