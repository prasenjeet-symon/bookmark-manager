import { ApiEventData } from '.';

export class AuthenticationEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     * Send password reset link
     */
}
