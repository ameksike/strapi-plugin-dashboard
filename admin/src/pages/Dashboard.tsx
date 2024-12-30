import React from 'react';
import { Box, Typography, Grid } from '@strapi/design-system';
import { Flex } from '@strapi/design-system';
import { EmptyStateLayout } from '@strapi/design-system';
import ChartModal from '../components/ChartModal';
import Illo from '../components/Lilo';
import { Chart } from '../models/Chart';
import chartService from "../../../server/src/utils/Chart";

const Dashboard: React.FC = () => {

    function onConfirm(obj: Chart) {
        console.log(obj);
        chartService.create(obj);
    }

    return (
        <>
            <Flex
                gap={{
                    initial: 1,
                    medium: 4,
                    large: 8
                }}
                direction={{
                    initial: 'column',
                    medium: 'column'
                }}
                alignItems={{
                    initial: 'center',
                    medium: 'flex-start'
                }}
            >
                <Box padding={1} hasRadius>
                    <Box padding={6} background="neutral100" shadow="tableShadow" hasRadius>
                        <Typography variant="beta">KS Virt Dashboard</Typography>
                        <Typography textColor="neutral600">This is a custom dashboard with a static value</Typography>
                    </Box>

                </Box>
                <Box padding={8} background="neutral100">
                    <EmptyStateLayout
                        icon={<Illo />}
                        content="You don't have any chart yet..."
                        action={
                            <ChartModal onConfirm={onConfirm} />
                        } />
                </Box>
            </Flex>
        </>
    );
};

export default Dashboard;
