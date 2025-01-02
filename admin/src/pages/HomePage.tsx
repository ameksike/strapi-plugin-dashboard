import { Main, Grid, EmptyStateLayout, Box, Loader, Typography, Alert, Button, LinkButton } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';

import Illo from '../components/Lilo';
import { ChartView } from '../components/ChartView';
import ChartModal, { ChartModalCtrl } from '../components/ChartModal';
import { Chart } from '../models/Chart';
import { useCharts } from '../service/useChart';
import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';

const StyledBox = styled(Box)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.neutral100};
  height: 80px
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const ctlChartModal = ChartModalCtrl();
  const { isLoading, error, charts, create, update, remove } = useCharts({ all: true });

  const onShow = (obj: Chart) => {
    navigate(`/admin/plugins/${PLUGIN_ID}/${obj.id}`);
  };

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
      <ChartModal onConfirm={onConfirm} ctrl={ctlChartModal} />

      <LinkButton as={NavLink} to={`/admin/plugins/ksvirt/1735773224413`}>
        Mi Enlace
      </LinkButton>

      <Box>
        <StyledBox padding={3} >
          <Typography variant="beta">{formatMessage({ id: getTranslation('home.title') })}</Typography>
        </StyledBox >
        <Box>
          <Typography textColor="neutral600">{formatMessage({ id: getTranslation('home.subtitle') })}</Typography>
        </Box>
      </Box>

      <Box>
        <Grid.Root padding={8} >
          {error && (
            <Alert width="100%" closeLabel="Close" title="Title" variant="danger">
              {getTranslation('error.retrieve')}
            </Alert>
          )}

          {!charts?.length && !error && (
            <Loader>{formatMessage({ id: getTranslation('msg.loading') })}</Loader>
          )}

          {charts.map((chart, index) => (
            <Grid.Item key={chart.id + "-" + index} col={6} s={12} xs={12} margin={2}>
              <ChartView data={chart} onEdit={onEdit} onDel={onDel} onView={onShow} />
            </Grid.Item>
          ))}

          <Grid.Item col={4} md={6} s={12} margin={2}>
            <Box width="100%" background="neutral100">
              <EmptyStateLayout
                icon={<Illo />}
                content={(
                  <Button variant="tertiary" startIcon={<Plus />} onClick={() => ctlChartModal.open()}>{formatMessage({ id: getTranslation('home.btn.create') })}</Button>
                )}
              />
            </Box>
          </Grid.Item>
        </Grid.Root>
      </Box>
    </Main>
  );
};

export { HomePage };