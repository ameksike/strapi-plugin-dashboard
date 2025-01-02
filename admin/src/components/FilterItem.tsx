import { Vars } from "../models/Chart"
import { FilterCtrl } from "./FilterPanel";
import { SingleSelect } from "@strapi/design-system";
import { SingleSelectOption } from "@strapi/design-system";

export function FilterItem({ item, control, style }: { item: Vars, control: FilterCtrl, style?: { [key: string]: any } }) {
    switch (item?.component?.toLowerCase()) {

        default:
            return <SingleSelect
                key={item.key}
                onClear={() => control.dispatch({ [item.key]: null })}
                value={control.state[item.key]}
                onChange={(value: string) => control.dispatch({ [item.key]: value })}
                style={style}
            >
                {(item.value as Array<{ key: string; value: string }>).map(i => (<SingleSelectOption key={i.key} value={i.key}>{i.value}</SingleSelectOption>))}
            </SingleSelect>
    }
}