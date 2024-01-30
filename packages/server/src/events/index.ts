import { BehaviorSubject } from 'rxjs';
import { AuthenticationEvent } from './authentication.event';
import { CategoryEvent } from './category.event';
import { TabEvent } from './tab.event';
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
