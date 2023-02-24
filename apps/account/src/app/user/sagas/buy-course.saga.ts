import { UserPurchaseState } from '@student-helper/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateCanceled, BuyCourseSagaStatePurchased, BuyCourseSagaStateStarted, BuyCourseSagaStateWaitingForPayment } from './buy-course.steps';

export class BuyCourseSaga {
	private state: BuyCourseSagaState;

	constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {
		this.setState(user.getCourseState(courseId), courseId);
	}

	setState(state: UserPurchaseState, courseId: string) {
		switch (state) {
			case UserPurchaseState.Started:
				this.state = new BuyCourseSagaStateStarted();
				break;
			case UserPurchaseState.WaitingForPayment:
				this.state = new BuyCourseSagaStateWaitingForPayment();
				break;
			case UserPurchaseState.Purchased:
				this.state = new BuyCourseSagaStatePurchased();
				break;
			case UserPurchaseState.Canceled:
				this.state = new BuyCourseSagaStateCanceled();
				break;
		}
		this.state.setContext(this);
		this.user.setCourseStatus(courseId, state);
	}

	getState() {
		return this.state;
	}
}
