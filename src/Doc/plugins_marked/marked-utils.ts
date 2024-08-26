import { Tokens } from 'marked';

export const tokenIsHeading = (
    token: Tokens.Generic,
): token is Tokens.Heading => {
    return token.type === 'heading';
};
