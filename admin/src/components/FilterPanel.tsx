import { Flex, Box } from "@strapi/design-system";
import { Check } from '@strapi/icons';
import { Chart, Filters, Vars } from "../models/Chart";
import { useReducer } from "react";
import { Button } from "@strapi/design-system";
import { FilterItem } from "./FilterItem";
import { useIntl } from "react-intl";
import { getTranslation } from "../utils/getTranslation";

interface FilterPanelProp {
    data: Chart;
    ctrl?: FilterCtrl;
    onApply?: (state: Filters) => void;
}

export function FilterPanel({ data, ctrl, onApply }: FilterPanelProp) {
    const control = ctrl || FilterPanelCtrl(data);
    const { formatMessage } = useIntl();

    return (
        <Flex
            padding={4}
            direction={{
                initial: 'column',
                medium: 'row'
            }}
            style={{
                alignItems: "center",
                justifyContent: "flex-end"
            }}
        >
            {data.vars?.map(item => FilterItem({ item, control, style: { marginRight: "4px" } }))}
            <Box paddingLeft={2}><Button variant="tertiary" onClick={() => onApply instanceof Function && onApply(control.state)} label={formatMessage({ id: getTranslation('page.show.btn.apply') })}> <Check /> </Button></Box>
        </Flex >
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