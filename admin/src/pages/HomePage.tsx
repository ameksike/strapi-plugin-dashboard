import { Main, Grid, EmptyStateLayout, Box, Loader, Typography } from '@strapi/design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';
import { useCharts } from '../service/useChart';
import { ChartView } from '../components/ChartView';
import Illo from '../components/Lilo';
import ChartModal from '../components/ChartModal';
import { Chart } from '../models/Chart';

const StyledBox = styled(Box)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.neutral100};
  height: 80px
`;

const HomePage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isLoading, error, charts, create, update, remove } = useCharts();

  function onConfirm(obj: Chart) {
    create(obj);
  }

  function onEdit(obj: Chart) {
    obj?.id && update(obj.id, obj);
  }

  if (isLoading) {
    return <Loader>Loading content...</Loader>
  }

  return (
    <Main>
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
          {charts.map((chart) => (
            <Grid.Item key={chart.id} col={6} s={12} xs={12} margin={2}>
              <ChartView data={chart} onEdit={onEdit} />
            </Grid.Item>
          ))}

          <Grid.Item col={4} md={6} s={12} margin={2}>
            <Box width="100%" background="neutral100">
              <EmptyStateLayout
                icon={<Illo />}
                content="You don't have any chart yet..."
                action={
                  <ChartModal onConfirm={onConfirm} />
                } />
            </Box>
          </Grid.Item>
        </Grid.Root>
      </Box>
    </Main>
  );
};

export { HomePage };