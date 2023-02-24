import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountLogin, AccountRegister } from '@student-helper/contracts';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { getMongoConfig } from '../configs/mongo.config';
import { UserModule } from '../user/user.module';
import { UserRepository } from './../user/repositories/user.repository';
import { AuthModule } from './auth.module';

const authLogin: AccountLogin.Request = {
	email: 's@s.uz',
	password: '1'
}

const authRegister: AccountRegister.Request = {
	...authLogin,
	displayName: 'Samar'
}

describe('AuthController', () => {
	let app: INestApplication;
	let userRepository: UserRepository;
	let rmqService: RMQTestService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
				RMQModule.forTest({}),
				UserModule,
				AuthModule,
				MongooseModule.forRootAsync(getMongoConfig()),
			]
		}).compile();

		app = module.createNestApplication();
		userRepository = app.get<UserRepository>(UserRepository);
		rmqService = app.get(RMQService);
		await app.init();
	})

	it('Register', async () => {
		const res = await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, authRegister);

		expect(res.email).toEqual(authRegister.email);
	});

	it('Login', async () => {
		const res = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
			AccountLogin.topic,
			authLogin
		);

		expect(res.access_token).toBeDefined();
	});

	afterAll(async () => {
		await userRepository.deleteUser(authRegister.email);
		app.close();
	})
})
