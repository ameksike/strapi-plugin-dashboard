import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { NavLink, useParams } from 'react-router-dom';
import { Box, Typography, Main, Loader, Alert, LinkButton } from '@strapi/design-system';
import { PLUGIN_ID } from '../pluginId';
import { Chart } from '../models/Chart';
import { ChartView } from '../components/ChartView';
import { useCharts } from '../service/useChart';
import { getTranslation } from '../utils/getTranslation';
import { ChartModalCtrl, ChartModal } from '../components/ChartModal';
import { Header } from '../components/Header';
import { ArrowLeft } from '@strapi/icons';

const ViewPage: React.FC = () => {
    const { id } = useParams();
    const ctlChartModal = ChartModalCtrl();
    const { formatMessage } = useIntl();
    const { isLoading, error, chart, create, update, remove } = useCharts({ all: false, id });

    function onConfirm(obj: Chart) {
        if (obj?.id) {
            update(obj?.id!, obj);
            console.log("onConfirm:update", obj)
        } else {
            create(obj);
            console.log("onConfirm:create", obj)
        }
    }

    const onEdit = async (obj: Chart) => {
        console.log("onEdit", obj);
        ctlChartModal.open(obj);
    };

    const onDel = useCallback(async (obj: Chart) => {
        obj?.id && remove(obj.id);
    }, []);

    if (isLoading) {
        return <Loader>{formatMessage({ id: getTranslation('msg.loading') })}</Loader>
    }

    return (
        <Main>
            <Header subtitle='page.show.subtitle' />
            <Box margin={5}>
                <ChartModal onConfirm={onConfirm} ctrl={ctlChartModal} />

                {error && (
                    <Alert width="100%" closeLabel="Close" title="Title" variant="danger">
                        {formatMessage({ id: getTranslation('error.retrieve') })}
                    </Alert>
                )}

                {chart && <ChartView data={chart} onEdit={onEdit} onDel={onDel} size={({ height: 600, width: 1800 })} />}

                <Box marginTop={4}>
                    <LinkButton as={NavLink} variant="ghost" to={`/plugins/${PLUGIN_ID}`}>
                        <ArrowLeft /> <Typography variant="omega"> {formatMessage({ id: getTranslation('page.btn.back') })}</Typography>
                    </LinkButton>
                </Box>
            </Box>
        </Main>
    )
};

export default ViewPage;
