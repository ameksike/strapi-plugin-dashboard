import { Main, Grid, EmptyStateLayout, Box, Loader, Typography } from '@strapi/design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';
import { useCharts } from '../service/useChart';
import { ChartView } from '../components/ChartView';
import Illo from '../components/Lilo';
import ChartModal, { ChartModalCtrl } from '../components/ChartModal';
import { Chart } from '../models/Chart';
import { useCallback, useState } from 'react';
import { Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';

const StyledBox = styled(Box)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.neutral100};
  height: 80px
`;

const HomePage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isLoading, error, charts, create, update, remove } = useCharts();
  const ctlChartModal = ChartModalCtrl();

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
    return <Loader>Loading content...</Loader>
  }

  return (
    <Main>
      <ChartModal onConfirm={onConfirm} ctrl={ctlChartModal} />

      <Box>
        <StyledBox padding={3} >
          <Typography variant="beta">Welcome to {formatMessage({ id: getTranslation('plugin.name') })}</Typography>
        </StyledBox >
        <Box>
          <Typography textColor="neutral600">This is a custom dashboard with a static value</Typography>
        </Box>
      </Box>

      <Box>
        <Grid.Root padding={8} >
          {charts.map((chart, index) => (
            <Grid.Item key={chart.id + "-" + index} col={6} s={12} xs={12} margin={2}>
              <ChartView data={chart} onEdit={onEdit} onDel={onDel} />
            </Grid.Item>
          ))}

          <Grid.Item col={4} md={6} s={12} margin={2}>
            <Box width="100%" background="neutral100">
              <EmptyStateLayout
                icon={<Illo />}
                content={(
                  <Button variant="tertiary" startIcon={<Plus />} onClick={() => ctlChartModal.open()}>Create a new Chart</Button>
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