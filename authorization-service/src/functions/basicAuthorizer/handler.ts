import { Context, Callback, APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { Effects } from 'src/models';
import { generatePolicy } from 'src/utils/generatePolicy';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, context: Context, cb: Callback): Promise<APIGatewayAuthorizerResult> => {
    console.log(event, context, cb);

    let policy: APIGatewayAuthorizerResult = null;

    if (event.type !== 'TOKEN') {
        cb('Unathourized')
    }

    try {
        const {authorizationToken, methodArn} = event;
        console.log('authorizationToken, methodArn:', authorizationToken, methodArn)
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const [userName, password] = plainCreds;

        const allowedPass = process.env[userName];
        const effects = !allowedPass || allowedPass != password ? Effects.Deny : Effects.Allow;
        policy = generatePolicy(encodedCreds, methodArn, effects);

        cb(null, policy)
        return policy

    } catch (error) {
        cb('Unathourized: ' + error.message)
    }
};

export const main = basicAuthorizer;
