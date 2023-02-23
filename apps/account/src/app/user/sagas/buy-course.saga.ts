import { UserPurchaseState } from '@student-helper/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateStarted } from './buy-course.steps';

export class BuyCourseSaga {
	private state: BuyCourseSagaState;

	constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) { }

	setState(state: UserPurchaseState, courseId: string) {
		switch (state) {
			case UserPurchaseState.Started:
				this.state = new BuyCourseSagaStateStarted();
				break;
			case UserPurchaseState.WaitingForPayment:
				break;
			case UserPurchaseState.Purchased:
				break;
			case UserPurchaseState.Canceled:
				break;
		}
		this.state.setContext(this);
		this.user.setCourseStatus(courseId, state);
	}

	getState() {
		return this.state;
	}
}
