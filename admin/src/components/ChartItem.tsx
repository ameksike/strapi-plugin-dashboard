import { Area, Bar, Line } from "recharts"
import { Axis } from "../models/Chart"

export function ChartItem({ item, index }: { item: Axis, index: number }) {
    switch (item?.type?.toLowerCase()) {
        case "bar":
            return <Bar type="monotone" dataKey={item.key} stroke={item.stroke} fill={item.fill} key={index} barSize={item.barSize ?? 10} />

        case "area":
            return <Area type="monotone" dataKey={item.key} stroke={item.stroke} fill={item.fill} activeDot={item.active} key={index} />

        default:
            return <Line type="monotone" dataKey={item.key} stroke={item.stroke} activeDot={item.active} key={index} />
    }
}