import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Box, Typography, Main, Loader, Alert } from '@strapi/design-system';
import { Chart } from '../models/Chart';
import { ChartView } from '../components/ChartView';
import { useCharts } from '../service/useChart';
import { getTranslation } from '../utils/getTranslation';
import { ChartModalCtrl, ChartModal } from '../components/ChartModal';
import srvChart from "../service/charsrv";

const StyledBox = styled(Box)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.neutral100};
  height: 80px
`;

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
            <Box>
                <StyledBox padding={3} >
                    <Typography variant="beta">{formatMessage({ id: getTranslation('home.title') })}</Typography>
                </StyledBox >
                <Box>
                    <Typography textColor="neutral600">{formatMessage({ id: getTranslation('home.subtitle') })}</Typography>
                </Box>
            </Box>
            <Box margin={5}>
                <ChartModal onConfirm={onConfirm} ctrl={ctlChartModal} />
                {error && (
                    <Alert width="100%" closeLabel="Close" title="Title" variant="danger">
                        {formatMessage({ id: getTranslation('error.retrieve') })}
                    </Alert>
                )}
                {chart && <ChartView data={chart} onEdit={onEdit} onDel={onDel} />}
            </Box>
        </Main>
    )
};

export default ViewPage;
