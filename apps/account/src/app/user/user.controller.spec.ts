import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountBuyCourse, AccountLogin, AccountRegister, AccountUserInfo, CourseGetCourse, PaymentGenerateLink } from '@student-helper/contracts';
import { verify } from 'jsonwebtoken';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { AuthModule } from '../auth/auth.module';
import { getMongoConfig } from '../configs/mongo.config';
import { UserRepository } from './repositories/user.repository';
import { UserModule } from './user.module';

const authLogin: AccountLogin.Request = {
	email: 's2@s.uz',
	password: '1'
}

const authRegister: AccountRegister.Request = {
	...authLogin,
	displayName: 'Samar'
}

const courseId = 'courseId'

describe('UserController', () => {
	let app: INestApplication;
	let userRepository: UserRepository;
	let rmqService: RMQTestService;
	let configService: ConfigService;
	let token: string;
	let userId: string;

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
		configService = app.get<ConfigService>(ConfigService);
		await app.init();

		await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, authRegister);
		const { access_token } = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
			AccountLogin.topic,
			authLogin
		);
		token = access_token;
		const data = verify(token, configService.get('JWT_SECRET'));
		userId = data['id'];
	})

	it('AccountUserInfo', async () => {
		const res = await rmqService.triggerRoute<AccountUserInfo.Request, AccountUserInfo.Response>(
			AccountUserInfo.topic,
			{ id: userId }
		)

		expect(res.profile.displayName).toEqual(authRegister.displayName);
	});

	it('BuyCourse', async () => {
		const paymentLink = 'sameLink'
		rmqService.mockReply<CourseGetCourse.Response>(
			CourseGetCourse.topic,
			{
				course: {
					_id: courseId,
					price: 1000
				}
			});
		rmqService.mockReply<PaymentGenerateLink.Response>(
			PaymentGenerateLink.topic,
			{ paymentLink })

		const res = await rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(
			AccountBuyCourse.topic,
			{ userId, courseId }
		);

		expect(res.paymentLink).toEqual(paymentLink);

		await expect(
			rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(
				AccountBuyCourse.topic,
				{ userId, courseId }
			)
		).rejects.toThrowError();
	});

	afterAll(async () => {
		await userRepository.deleteUser(authRegister.email);
		app.close();
	})
})
