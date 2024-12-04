import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CognitoIdentityProviderClient, ListUsersCommand, ConfirmSignUpCommand} from '@aws-sdk/client-cognito-identity-provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { SignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';


@Injectable()
export class AuthService {
    private cognitoClient: CognitoIdentityProviderClient = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
    });

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async register(userDto: any): Promise<any> {
        const signUpCommand = new SignUpCommand({
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            Username: userDto.email,
            Password: userDto.password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: userDto.email,
                },
                {
                    Name: 'name',
                    Value: userDto.name,
                },
            ],
        });

        await this.cognitoClient.send(signUpCommand);

        const newUser = this.userRepository.create({
            username: userDto.name || userDto.email,
            email: userDto.email,
            role: userDto.role || 'bidder',
        });
        return this.userRepository.save(newUser);
    }

    async login(email: string, password: string): Promise<any> {
        const signInCommand = new InitiateAuthCommand({
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });

        const response = await this.cognitoClient.send(signInCommand);

        let user = await this.userRepository.findOne({ where: { email } });

        // console.log('response', response.AuthenticationResult.AccessToken);
        let cognito_id = this.getCognitoId(response.AuthenticationResult.AccessToken);
        // console.log('cognito_id', cognito_id);
        if (!user) {
            user = await this.userRepository.create({
                username: email,
                email,
                role: 'bidder',
                cognito_id: cognito_id,
            });
            await this.userRepository.save(user);
        }else if (user.cognito_id !== cognito_id) {
            user.cognito_id = cognito_id;
            await this.userRepository.save(user);
        }
        return {
            token: response.AuthenticationResult,
            user,
        };
    }

    async verifyToken(token: string): Promise<any> {
        try {
            // 1. 先解码 token 获取 header 中的 kid
            const decodedToken = jwt.decode(token, { complete: true });
            if (!decodedToken) {
                throw new UnauthorizedException('Invalid token format');
            }

            // 2. 获取 JWKS
            const url = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
            const jwks = await fetch(url).then((res) => res.json());

            // 3. 根据 kid 找到对应的公钥
            const kid = decodedToken.header.kid;
            const jwk = jwks.keys.find((key: any) => key.kid === kid);
            
            if (!jwk) {
                throw new UnauthorizedException('No matching key found');
            }

            // 4. 转换为 PEM 格式并验证
            const jwkToPem = require('jwk-to-pem');
            const pem = jwkToPem(jwk);
            return jwt.verify(token, pem, { algorithms: ['RS256'] });
        } catch (error) {
            console.error('Token verification error:', error);
            throw new UnauthorizedException('Token verification failed');
        }
    }

    async syncUsers() {
        const command = new ListUsersCommand({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        });
        const response = await this.cognitoClient.send(command);

        response.Users.forEach(async (cognitoUser) => {
            const email = cognitoUser.Attributes.find((attr) => attr.Name === 'email')?.Value;
            const name = cognitoUser.Attributes.find((attr) => attr.Name === 'name')?.Value;

            let user = await this.userRepository.findOne({ where: { email } });
            if (user) {
                user.username = name;
                await this.userRepository.save(user);
            } else {
                user = this.userRepository.create({
                    username: name,
                    email,
                    role: 'bider',
                });
                await this.userRepository.save(user);
            }
        });
    }

    async confirmSignUp(email: string, code: string): Promise<any> {
        const confirmSignUpCommand = new ConfirmSignUpCommand({
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
        });

        await this.cognitoClient.send(confirmSignUpCommand);
        return { message: '邮箱验证成功' };
    }

    getCognitoId(token: string): string {
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            throw new Error('Invalid token');
        }
        return decoded.payload.sub as string;
    }

    async getUserFromToken(token: string): Promise<User | null> {
        try {
            const decoded = await this.verifyToken(token);
            // console.log('Decoded token:', decoded);
            const cognito_id = decoded['sub'];
            // console.log('cognito_id', cognito_id);
            const user = await this.userRepository.findOne({ where: { cognito_id } });
            // console.log('user', user);
            return user;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }

    async getCurrentUser(token: string) {
        let user = await this.getUserFromToken(token);
        // console.log('user:', user);
        return user;
    }
}
