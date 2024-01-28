import { ApiEventData } from '.';

export class UserEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    // Send greeting email
    async sendGreetingEmail() {
       
    }
}
