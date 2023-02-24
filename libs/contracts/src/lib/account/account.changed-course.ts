import { UserPurchaseState } from '@student-helper/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangedCourse {
	export const topic = 'account.changed-course.event';

	export class Request {
		@IsString()
		userId: string;

		@IsString()
		courseId: string;

		@IsString()
		status: UserPurchaseState;
	}
}
