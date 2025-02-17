import { BehaviorSubject } from 'rxjs';
import { AdminPaymentEvent } from './admin-payment.event';
import { AuthenticationEvent } from './authentication.event';
import { CategoryEvent } from './category.event';
import { TabEvent } from './tab.event';
import { UserPaymentEvent } from './user-payment.event';
import { UserEvent } from './user.event';

export interface ApiEventData {
    name: string;
    data: any;
    timestamp: number; // in sec
}

// Hold all the action names
export class ApiEventNames {
    public static readonly SEND_PASSWORD_RESET_LINK_EMAIL = 'send_forgot_password_link';
    public static readonly SEND_RESET_PASSWORD_SUCCESS_EMAIL = 'send_reset_password_success_email';
    public static readonly SEND_GREETING_EMAIL = 'send_greeting_email';
    public static readonly SEND_FAREWELLS_EMAIL = 'send_farewells_email';
    public static readonly TAB_DELETED = 'tab_deleted';
    public static readonly TAB_CREATED = 'tab_created';
    public static readonly CATEGORY_DELETED = 'category_deleted';
    public static readonly CATEGORY_CREATED = 'category_created';
    public static readonly LINK_DELETED = 'link_deleted';
    public static readonly LINK_CREATED = 'link_created';
    public static readonly USER_DELETED = 'user_deleted';
    public static readonly USER_CREATED = 'user_created';
    public static readonly USER_LOGIN = 'user_login';
    public static readonly INIT_USER_SUBSCRIPTION = 'init_user_subscription';
    public static readonly ADMIN_PLAN_CREATION = 'admin_plan_creation';
    public static readonly INIT_USER_FREE_TRIAL = 'init_user_free_trial';
    public static readonly SEND_SUBSCRIPTION_CANCELLATION_EMAIL = 'send_subscription_cancellation_email';
    public static readonly SEND_SUBSCRIPTION_ACTIVATION_EMAIL = 'send_subscription_activation_email';
    public static readonly SEND_FREE_TRIAL_INITIATED_EMAIL = 'send_free_trial_initiated_email';
}

export class ApiEvent {
    private static instance: ApiEvent;
    private source: BehaviorSubject<ApiEventData> = new BehaviorSubject<ApiEventData>({
        name: '',
        data: {},
        timestamp: 0,
    });

    private constructor() {
        this.source.subscribe((data) => {
            switch (data.name) {
                case ApiEventNames.USER_CREATED:
                    new UserEvent(data).createdUser();
                    break;

                case ApiEventNames.SEND_GREETING_EMAIL:
                    new UserEvent(data).sendGreetingEmail();
                    break;

                case ApiEventNames.SEND_PASSWORD_RESET_LINK_EMAIL:
                    new AuthenticationEvent(data).sendPasswordResetLinkEmail();
                    break;

                case ApiEventNames.SEND_RESET_PASSWORD_SUCCESS_EMAIL:
                    new AuthenticationEvent(data).sendResetPasswordSuccessEmail();
                    break;

                case ApiEventNames.USER_DELETED:
                    new UserEvent(data).deleteUser();
                    break;

                case ApiEventNames.SEND_FAREWELLS_EMAIL:
                    new UserEvent(data).sendFarewellsEmail();
                    break;

                case ApiEventNames.TAB_DELETED:
                    new TabEvent(data).deletedTab();
                    break;

                case ApiEventNames.CATEGORY_DELETED:
                    new CategoryEvent(data).deletedCategory();
                    break;

                case ApiEventNames.INIT_USER_FREE_TRIAL:
                    new UserPaymentEvent(data).startFreeTrial();
                    break;

                case ApiEventNames.ADMIN_PLAN_CREATION:
                    new AdminPaymentEvent(data).newSubscriptionPlan();
                    break;

                case ApiEventNames.SEND_FREE_TRIAL_INITIATED_EMAIL:
                    new UserPaymentEvent(data).sendFreeTrialEmail();
                    break;

                case ApiEventNames.SEND_SUBSCRIPTION_ACTIVATION_EMAIL:
                    new UserPaymentEvent(data).sendSubscriptionInitiatedEmail();
                    break;

                case ApiEventNames.SEND_SUBSCRIPTION_CANCELLATION_EMAIL:
                    new UserPaymentEvent(data).sendSubscriptionCancelledEmail();
                    break;
            }
        });
    }

    public static getInstance(): ApiEvent {
        if (!ApiEvent.instance) {
            ApiEvent.instance = new ApiEvent();
        }
        return ApiEvent.instance;
    }

    // Dispatch event
    public dispatch(name: string, data: any) {
        this.source.next({
            name: name,
            data: data,
            timestamp: Date.now() / 1000,
        });
    }
}
