import { Typography } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { getTranslation } from '../utils/getTranslation';

export const StyledBox = styled(Box)`
    border-radius: ${({ theme }) => theme.borderRadius};
    background-color: ${({ theme }) => theme.colors.neutral100};
    height: 35px;
    margin-top: 25px;
    display: flex;
    align-items: center;
`;

export function Header({ title = 'home.title', subtitle = 'home.subtitle' }: { title?: string; subtitle?: string; }) {
    const { formatMessage } = useIntl();
    return (
        <Box>
            <StyledBox padding={3} >
                <Typography variant="beta">{formatMessage({ id: getTranslation(title) })}</Typography>
            </StyledBox >
            <Box style={{ marginLeft: "11px" }}>
                <Typography textColor="neutral600">{formatMessage({ id: getTranslation(subtitle) })}</Typography>
            </Box>
        </Box>
    );
}